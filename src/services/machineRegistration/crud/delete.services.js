const { dbQuery } = require('../../../utils/dbFunctions');

const deleteService = {
    delete: async (req, res, companyId) => {

        const query =
            `DELETE 
            FROM companies
            WHERE companyId = ${companyId}`;

        const result = await dbQuery(query);

        return {
            success: true,
            result
        }
    }
};

module.exports = deleteService;
