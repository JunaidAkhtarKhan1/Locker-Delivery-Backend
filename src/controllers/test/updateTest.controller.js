const updateTestService = require("../../services/test/updateTest.services");

exports.updateAllTest = async (req, res) => {
  try {
    let result = {};
    result = await updateTestService.updateTest(req, res);
    return res.status(result?.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
