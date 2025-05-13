const getPollingService = require("../../services/androidPayment/getPolling.services");

exports.getPolling = async (req, res) => {
  try {
    const result = await getPollingService.getPolling(req, res);
    return res.status(result.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
