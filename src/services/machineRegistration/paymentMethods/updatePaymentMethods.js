const { dbQuery, dbUpdateGeneral } = require("../../../utils/dbFunctions");

const updatePaymentMethodsService = {
  updatePaymentMethods: async (req, res) => {
    const { paymentMethodId, paymentName } = req.body;
    if (paymentMethodId === undefined)
      return {
        success: false,
        message: "please provide paymentMethodId",
      };
    if (paymentName === undefined)
      return {
        success: false,
        message: "please provide paymentName",
      };

    const obj = { paymentMethodId };
    const query = `
                UPDATE paymentmethods
                    SET	?
                    WHERE ?
                `;

    const data = [req.body, obj];

    const result = await dbUpdateGeneral(query, data);

    return {
      success: true,
      message: "payment Method updated",
      userUpdated: result,
    };
  },
};

module.exports = updatePaymentMethodsService;
