const { dbQuery } = require("../../utils/dbFunctions");

const postVMCService = {
  postVMC: async (req, res) => {
    let query;
    const { deviceId, accountType } = req.body;
    if (deviceId === undefined)
      return {
        success: false,
        message: "please provide deviceId",
      };
    if (accountType === undefined)
      return {
        success: false,
        message: "please provide accountType",
      };

    query = `SELECT paymentId 
            FROM paymentmodes
            WHERE machineId=${deviceId} AND paymentModeTag='${accountType}'`;
    console.log(query);

    const result = await dbQuery(query);

    console.log(result[0]);

    const { paymentId } = result[0];

    return {
      success: true,
      paymentId,
    };
  },
};

module.exports = postVMCService;
