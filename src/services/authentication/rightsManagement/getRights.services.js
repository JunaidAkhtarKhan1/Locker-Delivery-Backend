const { dbQuery } = require("../../../utils/dbFunctions");

const getRightsManagementService = {
  getRightsManagement: async (req, res, companyId) => {
    let query = "";
    const roleId = req.query.roleId ? req.query.roleId : null;
    if (roleId)
      query = `SELECT * FROM adminrights WHERE adminRoleId = ${roleId}`;
    else query = `SELECT * FROM adminrights`;

    const roleRights = await dbQuery(query);
    return { success: true, data: roleRights };
  },
};

module.exports = getRightsManagementService;
