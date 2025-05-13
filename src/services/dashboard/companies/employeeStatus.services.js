const { dbQuery } = require('../../../utils/dbFunctions');

const employeeStatusService = {
    employeeStatus: async (req, res, companyId) => {

        const companyUserId = req.body.companyUserId;
        const employeeStatus = req.body.employeeStatus;
        let deleteEmployee = req.body.deleteEmployee;
        let query;

        if (deleteEmployee === undefined) deleteEmployee = 0;

        if (companyId !== undefined) {
            if (companyUserId.length != 0) {
                query =
                    `UPDATE companyusers
                SET isActive = ${employeeStatus},
                    isDeleted = ${deleteEmployee}`;

                query = query.concat(`
                WHERE companyId = ${companyId} AND companyUserId IN (${companyUserId.toString()})`);

                const result = await dbQuery(query);

                return {
                    success: true,
                    result,
                    message: "Employee Status Updated"
                }
            }
            return {
                success: false,
                message: "Employee Id's not found"
            }
        }
        return {
            success: false,
            message: "Company Id not found"
        }
    },
    employeeStatusCompany: async (req, res, companyId) => {

        const companyUserId = req.body.companyUserId;
        const employeeStatus = req.body.employeeStatus;
        let deleteEmployee = req.body.deleteEmployee;
        let query;

        if (deleteEmployee === undefined) deleteEmployee = 0;

        if (companyUserId.length != 0) {
            query =
                `UPDATE companyusers
            SET isActive = ${employeeStatus},
                isDeleted = ${deleteEmployee}`;

            query = query.concat(`
            WHERE companyId = ${companyId} AND companyUserId IN (${companyUserId});`);

            const result = await dbQuery(query);

            return {
                success: true,
                result,
                message: "Employee Status Updated"
            }
        }
        return {
            success: false,
            message: "Employ Id's not found"
        }
    }
};

module.exports = employeeStatusService;
