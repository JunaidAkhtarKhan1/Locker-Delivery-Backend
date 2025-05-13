const readAdminUserRoleService = require("../../../services/machineRegistration/adminUserRoles/read.services");

exports.readAdminUserRoles = async (req, res) => {
  try {
    const { permissionArray, companyId } = req.user;
    // console.log(companyId);

    let result = {};
    console.log(permissionArray);

    if (permissionArray.includes("superAdmin")) {
      result = await readAdminUserRoleService.readAdminUserRoles(req, res);
    } else if (permissionArray.includes("admin")) {
      result = await readAdminUserRoleService.readAdminUserRoles(req, res);
    } else result = { success: false, message: "Permission access denied" };

    return res.status(result.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
