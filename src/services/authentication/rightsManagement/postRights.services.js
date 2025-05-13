const { dbQuery } = require("../../../utils/dbFunctions");

const postRolesManagementService = {
  postRolesManagement: async (req, res) => {
    let query;
    const { adminRoleCategory } = req.body;
    if (adminRoleCategory === undefined)
      return {
        success: false,
        message: "please provide adminRoleCategory",
      };
    // if (bankTag === undefined)
    //   return {
    //     success: false,
    //     message: "please provide bankTag",
    //   };

    query = `INSERT INTO adminroles(
                adminRoleCategory
                
            )
            VALUES (
                '${adminRoleCategory}'

            )`;

    const result = await dbQuery(query);

    return {
      success: true,
      message: "New role added",
      result,
    };
  },
};

module.exports = postRolesManagementService;
