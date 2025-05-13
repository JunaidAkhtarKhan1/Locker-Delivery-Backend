const { paginate, dbQuery } = require("../../../utils/dbFunctions");

const getRolesManagementService = {
  getRolesManagement: async (req, res, companyId) => {
    const query = `SELECT * FROM adminroles WHERE adminRoleCategory != 'superAdmin'`;

    const result = await dbQuery(query);
    return { success: true, data: result };
  },
};

module.exports = getRolesManagementService;
