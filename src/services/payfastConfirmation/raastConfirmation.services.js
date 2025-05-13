const { dbQuery } = require("../../utils/dbLive");

const raastTransactionService = {
  raastPaymentConfirmation: async (req, res) => {
    const { basket_id, transaction_id, amount, err_code } = req.body;
    const orderId = parseInt(basket_id);
    console.log(orderId);
    console.log(err_code);
    console.log(amount);
    const merchantAmount = parseInt(amount);

    const query = `SELECT * FROM orders 
                   WHERE orderId=${orderId}`;

    const result = await dbQuery(query);
    console.log(result);
    if (result.length === 0)
      return { success: false, message: "order doesn't exist" };
    const { price, transactionStatus } = result[0];
    // const amount = price.toString();
    console.log(price);
    console.log(amount);

    if (transactionStatus !== "generated")
      return { success: false, message: "order processed already" };

    if (price == merchantAmount && (err_code === "00" || err_code === "000")) {
      const updateQuery = `UPDATE orders
      SET transactionStatus='approved',
        transactionId='${transaction_id}'
        WHERE orderId=${orderId}`;

      const updateResult = await dbQuery(updateQuery);

      return {
        success: true,
        message: "payment approved",
      };
    } else {
      const updateQuery = `UPDATE orders
      SET transactionStatus='rejected'
        WHERE orderId=${orderId}`;

      const updateResult = await dbQuery(updateQuery);

      return {
        success: false,
        message: "payment rejected",
      };
    }
  },
};
module.exports = raastTransactionService;
