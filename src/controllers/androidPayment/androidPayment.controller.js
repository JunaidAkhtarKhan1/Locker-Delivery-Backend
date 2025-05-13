const androidPaymentService = require("../../services/androidPayment/androidPayment.services");

exports.androidPayment = async (req, res) => {
  try {
    const result = await androidPaymentService.androidPayment(req, res);
    return res.status(result.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
