const { dbQuery, dbUpdateGeneral } = require("../../../utils/dbFunctions");

const updateRightsManagementService = {
  updateRightsManagement: async (req, res) => {
    //Check if the body is empty
    if (req.body.length === 0)
      return {
        success: false,
        message: "please provide data",
      };
    let result;
    for (const element of req.body) {
      //Update Query
      const query = `
      UPDATE adminrights
          SET	\`add\` = ${element.add},
              \`edit\` = ${element.edit},
              \`delete\` = ${element.delete},
              \`view\` = ${element.view}
          WHERE adminRightsId = ${element.adminRightsId}
      `;
      console.log(query);

      result = await dbQuery(query);
    }

    return {
      success: true,
      message: "role updated",
      result,
    };
  },
};

module.exports = updateRightsManagementService;
