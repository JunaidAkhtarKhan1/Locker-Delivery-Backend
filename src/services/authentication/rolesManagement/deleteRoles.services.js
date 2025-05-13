const { dbQuery } = require("../../../utils/dbFunctions");

const deleteRolesManagementService = {
  deleteRolesManagement: async (req, res, companyId) => {
    const { id } = req.body;
    const adminRoleId = id;
    // const { adminRoleId } = req.body;

    if (adminRoleId === undefined) {
      return {
        success: false,
        message: "Please provide adminRoleId",
      };
    }

    const query = `DELETE
            FROM adminroles
            WHERE adminRoleId = ${adminRoleId}`;

    const result = await dbQuery(query);

    return {
      success: true,
      message: "adminRole is deleted successfully",
      result,
    };
  },
};

module.exports = deleteRolesManagementService;
