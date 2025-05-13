const { dbQuery } = require('../../../utils/dbFunctions');

const createService = {
    create: async (req, res, companyId) => {

        let query;
        const { companyName } = req.body;

        // const dateNow = new Date(Date.now() + 18000000)
        //     .toISOString()
        //     .slice(0, 19)
        //     .replace("T", " ");

        query =
            `INSERT INTO companies(
                companyName
            )
            VALUES (
                '${companyName}'
            )`;

        // const result = await dbQuery(query);

        return {
            success: true,
            message: "New company added"
        }
    }
};

module.exports = createService;
