const postRolesManagementService = require("../../../services/authentication/rolesManagement/postRoles.services");

exports.postAllRolesManagement = async (req, res) => {
  try {
    const { permissionArray, companyId } = req.user;
    let result = {};
    if (
      permissionArray.includes("superAdmin") ||
      permissionArray.includes("admin")
    ) {
      result = await postRolesManagementService.postRolesManagement(req, res);
    }
    return res.status(result?.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
