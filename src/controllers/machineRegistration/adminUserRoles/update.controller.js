const updateAdminUserRoleService = require("../../../services/machineRegistration/adminUserRoles/update.services");

exports.updateAdminUserRoles = async (req, res) => {
    try {
        const { permissionArray, companyId } = req.user;

        let result = {};

        if (permissionArray.includes('admin')) {
            result = await updateAdminUserRoleService.updateAdminUserRoles(req, res);
        }
        // if (permissionArray.includes('admin')) {
        //     const companyId = req.query.companyId;
        //     result = await updateAdminUserRoleService.updateAdminUserRoles(req, res, companyId);
        // }
        else
            result = { success: false, message: "Permission access denied" }

        return res.status(result.success ? 200 : 400).send(result);
    }
    catch (error) {
        res.status(500).send({ success: false, message: error });
    }
};