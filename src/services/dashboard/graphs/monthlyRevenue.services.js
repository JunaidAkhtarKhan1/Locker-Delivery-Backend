const { dbQuery } = require("../../../utils/dbFunctions");

const monthlyRevenueGraphService = {
  monthlyRevenueGraph: async (req, res, companyId) => {
    const labels = [];
    const data = [];

    let query = `SELECT DATE_FORMAT(timestamp, '%Y-%m') AS monthYear,
                      SUM(price) AS totalPrice
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
      data.push(element.totalPrice);
    }
    console.log(result);

    const monthlyRevenueList = {
      labels,
      datasets: {
        label: "Revenue(PKR)",
        data,
      },
    };

    return {
      success: true,
      monthlyRevenueList,
      result,
    };
  },
  adminMonthlyRevenueGraph: async (req, res, companyId) => {
    const labels = [];
    const data = [];

    const query = `SELECT DATE_FORMAT(timestamp, '%Y-%m') AS monthYear,
                      SUM(price) AS totalPrice,
                      SUM(deductCompanyBalance) AS totalCompanySales,
                      SUM(deductRechargeBalance) AS totalPersonalSales
                  FROM orders
                  JOIN paymentmodes USING (paymentId)
                  JOIN machines USING (machineId)
                  JOIN companies c USING (companyId)
                  LEFT JOIN rfidorders USING (orderId)
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
      if (element.totalCompanySales != null)
        data.push(element.totalPrice - element.totalCompanySales);
      else data.push(element.totalPrice - 0);
    }
    console.log(result);

    const monthlyRevenueList = {
      labels,
      datasets: {
        label: "Revenue(PKR)",
        data,
      },
    };

    return {
      success: true,
      monthlyRevenueList,
      result,
    };
  },
  partnerMonthlyRevenueGraph: async (req, res, companyId) => {
    const labels = [];
    const data = [];

    const query = `SELECT DATE_FORMAT(timestamp, '%Y-%m') AS monthYear,
                      SUM(price) AS totalPrice,
                      SUM(deductCompanyBalance) AS totalCompanySales,
                      SUM(deductRechargeBalance) AS totalPersonalSales
                  FROM orders
                  JOIN paymentmodes USING (paymentId)
                  JOIN machines USING (machineId)
                  JOIN companies c USING (companyId)
                  LEFT JOIN rfidorders USING (orderId)
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
      if (element.totalCompanySales != null)
        data.push(element.totalPrice - element.totalCompanySales);
      else data.push(element.totalPrice - 0);
    }
    console.log(result);

    const monthlyRevenueList = {
      labels,
      datasets: {
        label: "Revenue(PKR)",
        data,
      },
    };

    return {
      success: true,
      monthlyRevenueList,
      result,
    };
  },
  companyMonthlyRevenueGraph: async (req, res, companyId) => {
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
                    SUM(price) AS totalPrice,
                    SUM(deductCompanyBalance) AS totalCompanySales,
                    SUM(deductRechargeBalance) AS totalPersonalSales
                FROM orders
                JOIN paymentmodes USING (paymentId)
                JOIN machines USING (machineId)
                JOIN companies c USING (companyId)
                LEFT JOIN rfidorders USING (orderId)
                  WHERE transactionStatus IN ('complete', 'approved')
                  AND transactionType IN ('debit-both', 'debit-company')
                  AND timestamp >= DATE_SUB(NOW(), INTERVAL 11 MONTH)
                  AND c.companyId = ${companyId}
                GROUP BY DATE_FORMAT(timestamp, '%Y-%m')
                ORDER BY monthYear;`;
    } else {
      query = `SELECT DATE_FORMAT(timestamp, '%Y-%m') AS monthYear,
                      SUM(price) AS totalPrice,
                      SUM(deductCompanyBalance) AS totalCompanySales,
                      SUM(deductRechargeBalance) AS totalPersonalSales
                  FROM orders
                  JOIN paymentmodes USING (paymentId)
                  JOIN machines USING (machineId)
                  JOIN companies c USING (companyId)
                  LEFT JOIN rfidorders USING (orderId)
                    WHERE transactionStatus IN ('complete', 'approved')
                    AND ((transactionType IS NULL) OR (transactionType IN ('debit', 'debit-recharge','debit-both')))
                    AND timestamp >= DATE_SUB(NOW(), INTERVAL 11 MONTH)
                    AND c.companyId = ${companyId}
                  GROUP BY DATE_FORMAT(timestamp, '%Y-%m')
                  ORDER BY monthYear;`;
    }

    console.log(query);

    const result = await dbQuery(query);

    if (isCompany)
      for (const element of result) {
        const dateObj = new Date(element.monthYear);
        let month = dateObj.toLocaleString("default", { month: "short" });
        month = `${month} ${dateObj.getFullYear().toString().slice(-2)}`;
        element.month = month;
        labels.push(element.month);
        if (element.totalCompanySales != null)
          data.push(element.totalCompanySales);
        else data.push(0);
      }
    else
      for (const element of result) {
        const dateObj = new Date(element.monthYear);
        let month = dateObj.toLocaleString("default", { month: "short" });
        month = `${month} ${dateObj.getFullYear().toString().slice(-2)}`;
        element.month = month;
        labels.push(element.month);
        if (element.totalCompanySales != null)
          data.push(element.totalPrice - element.totalCompanySales);
        else data.push(element.totalPrice - 0);
      }
    console.log(result);

    const monthlyRevenueList = {
      labels,
      datasets: {
        label: "Revenue(PKR)",
        data,
      },
    };

    return {
      success: true,
      monthlyRevenueList,
      result,
    };
  },
};

module.exports = monthlyRevenueGraphService;
