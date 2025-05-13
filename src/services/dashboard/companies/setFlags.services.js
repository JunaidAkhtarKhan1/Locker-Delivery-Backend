const { dbQuery } = require("../../../utils/dbFunctions");

const setFlagService = {
  setFlags: async (req, res, companyId) => {
    const companyPriority = req.body.companyPriority;
    let companyRfid = req.body.companyRfid;
    let balanceFlag = "recharge";

    if (companyPriority == 1) balanceFlag = "company";

    if (companyRfid === undefined) companyRfid = 0;

    const query = `UPDATE companyflags
                    SET companyRfid=${companyRfid},
                        balanceFlag='${balanceFlag}'
                    WHERE companyId=${companyId};`;

    const result = await dbQuery(query);

    return {
      success: true,
      result,
      message: "Company Flags Updated",
    };
  },
};

module.exports = setFlagService;
