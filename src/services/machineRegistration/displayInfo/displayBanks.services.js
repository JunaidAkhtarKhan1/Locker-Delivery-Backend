const { dbQuery } = require('../../../utils/dbFunctions');

const readBanksService = {
    readBanks: async (req, res, companyId) => {

        const query =
            `SELECT *
            FROM banks`;

        const result = await dbQuery(query);

        return {
            success: true,
            result
        }
    }
};

module.exports = readBanksService;
