const { dbQuery } = require('../../../utils/dbFunctions');

const companiesService = {
    companies: async (req, res) => {
        const { permissionArray, companyId } = req.user;

        if (permissionArray.includes('admin') ||
            permissionArray.includes('partner')) {

            const companyIdQuery = req.query.companyId;
            let result;

            if (companyIdQuery !== undefined) {
                //Call database for the specific company List
                const query = `SELECT *
                        FROM companies
                        WHERE companyId=${companyIdQuery}`

                result = await dbQuery(query);
            }
            else {
                //Call database for the company List
                const query = `SELECT *
                        FROM companies`

                result = await dbQuery(query);
            }
            return {
                success: true,
                result
            };
        }
        else if (permissionArray.includes('staffAdmin') ||
            permissionArray.includes('staffFinance') ||
            permissionArray.includes('staffHR')) {

            //Call database for the specific company List
            const query = `SELECT *
                        FROM companies
                        WHERE companyId=${companyId}`

            const result = await dbQuery(query);

            return {
                success: true,
                result
            };
        }
        return {
            success: false,
            result: 'Permission access denied'
        }
    },
};

module.exports = companiesService;
