const { dbQuery } = require('../../../../utils/dbFunctions');

const rfidService = {
    rfidList: async (req, res, companyId) => {

        let query;

        if (companyId === undefined) {
            query =
                `SELECT *
                FROM companyusers`;
        }
        else {
            query =
                `SELECT *
                FROM companyusers
                WHERE companyId = ${companyId}`;
        }

        const result = await dbQuery(query);

        return {
            success: true,
            result
        }
    },
    rfidListCompany: async (req, res, companyId) => {

        const { companyUserId } = req.body;

        if (companyUserId.length === 0)
            return {
                success: false,
                message: "Please provide companyUserIds"
            }

        const query =
            `UPDATE companyusers
                SET isDeleted = 1
            WHERE companyId = ${companyId} AND companyUserId IN (${companyUserId.toString()})`;

        const result = await dbQuery(query);

        return {
            success: true,
            message: 'Employees deleted',
            totalEmployees: result.affectedRows
        }
    }
};

module.exports = rfidService;
