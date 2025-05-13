const postRolesManagementService = require("../../../services/authentication/rolesManagement/postRoles.services");

exports.postAllRolesManagement = async (req, res) => {
  try {
    let result = {};
    result = await postRolesManagementService.postRolesManagement(req, res);
    return res.status(result?.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
