const { dbQuery } = require('../../../utils/dbFunctions');

const readAdminUserService = {
    readAdminUsers: async (req, res, companyId) => {

        const query =
            `SELECT *
            FROM adminusers`;

        const result = await dbQuery(query);

        return {
            success: true,
            result
        }
    }
};

module.exports = readAdminUserService;
