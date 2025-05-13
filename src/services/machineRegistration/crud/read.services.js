const { dbQuery } = require('../../../utils/dbFunctions');

const readService = {
    read: async (req, res, companyId) => {

        const query =
            `SELECT *
            FROM companies`;

        const result = await dbQuery(query);

        return {
            success: true,
            result
        }
    }
};

module.exports = readService;
