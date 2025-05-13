const { dbQuery } = require("../../utils/dbFunctions");

const getPollingService = {
  getPolling: async (req, res) => {
    const query = `SELECT * FROM androidpolling 
                     ORDER BY androidPollingId DESC
                     LIMIT 100;`;

    const result = await dbQuery(query);

    return {
      success: true,
      result,
    };
  },
};

module.exports = getPollingService;
