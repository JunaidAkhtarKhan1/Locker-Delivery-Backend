const { dbQuery } = require("../../utils/dbFunctions");

const deleteTestService = {
  deleteTest: async (req, res, companyId) => {
    const { id } = req.body;
    const testId = id;

    if (testId === undefined) {
      return {
        success: false,
        message: "Please provide testId",
      };
    }

    const query = `DELETE
            FROM test
            WHERE testId = ${testId}`;

    const result = await dbQuery(query);

    return {
      success: true,
      message: "test is deleted successfully",
      result,
    };
  },
};

module.exports = deleteTestService;
