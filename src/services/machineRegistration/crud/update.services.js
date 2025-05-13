const { dbQuery, dbUpdateGeneral } = require('../../../utils/dbFunctions');

const updateService = {
    update: async (req, res, companyId) => {

        if (companyId === undefined)
            return {
                success: false,
                message: "please provide companyId"
            }
        else {
            const { companyName } = req.body;

            if (companyName === undefined)
                return {
                    success: false,
                    message: "companyName doesn't exists"
                }

            // delete req.body.companyId;

            const obj = { companyId };

            const query = `
                UPDATE companies
                    SET	?
                    WHERE ?
                `;

            const data = [req.body, obj];

            const result = await dbUpdateGeneral(query, data);

            return {
                success: true,
                message: "user updated",
                userUpdated: result
            }
        }

    }
}

module.exports = updateService;
