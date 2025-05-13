const { dbQuery, dbUpdateGeneral } = require("../../../../utils/dbFunctions");

const rfidService = {
  rfidList: async (req, res) => {
    const { companyId } = req.body;

    if (companyId === undefined)
      return {
        success: false,
        message: "please provide companyId",
      };
    else {
      const { companyUserId } = req.body;

      if (companyUserId === undefined)
        return {
          success: false,
          message: "companyUserId doesn't exists",
        };

      delete req.body.companyUserId;

      const obj = { companyUserId };

      const query = `
                UPDATE companyusers
                    SET	?
                    WHERE ?
                `;

      const data = [req.body, obj];

      const result = await dbUpdateGeneral(query, data);

      return {
        success: true,
        message: "user updated",
        userUpdated: result.changedRows,
      };
    }
  },
  rfidListCompany: async (req, res, companyId) => {
    const { companyUserId } = req.body;

    if (companyUserId === undefined)
      return {
        success: false,
        message: "companyUserId doesn't exists",
      };

    delete req.body.companyUserId;

    const obj = { companyUserId };

    const query = `
            UPDATE companyusers
                SET	?
                WHERE ?
            `;

    const data = [req.body, obj];

    const result = await dbUpdateGeneral(query, data);

    return {
      success: true,
      message: "user updated",
      userUpdated: result.changedRows,
    };
  },
};

module.exports = rfidService;
