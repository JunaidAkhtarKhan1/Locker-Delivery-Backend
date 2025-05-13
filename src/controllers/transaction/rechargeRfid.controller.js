const { getPaymentInfo } = require("../../utils/dbLive");

const rechargeService = require("../../services/transactions/rechargeRfid.services");

exports.rechargeRfid = async (req, res) => {
  try {
    const paymentId = req.query.paymentId;
    const requestBody = req.body;
    const requestInfo = await getPaymentInfo(paymentId);

    const {
      companyName,
      machineName,
      bankName,
      paymentName,
      paymentDefaultName,
    } = requestInfo;
    const { paymentMethod } = requestBody;
    // console.log(requestInfo);
    // console.log(requestBody);
    let result = {};

    switch (bankName) {
      case "integrationXperts":
        switch (paymentName) {
          case "rfid":
            switch (paymentMethod) {
              case "EPMA":
                result = await rechargeService.easypaisaMobileAccount(
                  paymentId,
                  requestInfo,
                  requestBody
                );
                return res.status(result.success ? 200 : 400).send(result);
              case "EPQR":
                result = await rechargeService.easypaisaQRCode(
                  paymentId,
                  requestInfo,
                  requestBody
                );
                return res.status(result.success ? 200 : 400).send(result);
              case "PAYFAST":
                result = await rechargeService.payfast(
                  paymentId,
                  requestInfo,
                  requestBody
                );
                return res.status(result.success ? 200 : 400).send(result);
              case "raastQR":
                result = await rechargeService.raastQR(
                  paymentId,
                  requestInfo,
                  requestBody
                );
                return res.status(result.success ? 200 : 400).send(result);
            }
        }
      case "easyvend":
        switch (paymentName) {
          case "rfid":
            switch (paymentMethod) {
              case "EPMA":
                result = await rechargeService.easypaisaMobileAccount(
                  paymentId,
                  requestInfo,
                  requestBody
                );
                return res.status(result.success ? 200 : 400).send(result);
              // break;
              case "EPQR":
                result = await rechargeService.easypaisaQRCode(
                  paymentId,
                  requestInfo,
                  requestBody
                );
                return res.status(result.success ? 200 : 400).send(result);
              case "PAYFAST":
                result = await rechargeService.payfast(
                  paymentId,
                  requestInfo,
                  requestBody
                );
                return res.status(result.success ? 200 : 400).send(result);
              case "raastQR":
                result = await rechargeService.raastQR(
                  paymentId,
                  requestInfo,
                  requestBody
                );
                return res.status(result.success ? 200 : 400).send(result);
            }
        }
    }

    return res.status(result.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
