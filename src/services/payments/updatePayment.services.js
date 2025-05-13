// const sql = require('mssql');

const updatePaymentService = {
    updatePayment: async (req, res) => {
        const substationId = req.query.substationId;
        const substationName = req.body.substationName;
        let result;

        if (substationId)
            result = await sql.query
                `UPDATE substations
                SET substationName = ${substationName}
                WHERE substationId = ${substationId}`;
        else
            throw "Please provide substationId in query parameter"

        return {
            success: true,
            result,
        };
    },
};

module.exports = updatePaymentService;
