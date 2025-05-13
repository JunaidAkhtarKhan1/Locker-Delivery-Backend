const postUserService = require("../../services/userManagement/postUser.services");

exports.postAllUser = async (req, res) => {
  try {
    let result = {};
    result = await postUserService.postUser(req, res);
    return res.status(result?.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
