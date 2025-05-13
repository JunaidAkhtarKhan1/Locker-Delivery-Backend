const { dbQuery } = require("../../../utils/dbFunctions");

const deleteAdminUserRoleService = {
  deleteAdminUserRoles: async (req, res) => {
    const { id } = req.body;
    const adminUserRoleId = id;
    // const adminUserRoleId = req.query.adminUserRoleId;

    if (adminUserRoleId === undefined)
      return {
        success: false,
        message: "please provide adminUserRoleId in query",
      };

    const query = `DELETE 
            FROM adminuserroles
            WHERE adminUserRoleId = ${adminUserRoleId}`;

    const result = await dbQuery(query);

    return {
      success: true,
      deletedRows: result.affectedRows,
    };
  },
};

module.exports = deleteAdminUserRoleService;
