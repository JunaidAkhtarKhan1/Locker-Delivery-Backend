const { dbQuery, dbUpdateGeneral } = require("../../utils/dbFunctions");

const updateTestService = {
  updateTest: async (req, res) => {
    const { testId, name, age, number, status } = req.body;
    if (testId === undefined)
      return {
        success: false,
        message: "please provide testId",
      };
    if (name === undefined)
      return {
        success: false,
        message: "please provide name",
      };

    if (age === undefined)
      return {
        success: false,
        message: "please provide age",
      };
    if (number === undefined)
      return {
        success: false,
        message: "please provide number",
      };
    if (status === undefined)
      return {
        success: false,
        message: "please provide status",
      };
    const obj = { testId };
    const query = `
                UPDATE test
                    SET	?
                    WHERE ?
                `;

    const data = [req.body, obj];

    const result = await dbUpdateGeneral(query, data);

    return {
      success: true,
      message: "test updated",
      userUpdated: result,
    };
  },
};

module.exports = updateTestService;
