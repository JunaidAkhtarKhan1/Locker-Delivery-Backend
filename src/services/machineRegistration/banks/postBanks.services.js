const { dbQuery } = require("../../../utils/dbFunctions");

const postBanksService = {
  postBanks: async (req, res) => {
    let query;
    const { bankName, bankTag } = req.body;
    if (bankName === undefined)
      return {
        success: false,
        message: "please provide bankName",
      };
    if (bankTag === undefined)
      return {
        success: false,
        message: "please provide bankTag",
      };

    query = `INSERT INTO banks(
                bankName,
                bankTag
            )
            VALUES (
                '${bankName}',
                '${bankTag}'
            )`;

    const result = await dbQuery(query);

    return {
      success: true,
      message: "New bank added",
      result,
    };
  },
};

module.exports = postBanksService;
