const { dbQuery } = require("../../../utils/dbFunctions");

const deletePaymentModeService = {
  deletePaymentMode: async (req, res) => {
    const { id } = req.body;
    const paymentId = id;

    // const paymentId = req.query.paymentId;

    if (paymentId === undefined)
      return {
        success: false,
        message: "please provide paymentId",
      };

    const query = `DELETE 
            FROM paymentmodes
            WHERE paymentId = ${paymentId}`;

    const result = await dbQuery(query);

    return {
      success: true,
      totalDeletedRows: result.affectedRows,
    };
  },
};

module.exports = deletePaymentModeService;
