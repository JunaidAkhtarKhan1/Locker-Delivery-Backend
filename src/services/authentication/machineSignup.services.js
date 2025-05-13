const { dbQuery } = require('../../utils/dbFunctions');
const jwt = require('jsonwebtoken');

const machineSignupService = {
    machineSignup: async (req, res) => {

        const machineId = req.body.machineId;
        const jwturl = process.env.JWTPRIVATEKEY;
        let token = '';

        if (machineId === undefined) return { success: false }

        const query =
            `SELECT *
            FROM paymentmodes
            LEFT JOIN banks USING (bankId)
            INNER JOIN paymentmethods USING (paymentMethodId)
            INNER JOIN machines USING (machineId)
            INNER JOIN companies USING (companyId)
            WHERE machineId = ${machineId}`;

        const result = await dbQuery(query);
        const paymentMethodId = [];
        const paymentId = [];

        for (const element of result) {
            paymentMethodId.push(element.paymentMethodId);
            paymentId.push(element.paymentId);
        }

        const permissionArray = ['machine'];

        const resultObj = {
            permissionArray,
            companyId: result[0].companyId,
            machineId,
            paymentMethodId,
            paymentId
        };

        token = jwt.sign(resultObj, jwturl);

        return {
            success: true,
            token,
            result: resultObj
        };
    },
};

module.exports = machineSignupService;
