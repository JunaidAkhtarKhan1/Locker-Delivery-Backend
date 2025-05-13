const { dbQuery } = require("../../utils/dbFunctions");
const { getPaymentInfo } = require("../../utils/dbLive");

const transactionService = require("../transactions/transaction.services");

const androidPaymentService = {
  androidPayment: async (req, res) => {
    const { machineSerialId, slotNo, productId, price, mobileNumber } =
      req.body;

    const timestamp = new Date(Date.now() + 18000000)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    if (
      machineSerialId === undefined ||
      slotNo === undefined ||
      productId === undefined ||
      price === undefined
    )
      return {
        success: false,
        message: "Please provide machineSerialId, slotNo, productId and price",
      };
    if (
      machineSerialId === null ||
      slotNo === null ||
      productId === null ||
      price === null
    )
      return {
        success: false,
        message: "Please provide machineSerialId, slotNo, productId and price",
      };

    const queryPaymentMode = `SELECT * FROM paymentmodes
                            INNER JOIN machines USING (machineId)
                            WHERE paymentModeTag='PAYFAST' AND machineSerialId='${machineSerialId}';`;

    const resultPM = await dbQuery(queryPaymentMode);
    if (resultPM.length === 0) {
      return {
        success: false,
        message: "payment method not registered",
      };
    }
    //Select price from polling 1000
    const queryPolling = `SELECT * FROM androidpolling
                          WHERE funCode = 1000 && machineId=${machineSerialId} && slotNo=${slotNo} ;`;

    const resultPolling = await dbQuery(queryPolling);

    const pollPrice = parseInt(resultPolling[0].price);

    const queryPrice = parseInt(price);

    if (queryPrice !== pollPrice)
      return {
        success: false,
        message: "price has been disturbed by the user",
      };

    const { paymentId } = resultPM[0];

    const requestInfo = await getPaymentInfo(paymentId);

    const requestBody = {
      price,
      mobileNumber,
      productId,
    };

    const result = await transactionService.payfastAndroid(
      paymentId,
      requestInfo,
      requestBody
    );

    const { success, url, orderId } = result;

    //Payment Accepted
    if (success === true)
      return { success: true, url, orderId, paymentStatus: "approved" };
    //Payment Rejected
    else return { success: false, paymentStatus: "rejected" };
  },
};

module.exports = androidPaymentService;
