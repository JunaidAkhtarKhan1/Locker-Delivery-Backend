const deleteTestService = require("../../services/test/deleteTest.services");
//
exports.deleteAllTest = async (req, res) => {
  try {
    let result = {};
    result = await deleteTestService.deleteTest(req, res);
    return res.status(result?.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
