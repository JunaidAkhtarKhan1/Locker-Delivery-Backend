const { getPaymentInfo } = require("../../utils/dbLive");

const inquireService = require("../../services/inquireTransaction/inquireTransaction.services");

exports.inquireTransaction = async (req, res) => {
  try {
    const paymentId = req.query.paymentId;
    let loop = req.query.loop;
    const requestBody = req.body;
    const requestInfo = await getPaymentInfo(paymentId);
    const {
      companyName,
      machineName,
      bankName,
      paymentName,
      paymentDefaultName,
    } = requestInfo;
    let result = {};
    if (loop === undefined) loop = "false";

    let timeoutSeconds;
    if (bankName === "easypaisa") timeoutSeconds = 90;
    else if (bankName === "integrationXperts") timeoutSeconds = 90;
    else if (bankName === "easyvend") timeoutSeconds = 90;
    else if (bankName === "payfast") timeoutSeconds = 200;

    const startTime = Date.now();
    console.log("*********HIT ONE TIME***********");

    const whileLoop = async () => {
      const timeNow = Date.now() - startTime;
      const timeout = timeoutSeconds * 1000;

      if (timeNow > timeout) return res.status(408).send("Timeout exceeded");

      switch (bankName) {
        case "easypaisa":
          result = await inquireService.easypaisaInquireTransaction(
            paymentId,
            requestInfo,
            requestBody
          );
          break;
        case "integrationXperts":
          result = await inquireService.easypaisaInquireTransaction(
            paymentId,
            requestInfo,
            requestBody
          );
          break;
        case "easyvend":
          result = await inquireService.easypaisaInquireTransaction(
            paymentId,
            requestInfo,
            requestBody
          );
          break;
        case "payfast":
          result = await inquireService.payfastInquireTransaction(
            paymentId,
            requestInfo,
            requestBody
          );
      }

      console.log(timeNow / 1000);
      console.log(timeout / 1000);

      if (loop != "true")
        return res.status(result.success ? 200 : 400).send(result);
      if (
        result?.responseCode === "0000" &&
        result?.transactionStatus === "PAID"
      )
        return res.status(result.success ? 200 : 400).send(result);
      if (
        result?.transactionStatus === true ||
        result?.transactionStatus === false
      )
        return res.status(result.success ? 200 : 400).send(result);

      setTimeout(whileLoop, 2000);
    };

    whileLoop();
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
