const { dbQuery } = require('../../../utils/dbFunctions');

const readAdminRoleService = {
    readAdminRoles: async (req, res, companyId) => {

        const query =
            `SELECT *
            FROM adminroles`;

        const result = await dbQuery(query);

        return {
            success: true,
            result
        }
    }
};

module.exports = readAdminRoleService;
