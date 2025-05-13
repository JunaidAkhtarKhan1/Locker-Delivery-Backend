const { dbQuery } = require("../../../utils/dbFunctions");

const postRolesManagementService = {
  postRolesManagement: async (req, res) => {
    const { roleName } = req.query;
    if (roleName === undefined)
      return {
        success: false,
        message: "please provide roleName",
      };

    //Get all the data from the admin rights table of superAdmin
    const queryPage = `SELECT * FROM adminrights
                      JOIN adminroles USING (adminRoleId)
                      WHERE adminRoleCategory = 'superAdmin';`;

    const resultPage = await dbQuery(queryPage);
    if (resultPage.length === 0) {
      return {
        success: false,
        message: "No superAdmin data found",
      };
    }
    const query = `INSERT INTO adminroles(
                          adminRoleCategory
                        )
                        VALUES (
                            '${roleName}'
                        )`;

    const result = await dbQuery(query);

    const values = resultPage
      .map((element) => `(${result.insertId}, 0, 0, 0, 0, '${element.page}')`)
      .join(", ");

    const queryPageInsert = `INSERT INTO adminrights(\`adminRoleId\`, \`add\`, \`edit\`, \`delete\`, \`view\`, \`page\`) VALUES ${values}`;

    const finalResult = await dbQuery(queryPageInsert);

    return {
      success: true,
      message: "New role added",
      result: finalResult,
    };
  },
};

module.exports = postRolesManagementService;
