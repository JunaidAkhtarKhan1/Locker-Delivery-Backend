const { dbQuery } = require("../../../utils/dbFunctions");

const createAdminUserRoleService = {
  createAdminUserRoles: async (req, res) => {
    const { adminRoleId, adminUserId } = req.body;
    console.log(req.body);
    console.log("Admin Role Id ", adminRoleId);
    console.log("Admin user Id ", adminUserId);

    if (adminRoleId === undefined || adminUserId === undefined)
      return {
        success: false,
        message: "please provide adminRoleId & adminUserId",
      };

    const query = `INSERT INTO adminuserroles(
                adminRoleId,
                adminUserId
            )
            VALUES (
                ${adminRoleId},
                ${adminUserId}
            )`;

    const result = await dbQuery(query);

    return {
      success: true,
      message: "user permission added",
      result,
    };
  },
};

module.exports = createAdminUserRoleService;
