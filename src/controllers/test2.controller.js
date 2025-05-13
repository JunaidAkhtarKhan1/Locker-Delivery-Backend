const test2Service = require("../services/test2.services");

exports.liveTest2 = async (req, res) => {
  try {
    let result = {};
    result = await test2Service.testAdmin(req, res);
    return res.status(result?.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
