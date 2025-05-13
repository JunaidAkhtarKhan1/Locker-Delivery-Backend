const { dbQuery, dbUpdateGeneral } = require("../../../utils/dbFunctions");

const updateRolesManagementService = {
  updateRolesManagement: async (req, res) => {
    const { adminRoleId, adminRoleCategory } = req.body;
    if (adminRoleId === undefined)
      return {
        success: false,
        message: "please provide roleId",
      };
    if (adminRoleCategory === undefined)
      return {
        success: false,
        message: "please provide adminRoleCategory",
      };

    const obj = { adminRoleId };
    const query = `
                UPDATE adminroles
                    SET	?
                    WHERE ?
                `;

    const data = [req.body, obj];

    const result = await dbUpdateGeneral(query, data);

    return {
      success: true,
      message: "role updated",
      userUpdated: result,
    };
  },
};

module.exports = updateRolesManagementService;
