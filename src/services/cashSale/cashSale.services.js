const { dbQuery } = require("../../utils/dbFunctions");
const { createProduct, productSearch } = require("../../utils/dbLive");

const cashSaleService = {
  postCashSale: async (req, res) => {
    const dateNow = new Date(Date.now() + 18000000)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const { deviceId, productPrice, productId } = req.body;

    const query = `SELECT paymentId FROM paymentmodes WHERE machineId=${deviceId} AND paymentModeTag='CASH'`;
    const result = await dbQuery(query);
    console.log(result);
    const { paymentId } = result[0];
    console.log(result[0]);
    console.log("Payment Id: ");
    console.log(paymentId);

    const products = await productSearch(productId);
    if (products === undefined) await createProduct(productId);
    console.log("Product Id: " + productId);
    const query2 = `INSERT INTO orders(
        price,
        transactionStatus,
        timestamp,
        productId,
        paymentId
    )
    VALUES(
        ${productPrice},
        'complete',
        '${dateNow}',
        '${productId}',
        ${paymentId}
    );`;
    const result2 = await dbQuery(query2);
    console.log(result2);

    return {
      success: true,
      paymentId,
    };
  },
};

module.exports = cashSaleService;
