const { dbQuery } = require('../../../utils/dbFunctions');

const balanceResponseService = {
    balanceResponseCompany: async (req, res, companyId, email) => {

        const { companyBalanceRequestId, balanceStatus } = req.body;

        const query = `SELECT *
                    FROM adminusers
                    WHERE email='${email}' AND companyId=${companyId}`;

        const adminUsers = await dbQuery(query);

        const adminUserId = adminUsers[0].adminUserId;

        const dateNow = new Date(Date.now() + 18000000)
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");

        const balanceRequestQuery = `SELECT *
                                FROM companybalancerequests
                                WHERE companyId='${companyId}' AND companyBalanceRequestId=${companyBalanceRequestId}`;

        const reqDetail = await dbQuery(balanceRequestQuery);
        const { requestStatus, requestBalance } = reqDetail[0];
        console.log("Balance: " + requestBalance);

        if (balanceStatus && requestStatus === 'pending') {

            const employeeListQuery = `SELECT *
                                FROM balancerequestdetails
                                WHERE companyBalanceRequestId=${companyBalanceRequestId}`;

            const requestedEmployeeList = await dbQuery(employeeListQuery);

            const companyUserIdArray = [];

            for (const element of requestedEmployeeList) {
                const companyUserId = element.companyUserId;
                companyUserIdArray.push(companyUserId)
            }
            const companyUserIdString = companyUserIdArray.toString()

            const employeeListUpdateQuery = `UPDATE companyusers
                                        SET companyBalance=${requestBalance}
                                        WHERE companyUserId IN (${companyUserIdString})`;

            const balanceUpdatedInfo = await dbQuery(employeeListUpdateQuery);

            if (balanceUpdatedInfo.affectedRows > 0) {
                const query = `UPDATE companybalancerequests
                                    SET responseUserId=${adminUserId},
                                        responseDate='${dateNow}',
                                        requestStatus='approved'
                                    WHERE companyBalanceRequestId = ${companyBalanceRequestId} AND requestStatus='pending'`;
                const updateQueryBalanceResponse = await dbQuery(query);

                if (updateQueryBalanceResponse.affectedRows) {
                    return {
                        success: true,
                        message: "balance transferred, request status changed to approved"
                    }
                }
            }
        }
        else if (requestStatus === 'pending') {
            const query = `UPDATE companybalancerequests
                                SET responseUserId=${adminUserId},
                                    responseDate='${dateNow}',
                                    requestStatus='rejected'
                                WHERE companyBalanceRequestId = ${companyBalanceRequestId} AND requestStatus='pending'`;
            const updateQueryBalanceResponse = await dbQuery(query);

            if (updateQueryBalanceResponse.affectedRows) {
                return {
                    success: true,
                    message: "request status changed to rejected"
                }
            }
        }

        return {
            success: true,
            message: "request status already updated"
        }

    }
};

module.exports = balanceResponseService;
