const updateUserService = require("../../services/userManagement/updateUser.services");

exports.updateAllUser = async (req, res) => {
  try {
    let result = {};
    result = await updateUserService.updateUser(req, res);
    return res.status(result?.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
