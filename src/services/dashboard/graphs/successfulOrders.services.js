const { dbQuery } = require("../../../utils/dbFunctions");

const successfulOrdersGraphService = {
  successfulOrdersGraph: async (req, res, companyId) => {
    const labels = [];
    const data = [];

    let query = `SELECT DATE_FORMAT(timestamp, '%Y-%m') AS monthYear,
                    COUNT(orderId) AS totalOrders
                  FROM orders
                  JOIN paymentmodes USING (paymentId)
                  JOIN machines USING (machineId)
                  JOIN companies USING (companyId)
                  WHERE transactionStatus IN ('complete', 'approved')
                  AND ((transactionType IS NULL) OR (transactionType != 'credit'))
                  AND timestamp >= DATE_SUB(NOW(), INTERVAL 11 MONTH)`;

    if (companyId !== undefined)
      query = query.concat(`
        AND companyId = ${companyId}`);

    query = query.concat(`
          GROUP BY DATE_FORMAT(timestamp, '%Y-%m') -- Group by month and year
          ORDER BY monthYear;`);

    console.log(query);

    const result = await dbQuery(query);

    for (const element of result) {
      const dateObj = new Date(element.monthYear);
      const month = dateObj.toLocaleString("default", { month: "short" });
      element.month = month;
      labels.push(element.month);
      data.push(element.totalOrders);
    }
    console.log(result);

    const orderList = {
      labels,
      datasets: {
        label: "Orders",
        data,
      },
    };

    return {
      success: true,
      orderList,
      result,
    };
  },
  adminSuccessfulOrdersGraph: async (req, res, companyId) => {
    let isCompany = req.body.isCompany;
    if (isCompany === undefined) isCompany = false;
    const labels = [];
    const data = [];

    const query = `SELECT DATE_FORMAT(timestamp, '%Y-%m') AS monthYear,
                   COUNT(orderId) AS totalOrders
                  FROM orders
                  JOIN paymentmodes USING (paymentId)
                  JOIN machines USING (machineId)
                  JOIN companies USING (companyId)
                    WHERE transactionStatus IN ('complete', 'approved')
                    AND ((transactionType IS NULL) OR (transactionType IN ('debit', 'debit-recharge','debit-both')))
                    AND timestamp >= DATE_SUB(NOW(), INTERVAL 11 MONTH)
                    ${(companyId && `AND c.companyId = ${companyId}`) || ""}
                  GROUP BY DATE_FORMAT(timestamp, '%Y-%m')
                  ORDER BY monthYear;`;

    console.log(query);

    const result = await dbQuery(query);

    for (const element of result) {
      const dateObj = new Date(element.monthYear);
      let month = dateObj.toLocaleString("default", { month: "short" });
      month = `${month} ${dateObj.getFullYear().toString().slice(-2)}`;
      element.month = month;
      labels.push(element.month);
      data.push(element.totalOrders);
    }

    console.log(result);

    const orderList = {
      labels,
      datasets: {
        label: "Orders",
        data,
      },
    };

    return {
      success: true,
      orderList,
      result,
    };
  },

  partnerSuccessfulOrdersGraph: async (req, res, companyId) => {
    let isCompany = req.body.isCompany;
    if (isCompany === undefined) isCompany = false;
    const labels = [];
    const data = [];

    const query = `SELECT DATE_FORMAT(timestamp, '%Y-%m') AS monthYear,
                   COUNT(orderId) AS totalOrders
                  FROM orders
                  JOIN paymentmodes USING (paymentId)
                  JOIN machines USING (machineId)
                  JOIN companies USING (companyId)
                    WHERE transactionStatus IN ('complete', 'approved')
                    AND ((transactionType IS NULL) OR (transactionType IN ('debit', 'debit-recharge','debit-both')))
                    AND timestamp >= DATE_SUB(NOW(), INTERVAL 11 MONTH)
                    ${(companyId && `AND c.companyId = ${companyId}`) || ""}
                  GROUP BY DATE_FORMAT(timestamp, '%Y-%m')
                  ORDER BY monthYear;`;

    console.log(query);

    const result = await dbQuery(query);

    for (const element of result) {
      const dateObj = new Date(element.monthYear);
      let month = dateObj.toLocaleString("default", { month: "short" });
      month = `${month} ${dateObj.getFullYear().toString().slice(-2)}`;
      element.month = month;
      labels.push(element.month);
      data.push(element.totalOrders);
    }

    console.log(result);

    const orderList = {
      labels,
      datasets: {
        label: "Orders",
        data,
      },
    };

    return {
      success: true,
      orderList,
      result,
    };
  },
  companySuccessfulOrdersGraph: async (req, res, companyId) => {
    let isCompany = req.body.isCompany;
    if (isCompany === undefined) isCompany = false;
    const labels = [];
    const data = [];
    if (companyId === undefined)
      return {
        success: false,
        message: "companyId does not exist in this credential",
      };

    let query = "";

    if (isCompany) {
      query = `SELECT DATE_FORMAT(timestamp, '%Y-%m') AS monthYear,
                   COUNT(orderId) AS totalOrders
                  FROM orders
                  JOIN paymentmodes USING (paymentId)
                  JOIN machines USING (machineId)
                  JOIN companies USING (companyId)
                    WHERE transactionStatus IN ('complete', 'approved')
                    AND transactionType IN ('debit-both', 'debit-company')
                    AND timestamp >= DATE_SUB(NOW(), INTERVAL 11 MONTH)
                    AND companyId = ${companyId}
                  GROUP BY DATE_FORMAT(timestamp, '%Y-%m')
                  ORDER BY monthYear;`;
    } else {
      query = `SELECT DATE_FORMAT(timestamp, '%Y-%m') AS monthYear,
                   COUNT(orderId) AS totalOrders
                  FROM orders
                  JOIN paymentmodes USING (paymentId)
                  JOIN machines USING (machineId)
                  JOIN companies USING (companyId)
                    WHERE transactionStatus IN ('complete', 'approved')
                    AND ((transactionType IS NULL) OR (transactionType IN ('debit', 'debit-recharge','debit-both')))
                    AND timestamp >= DATE_SUB(NOW(), INTERVAL 11 MONTH)
                    AND companyId = ${companyId}
                  GROUP BY DATE_FORMAT(timestamp, '%Y-%m')
                  ORDER BY monthYear;`;
    }

    console.log(query);

    const result = await dbQuery(query);

    for (const element of result) {
      const dateObj = new Date(element.monthYear);
      let month = dateObj.toLocaleString("default", { month: "short" });
      month = `${month} ${dateObj.getFullYear().toString().slice(-2)}`;
      element.month = month;
      labels.push(element.month);
      data.push(element.totalOrders);
    }

    console.log(result);

    const orderList = {
      labels,
      datasets: {
        label: "Orders",
        data,
      },
    };

    return {
      success: true,
      orderList,
      result,
    };
  },
};

module.exports = successfulOrdersGraphService;
