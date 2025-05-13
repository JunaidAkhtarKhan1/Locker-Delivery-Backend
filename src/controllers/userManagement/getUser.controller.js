const getUserService = require("../../services/userManagement/getUser.services");

exports.getAllUser = async (req, res) => {
  try {
    let result = {};
    result = await getUserService.getUser(req, res);
    return res.status(result?.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
