const createAdminUserRoleService = require("../../../services/machineRegistration/adminUserRoles/create.services");

exports.createAdminUserRoles = async (req, res) => {
  try {
    const { permissionArray, companyId } = req.user;
    // console.log(companyId);

    let result = {};

    if (permissionArray.includes("admin")) {
      result = await createAdminUserRoleService.createAdminUserRoles(req, res);
    } else if (permissionArray.includes("superAdmin")) {
      const companyId = req.query.companyId;
      result = await createAdminUserRoleService.createAdminUserRoles(
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
