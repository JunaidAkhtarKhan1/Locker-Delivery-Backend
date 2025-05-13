const postTestService = require("../../services/test/postTest.services");

exports.postAllTest = async (req, res) => {
  try {
    let result = {};
    result = await postTestService.postTest(req, res);
    return res.status(result?.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
