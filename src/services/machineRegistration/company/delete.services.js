const { dbQuery } = require("../../../utils/dbFunctions");

const deleteCompanyService = {
  deleteCompany: async (req, res) => {
    const { id } = req.body;
    const companyId = id;
    // console.log(id);
    // console.log(companyId);

    if (companyId === undefined)
      return {
        success: false,
        message: "Please provide companyId in params",
      };
    const query = `DELETE 
            FROM companies
            WHERE companyId = ${companyId}`;

    const result = await dbQuery(query);
    console.log(query);

    return {
      success: true,
      message: "Company Deleted",
      rowsUpdated: result.affectedRows,
    };
  },
};

module.exports = deleteCompanyService;
