const deleteRolesManagementService = require("../../../services/authentication/rolesManagement/deleteRoles.services");

exports.deleteAllRolesManagement = async (req, res) => {
  try {
    const { permissionArray, companyId } = req.user;
    let result = {};
    if (
      permissionArray.includes("superAdmin") ||
      permissionArray.includes("admin")
    ) {
      result = await deleteRolesManagementService.deleteRolesManagement(
        req,
        res
      );
    }
    return res.status(result?.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
