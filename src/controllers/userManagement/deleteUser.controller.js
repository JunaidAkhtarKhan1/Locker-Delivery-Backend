const deleteUserService = require("../../services/userManagement/deleteUser.services");
//
exports.deleteAllUser = async (req, res) => {
  try {
    let result = {};
    result = await deleteUserService.deleteUser(req, res);
    return res.status(result?.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
