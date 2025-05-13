const { dbQuery, dbUpdateGeneral } = require("../../../utils/dbFunctions");

const updateAdminUserRoleService = {
  updateAdminUserRoles: async (req, res) => {
    const { adminRoleId, adminUserId } = req.body;
    const adminUserRoleId = req.body.adminUserRoleId;

    if (adminUserRoleId === undefined)
      return {
        success: false,
        message: "please provide adminUserRoleId in query",
      };

    const obj = { adminUserRoleId };

    const query = `
                UPDATE adminuserroles
                    SET	?
                    WHERE ?
                `;

    const data = [req.body, obj];

    const result = await dbUpdateGeneral(query, data);

    return {
      success: true,
      message: "adminUser role updated",
      userUpdated: result.changedRows,
    };
  },
};

module.exports = updateAdminUserRoleService;
