const { dbQuery, dbUpdateGeneral } = require("../../../utils/dbFunctions");

const updatePaymentModeService = {
  updatePaymentMode: async (req, res) => {
    const paymentId = req.body.paymentId;

    if (paymentId === undefined)
      return {
        success: false,
        message: "please provide paymentId",
      };

    const obj = { paymentId };

    const query = `
                UPDATE paymentmodes
                    SET	?
                    WHERE ?
                `;

    const data = [req.body, obj];

    const result = await dbUpdateGeneral(query, data);

    return {
      success: true,
      message: "paymentmode updated",
      rowsUpdated: result.changedRows,
    };
  },
};

module.exports = updatePaymentModeService;
