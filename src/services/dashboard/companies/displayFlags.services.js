const { dbQuery } = require('../../../utils/dbFunctions');

const displayFlagService = {
    displayFlags: async (req, res, companyId) => {

        const query = `SELECT *
                    FROM companyflags
                    WHERE companyId=${companyId};`

        const result = await dbQuery(query);

        return {
            success: true,
            result,
            message: "Display Company Flags"
        }
    }
};

module.exports = displayFlagService;
