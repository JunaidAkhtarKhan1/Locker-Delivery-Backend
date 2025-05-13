const { dbQuery } = require("../../../utils/dbFunctions");

const weeklySalesGraphService = {
  weeklySalesGraph: async (req, res, companyId) => {
    const labels = [];
    const data = [];

    let query = `SELECT DATE(timestamp) AS orderDate, DAYNAME(timestamp) AS day, SUM(price) AS totalPrice
        FROM orders
        JOIN paymentmodes USING (paymentId)
        JOIN machines USING (machineId)
        JOIN companies USING (companyId)
        WHERE transactionStatus IN ('complete','approved')
        AND ((transactionType IS NULL) OR (transactionType != 'credit'))
        AND timestamp >= DATE_SUB(NOW(), INTERVAL 6 DAY)`;

    if (companyId !== undefined)
      query = query.concat(`
        AND companyId = ${companyId}`);

    query = query.concat(`
        GROUP BY DATE(timestamp), DAYNAME(timestamp)
        ORDER BY orderDate;`);

    console.log(query);

    const result = await dbQuery(query);

    const lastSevenDays = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      lastSevenDays.push(date.toISOString().split("T")[0]);
    }

    for (const element of lastSevenDays) {
      const day = new Date(element).toLocaleDateString("en-US", {
        weekday: "long",
      });
      const found = result.some((item) => item.day === day);
      if (!found)
        result.push({ orderDate: new Date(element), day, totalPrice: 0 });
    }
    result.sort((a, b) => a.orderDate - b.orderDate);
    for (const element of result) {
      element.label = element.day.charAt(0);
      labels.push(element.day.charAt(0));
      data.push(element.totalPrice);
    }

    console.log(result);

    const weeklySalesList = {
      labels,
      datasets: {
        label: "Sales(PKR)",
        data,
      },
    };

    return {
      success: true,
      weeklySalesList,
      result,
    };
  },
  adminWeeklySalesGraph: async (req, res, companyId) => {
    const labels = [];
    const data = [];
    let query = `SELECT DATE(timestamp) AS orderDate, DAYNAME(timestamp) AS day, SUM(price) AS totalPrice
        FROM orders
        JOIN paymentmodes USING (paymentId)
        JOIN machines USING (machineId)
        JOIN companies USING (companyId)
        WHERE transactionStatus IN ('complete','approved')
        AND ((transactionType IS NULL) OR (transactionType != 'credit'))
        AND timestamp >= DATE_SUB(NOW(), INTERVAL 6 DAY)`;

    if (companyId !== undefined)
      query = query.concat(`
      AND companyId = ${companyId}`);

    query = query.concat(`
      GROUP BY DATE(timestamp), DAYNAME(timestamp)
      ORDER BY orderDate;`);

    console.log(query);

    const result = await dbQuery(query);

    const lastSevenDays = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      lastSevenDays.push(date.toISOString().split("T")[0]);
    }

    for (const element of lastSevenDays) {
      const day = new Date(element).toLocaleDateString("en-US", {
        weekday: "long",
      });
      const found = result.some((item) => item.day === day);
      if (!found)
        result.push({ orderDate: new Date(element), day, totalPrice: 0 });
    }

    result.sort((a, b) => a.orderDate - b.orderDate);
    for (const element of result) {
      element.label = element.day.charAt(0);
      labels.push(element.day.charAt(0));
      data.push(element.totalPrice);
    }

    console.log(result);

    const weeklySalesList = {
      labels,
      datasets: {
        label: "Sales(PKR)",
        data,
      },
    };

    return {
      success: true,
      weeklySalesList,
      result,
    };
  },
  partnerWeeklySalesGraph: async (req, res, companyId) => {
    const labels = [];
    const data = [];
    let query = `SELECT DATE(timestamp) AS orderDate, DAYNAME(timestamp) AS day, SUM(price) AS totalPrice
        FROM orders
        JOIN paymentmodes USING (paymentId)
        JOIN machines USING (machineId)
        JOIN companies USING (companyId)
        WHERE transactionStatus IN ('complete','approved')
        AND ((transactionType IS NULL) OR (transactionType != 'credit'))
        AND timestamp >= DATE_SUB(NOW(), INTERVAL 6 DAY)`;

    if (companyId !== undefined)
      query = query.concat(`
      AND companyId = ${companyId}`);

    query = query.concat(`
      GROUP BY DATE(timestamp), DAYNAME(timestamp)
      ORDER BY orderDate;`);

    console.log(query);

    const result = await dbQuery(query);

    const lastSevenDays = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      lastSevenDays.push(date.toISOString().split("T")[0]);
    }

    for (const element of lastSevenDays) {
      const day = new Date(element).toLocaleDateString("en-US", {
        weekday: "long",
      });
      const found = result.some((item) => item.day === day);
      if (!found)
        result.push({ orderDate: new Date(element), day, totalPrice: 0 });
    }

    result.sort((a, b) => a.orderDate - b.orderDate);
    for (const element of result) {
      element.label = element.day.charAt(0);
      labels.push(element.day.charAt(0));
      data.push(element.totalPrice);
    }

    console.log(result);

    const weeklySalesList = {
      labels,
      datasets: {
        label: "Sales(PKR)",
        data,
      },
    };

    return {
      success: true,
      weeklySalesList,
      result,
    };
  },
  companyWeeklySalesGraph: async (req, res, companyId) => {
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
      query = `SELECT DATE(timestamp) AS orderDate, 
                DAYNAME(timestamp) AS day, 
                SUM(price) AS totalPrice,
                SUM(deductCompanyBalance) AS totalCompanySales,
                SUM(deductRechargeBalance) AS totalPersonalSales
              FROM orders
              JOIN paymentmodes USING (paymentId)
              JOIN machines USING (machineId)
              JOIN companies c USING (companyId)
              LEFT JOIN rfidorders USING (orderId)
                WHERE transactionStatus IN ('complete','approved')
                AND transactionType IN ('debit-both', 'debit-company')
                AND timestamp >= DATE_SUB(NOW(), INTERVAL 6 DAY)
                AND c.companyId = ${companyId}
              GROUP BY DATE(timestamp), DAYNAME(timestamp)
              ORDER BY orderDate;`;
    } else {
      query = `SELECT DATE(timestamp) AS orderDate, 
                DAYNAME(timestamp) AS day,
                SUM(price) AS totalPrice,
                SUM(deductCompanyBalance) AS totalCompanySales,
                SUM(deductRechargeBalance) AS totalPersonalSales
              FROM orders
              JOIN paymentmodes USING (paymentId)
              JOIN machines USING (machineId)
              JOIN companies c USING (companyId)
              LEFT JOIN rfidorders USING (orderId)
                WHERE transactionStatus IN ('complete','approved')
                AND ((transactionType IS NULL) OR (transactionType IN ('debit', 'debit-recharge','debit-both')))
                AND timestamp >= DATE_SUB(NOW(), INTERVAL 6 DAY)
                AND c.companyId = ${companyId}
              GROUP BY DATE(timestamp), DAYNAME(timestamp)
              ORDER BY orderDate;`;
    }

    console.log(query);

    const result = await dbQuery(query);

    const lastSevenDays = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      lastSevenDays.push(date.toISOString().split("T")[0]);
    }

    for (const element of lastSevenDays) {
      const day = new Date(element).toLocaleDateString("en-US", {
        weekday: "long",
      });
      const found = result.some((item) => item.day === day);
      if (!found)
        result.push({ orderDate: new Date(element), day, totalPrice: 0 });
    }

    result.sort((a, b) => a.orderDate - b.orderDate);

    if (isCompany)
      for (const element of result) {
        element.label = element.day.charAt(0);
        labels.push(element.day.charAt(0));
        if (element.totalCompanySales != null)
          data.push(element.totalCompanySales);
        else data.push(0);
      }
    else
      for (const element of result) {
        element.label = element.day.charAt(0);
        labels.push(element.day.charAt(0));
        if (element.totalCompanySales != null)
          data.push(element.totalPrice - element.totalCompanySales);
        else data.push(element.totalPrice - 0);
      }

    console.log(result);

    const weeklySalesList = {
      labels,
      datasets: {
        label: "Sales(PKR)",
        data,
      },
    };

    return {
      success: true,
      weeklySalesList,
      result,
    };
  },
};

module.exports = weeklySalesGraphService;
