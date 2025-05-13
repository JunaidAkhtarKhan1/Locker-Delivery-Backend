const { dbQuery } = require('../../../utils/dbFunctions');

const displayBalanceRequestService = {
    displayBalanceRequest: async (req, res, companyId) => {

        const query = `SELECT companyBalanceRequestId, adminusers.name AS makerName, au.name AS checkerName, requestBalance, totalEmployees, requestStatus, requestDate,responseDate, requestType
                    FROM companybalancerequests
                        INNER JOIN adminusers 
                            ON companybalancerequests.requestUserId = adminusers.adminUserId
                        LEFT OUTER JOIN adminusers AS au 
                            ON companybalancerequests.responseUserId = au.adminUserId
                    WHERE companybalancerequests.companyId=${companyId}
                    ORDER BY companyBalanceRequestId DESC;`

        const result = await dbQuery(query);

        for (const element of result) {
            const totalBalance = element.requestBalance * element.totalEmployees
            element.totalBalance = totalBalance;
        }

        return {
            success: true,
            result,
            message: "Display Request Service"
        }
    }
};

module.exports = displayBalanceRequestService;
