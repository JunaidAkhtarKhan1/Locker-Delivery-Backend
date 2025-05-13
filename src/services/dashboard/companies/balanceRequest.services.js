const { dbQuery } = require('../../../utils/dbFunctions');

const balanceRequestService = {
    balanceRequestCompany: async (req, res, companyId, email) => {

        const { balance, isAll, companyUserIds } = req.body;

        // requestType -> allUsers, selectiveUsers

        const query = `SELECT *
                    FROM adminusers
                    WHERE email='${email}'`;

        const adminUsers = await dbQuery(query);
        const adminUserId = adminUsers[0].adminUserId;

        const dateNow = new Date(Date.now() + 18000000)
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");

        if (isAll) {
            const companyUserQuery = `SELECT *
                                    FROM companyusers
                                    WHERE companyId='${companyId}' AND isDeleted=0`;

            const companyUsersList = await dbQuery(companyUserQuery);

            const query = `INSERT INTO companybalancerequests(
                                companyId,
                                requestBalance,
                                requestUserId,
                                requestDate,
                                requestType,
                                requestStatus
                            )
                            VALUES (
                                ${companyId},
                                ${balance},
                                ${adminUserId},
                                '${dateNow}',
                                'allUsers',
                                'pending'
                            )`;

            const result = await dbQuery(query);

            const companyBalanceRequestId = result.insertId;

            if (companyUsersList.length) {
                console.log("Company Users exists");
                let companyUserDataQuery = `INSERT INTO balancerequestdetails(
                    companyBalanceRequestId,companyUserId
                    )
                    VALUES`

                let commaBit = false;

                for (const element of companyUsersList) {
                    if (commaBit === true) companyUserDataQuery = companyUserDataQuery.concat(`,`)
                    commaBit = true;
                    companyUserDataQuery = companyUserDataQuery.concat(`
                    (${companyBalanceRequestId},${element.companyUserId})`);
                }
                companyUserDataQuery = companyUserDataQuery.concat(`;`);

                const { affectedRows } = await dbQuery(companyUserDataQuery);

                if (affectedRows > 0) {

                    const query = `UPDATE companybalancerequests
                                SET totalEmployees=${affectedRows}
                                WHERE companyBalanceRequestId = ${companyBalanceRequestId}`;
                    const updateTotalEmployees = await dbQuery(query);

                    return {
                        success: true,
                        requestId: companyBalanceRequestId,
                        message: "Assigned balance to all employees"
                    }
                }
            }
        }
        else if (isAll === 0 && companyUserIds.length > 0) {
            console.log("company User Ids: " + companyUserIds);
            let companyUserQuery = `SELECT isDeleted
            FROM companyusers`

            companyUserQuery = companyUserQuery.concat(`
            WHERE companyId = ${companyId} AND companyUserId IN (${companyUserIds.toString()})`);

            const resultUserQuery = await dbQuery(companyUserQuery);

            if (companyUserIds.length !== resultUserQuery.length)
                return {
                    success: false,
                    message: "unknown companyUserId in request"
                }

            for (let i = 0; i < resultUserQuery.length; i++) {
                const { isDeleted } = resultUserQuery[i];
                if (isDeleted) companyUserIds.splice(i, 1);
            }

            const query = `INSERT INTO companybalancerequests(
                                companyId,
                                requestBalance,
                                requestUserId,
                                requestDate,
                                requestType,
                                requestStatus
                            )
                            VALUES (
                                ${companyId},
                                ${balance},
                                ${adminUserId},
                                '${dateNow}',
                                'selectiveUsers',
                                'pending'
                            )`;

            const result = await dbQuery(query);

            const companyBalanceRequestId = result.insertId;

            if (companyUserIds.length) {
                let companyUserDataQuery = `INSERT INTO balancerequestdetails(
                        companyBalanceRequestId,companyUserId
                    )
                    VALUES`

                let commaBit = false;

                for (const element of companyUserIds) {
                    if (commaBit === true) companyUserDataQuery = companyUserDataQuery.concat(`,`)
                    commaBit = true;
                    companyUserDataQuery = companyUserDataQuery.concat(`
                    (${companyBalanceRequestId},${element})`);
                }
                companyUserDataQuery = companyUserDataQuery.concat(`;`);

                const { affectedRows } = await dbQuery(companyUserDataQuery);

                if (affectedRows > 0) {
                    const query = `UPDATE companybalancerequests
                                SET totalEmployees=${affectedRows}
                                WHERE companyBalanceRequestId = ${companyBalanceRequestId}`;
                    const updateTotalEmployees = await dbQuery(query);

                    return {
                        success: true,
                        requestId: companyBalanceRequestId,
                        message: "Assigned balance to selected employees"
                    }
                }
            }
        }

        return {
            success: false,
            message: "request status cannot be updated"
        }

    }
};

module.exports = balanceRequestService;
