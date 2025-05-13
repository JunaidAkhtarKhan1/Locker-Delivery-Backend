const { dbQuery } = require('../../../utils/dbFunctions');

const filterService = {
    filters: async (req, res) => {

        const { permissionArray, companyId } = req.user;

        if (permissionArray.includes('admin') ||
            permissionArray.includes('partner') ||
            permissionArray.includes('staffAdmin') ||
            permissionArray.includes('staffFinance') ||
            permissionArray.includes('staffHR')) {

            const banks = await dbQuery(`SELECT * FROM banks`);
            console.log(banks);

            const paymentMethods = await dbQuery(`SELECT * FROM paymentmethods`);
            console.log(paymentMethods);

            const transationStatus = ['pending', 'generated', 'approved', 'rejected', 'complete'];
            console.log(transationStatus);

            return {
                success: true,
                banks,
                paymentMethods,
                transationStatus
            }
        }
        return {
            success: false,
            result: 'Permission access denied'
        }

    },
};

module.exports = filterService;
