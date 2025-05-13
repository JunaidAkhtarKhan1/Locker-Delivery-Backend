const { dbQuery } = require("../../../utils/dbFunctions");

const deleteBanksService = {
  deleteBanks: async (req, res, companyId) => {
    const { id } = req.body;
    const bankId = id;

    if (bankId === undefined) {
      return {
        success: false,
        message: "Please provide bankId",
      };
    }

    const query = `DELETE 
            FROM banks
            WHERE bankId = ${bankId}`;

    const result = await dbQuery(query);

    return {
      success: true,
      message: "Bank is deleted successfully",
      result,
    };
  },
};

module.exports = deleteBanksService;
