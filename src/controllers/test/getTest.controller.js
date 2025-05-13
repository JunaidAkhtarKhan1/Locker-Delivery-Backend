const getTestService = require("../../services/test/getTest.services");

exports.getAllTest = async (req, res) => {
  try {
    let result = {};
    result = await getTestService.getTest(req, res);
    return res.status(result?.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
