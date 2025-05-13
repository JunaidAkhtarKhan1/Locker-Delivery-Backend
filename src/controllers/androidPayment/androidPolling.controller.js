const androidPollingService = require("../../services/androidPayment/androidPolling.services");

exports.androidPolling = async (req, res) => {
  try {
    const result = await androidPollingService.androidPolling(req, res);
    return res.status(result.Status === "0" ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
