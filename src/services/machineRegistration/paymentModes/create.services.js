const { dbQuery } = require("../../../utils/dbFunctions");

const createPaymentModeService = {
  createPaymentMode: async (req, res) => {
    const { bankId, paymentMethodId, machineId, merchantId } = req.body;

    if (bankId === undefined)
      return {
        success: false,
        message: "please provide bankId",
      };
    if (paymentMethodId === undefined)
      return {
        success: false,
        message: "please provide paymentMethodId",
      };
    if (machineId === undefined)
      return {
        success: false,
        message: "please provide machineId",
      };

    if (merchantId === undefined)
      return {
        success: false,
        message: "please provide merchantId",
      };

    const queryPaymentModes = `SELECT * From paymentmodes
                                WHERE bankId=${bankId} 
                                AND paymentMethodId=${paymentMethodId}
                                AND machineId=${machineId}
                                AND merchantId=${merchantId}`;

    const resultPaymentModes = await dbQuery(queryPaymentModes);

    if (resultPaymentModes.length !== 0)
      return {
        success: false,
        message: "record already exists",
      };

    const queryBanks = `SELECT * From banks 
                         WHERE bankId=${bankId}`;

    const resultBanks = await dbQuery(queryBanks);

    const queryPaymentMethod = `SELECT * From paymentmethods
                                WHERE paymentMethodId=${paymentMethodId}`;

    const resultPaymentMethod = await dbQuery(queryPaymentMethod);

    let paymentModeTag =
      resultBanks[0].bankTag + resultPaymentMethod[0].paymentMethodTag;

    console.log(paymentModeTag);
    let paymentDefaultName = "";

    if (paymentModeTag === "EPMOBILEACCOUNT") paymentDefaultName = "MA";
    else if (paymentModeTag === "EPQRCODE")
      paymentDefaultName = "QR_PAYMENT_METHOD";
    else if (paymentModeTag === "RFID") paymentDefaultName = "RFID";

    const query = `INSERT INTO paymentmodes(
                bankId, 
                paymentMethodId, 
                machineId,
                merchantId,
                paymentModeTag,
                paymentDefaultName
            )
            VALUES (
                ${bankId},
                ${paymentMethodId},
                ${machineId},
                ${merchantId},
                '${paymentModeTag}',
                '${paymentDefaultName}'
            )`;

    const result = await dbQuery(query);

    return {
      success: true,
      result,
      message: "New payment mode added for machine",
    };
  },
};

module.exports = createPaymentModeService;
