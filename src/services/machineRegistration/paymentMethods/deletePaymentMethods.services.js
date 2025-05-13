const { dbQuery } = require("../../../utils/dbFunctions");

const deletePaymentMethodsService = {
  deletePaymentMethods: async (req, res, companyId) => {
    const { id } = req.body;
    const paymentMethodId = id;

    if (paymentMethodId === undefined) {
      return {
        success: false,
        message: "Please provide paymentMethodId",
      };
    }

    const query = `DELETE 
            FROM paymentmethods
            WHERE paymentMethodId = ${paymentMethodId}`;

    const result = await dbQuery(query);

    return {
      success: true,
      message: "payment method is deleted successfully",
      result,
    };
  },
};

module.exports = deletePaymentMethodsService;
