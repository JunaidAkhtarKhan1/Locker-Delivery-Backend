const { getPaymentInfo, getPaymentDetails } = require("../../utils/dbLive");

const transactionService = require("../../services/transactions/transaction.services");

exports.liveTransaction = async (req, res) => {
  try {
    const paymentId = req.query.paymentId;
    const requestBody = req.body;
    const requestUser = req.user;
    const requestInfo = await getPaymentInfo(paymentId);
    console.log(requestInfo);
    const {
      companyName,
      machineName,
      bankName,
      paymentName,
      paymentDefaultName,
    } = requestInfo;
    // console.log(requestInfo);
    // console.log(requestBody);
    let result = {};

    //easypaisa -> ma, qr
    //integration xperts -> rfid
    //easyvend -> rfid

    switch (bankName) {
      case "easypaisa":
        switch (paymentName) {
          case "mobileAccount":
            result = await transactionService.easypaisaMobileAccount(
              paymentId,
              requestInfo,
              requestBody
            );
            break;
          case "qrCode":
            result = await transactionService.easypaisaQRCode(
              paymentId,
              requestInfo,
              requestBody
            );
        }
        break;
      case "integrationXperts":
        switch (paymentName) {
          case "rfid":
            result = await transactionService.ixRfid(
              paymentId,
              requestInfo,
              requestBody,
              requestUser
            );
        }
        break;
      case "easyvend":
        switch (paymentName) {
          case "rfid":
            result = await transactionService.rfid(
              paymentId,
              requestInfo,
              requestBody,
              requestUser
            );
        }
        break;
      case "payfast":
        switch (paymentName) {
          case "all":
            result = await transactionService.payfast(
              paymentId,
              requestInfo,
              requestBody
            );
            break;
          case "raastQR":
            result = await transactionService.raastQR(
              paymentId,
              requestInfo,
              requestBody
            );
        }
        break;
    }
    return res.status(result.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
