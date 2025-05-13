const { dbQuery, dbUpdateGeneral } = require("../../../utils/dbFunctions");

const updateBanksService = {
  updateBanks: async (req, res) => {
    const { bankId, bankName } = req.body;
    if (bankId === undefined)
      return {
        success: false,
        message: "please provide bankId",
      };
    if (bankName === undefined)
      return {
        success: false,
        message: "please provide bankName",
      };

    const obj = { bankId };
    const query = `
                UPDATE banks
                    SET	?
                    WHERE ?
                `;

    const data = [req.body, obj];

    const result = await dbUpdateGeneral(query, data);

    return {
      success: true,
      message: "bank updated",
      userUpdated: result,
    };
  },
};

module.exports = updateBanksService;
