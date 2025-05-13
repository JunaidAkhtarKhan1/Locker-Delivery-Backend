const { dbQuery } = require('../../../utils/dbFunctions');

const readPaymentMethodService = {
    readPaymentMethods: async (req, res, companyId) => {

        const query =
            `SELECT *
            FROM paymentMethods`;

        const result = await dbQuery(query);

        return {
            success: true,
            result
        }
    }
};

module.exports = readPaymentMethodService;
