const getPayfastService = require("../../services/payfast/payfast.services");

exports.getPayfast = async (req, res) => {
  try {
    const result = await getPayfastService.getPayfast(req, res);
    return res.status(result.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
