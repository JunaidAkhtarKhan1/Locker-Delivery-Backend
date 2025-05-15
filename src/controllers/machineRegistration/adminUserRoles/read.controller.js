const readAdminUserRoleService = require("../../../services/machineRegistration/adminUserRoles/read.services");

exports.readAdminUserRoles = async (req, res) => {
  try {
    const { permissionArray, companyId } = req.user;

    let result = {};

    if (permissionArray.includes("superAdmin")) {
      result = await readAdminUserRoleService.readAdminUserRoles(req, res);
    } else if (permissionArray.includes("admin")) {
      result = await readAdminUserRoleService.readAdminUserRoles(req, res);
    } else if (permissionArray.includes("staffAdmin")) {
      result = await readAdminUserRoleService.readCompanyAdminUserRoles(
        req,
        res,
        companyId
      );
    } else result = { success: false, message: "Permission access denied" };

    return res.status(result.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
