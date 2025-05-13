const { getPaymentInfo } = require("../../utils/dbLive");

const payfastInquireService = require("../../services/inquireTransaction/inquirePayFast.services");

exports.payfastInquire = async (req, res) => {
  try {
    const paymentId = req.query.paymentId;
    let loop = req.query.loop;
    const requestBody = req.body;
    const requestInfo = await getPaymentInfo(paymentId);
    let result = {};
    let responseSent = false; // Flag to prevent multiple responses

    if (loop === undefined) loop = "false";

    const timeoutSeconds = 200; // Timeout in seconds
    const startTime = Date.now();
    console.log("*********HIT ONE TIME***********");

    const checkPaymentStatus = async () => {
      if (responseSent) return; // Prevent further execution if response is already sent

      const timeNow = Date.now() - startTime;
      const timeout = timeoutSeconds * 1000;

      // Check if the timeout has exceeded
      if (timeNow > timeout) {
        responseSent = true; // Mark that a response is being sent
        return res.status(408).send("Timeout exceeded");
      }

      // Perform inquiry service call
      result = await payfastInquireService.payfastInquire(
        paymentId,
        requestInfo,
        requestBody
      );

      // Check if the payment is verified
      if (
        result?.transactionStatus === true ||
        result?.transactionStatus === false
      ) {
        responseSent = true; // Mark that a response is being sent
        return res.status(result.success ? 200 : 400).send(result);
      } else if (loop === "true") {
        // Retry after 2 seconds if still looping
        setTimeout(checkPaymentStatus, 2000);
      } else {
        // If not looping, send the response based on current result
        responseSent = true; // Mark that a response is being sent
        return res.status(result.success ? 200 : 400).send(result);
      }
    };

    // Start the status check loop
    checkPaymentStatus();
  } catch (error) {
    if (!responseSent) {
      res.status(500).send({ success: false, message: error.message });
    }
  }
};
