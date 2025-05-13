const { dbQuery } = require('../../../utils/dbFunctions');

const displayRequestBalanceEmployeesService = {
    displayRequestBalanceEmployees: async (req, res, companyId) => {

        const companyBalanceRequestId = req.body.companyBalanceRequestId;

        if (companyBalanceRequestId === undefined)
            return {
                success: false,
                message: "Please provice companyBalanceRequestId"
            }
        const query = `SELECT companyUserId, employeeId, name, companyBalance
                    FROM balancerequestdetails
                    INNER JOIN companyusers USING (companyUserId)
                    WHERE companyBalanceRequestId=${companyBalanceRequestId} AND companyId=${companyId};`

        const result = await dbQuery(query);

        return {
            success: true,
            result,
            message: "Display Employee Request Service"
        }
    }
};

module.exports = displayRequestBalanceEmployeesService;
