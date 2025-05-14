const getRolesManagementService = require("../../../services/authentication/rolesManagement/getRoles.services");

exports.getAllRolesManagement = async (req, res) => {
  try {
    const { permissionArray, companyId } = req.user;
    let result = {};

    if (
      permissionArray.includes("superAdmin") ||
      permissionArray.includes("admin")
    ) {
      result = await getRolesManagementService.getRolesManagement(
        req,
        res,
        companyId
      );
    } else if (permissionArray.includes("staffAdmin")) {
      result = await getRolesManagementService.getCompanyRolesManagement(
        req,
        res,
        companyId
      );
    }
    return res.status(result?.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error.toString() });
  }
};
