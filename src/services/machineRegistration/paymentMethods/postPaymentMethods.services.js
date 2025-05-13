const { dbQuery } = require("../../../utils/dbFunctions");

const postPaymentMethods = {
  postPaymentMethods: async (req, res) => {
    let query;
    const { paymentName, paymentMethodTag } = req.body;
    if (paymentName === undefined)
      return {
        success: false,
        message: "please provide paymentName",
      };
    if (paymentMethodTag === undefined)
      return {
        success: false,
        message: "please provide paymentMethodTag",
      };

    query = `INSERT INTO paymentmethods(
                paymentName,
                paymentMethodTag
            )
            VALUES (
                '${paymentName}',
                '${paymentMethodTag}'
            )`;

    const result = await dbQuery(query);

    return {
      success: true,
      message: "New payment Method added",
      result,
    };
  },
};

module.exports = postPaymentMethods;
