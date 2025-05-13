const { dbQuery } = require("../../../utils/dbFunctions");
const {
  getLastMonthDate,
  calculatePercentageChange,
} = require("../../../utils/functions");

const widgetService = {
  widgetList: async (req, res, companyId) => {
    let startDate = req.body.startDate;
    let endDate = req.body.endDate;
    let isMtd = req.body.isMtd; //true-monthlyData false-dailyData
    let result;
    let machines;
    let users;

    if (isMtd === undefined) isMtd = true;

    let query = `SELECT * FROM orders
              JOIN paymentmodes USING (paymentId)
              JOIN machines USING (machineId)
              JOIN companies USING (companyId)
              WHERE transactionStatus IN ('complete','approved')
              AND ((transactionType IS NULL) OR (transactionType != 'credit'))`;

    if (startDate !== undefined && startDate !== "") {
      lastFilter = true;
      query = query.concat(`
                AND (timestamp >= '${startDate} 00:00:00')`);
      if (endDate != undefined) {
        query = query.concat(`
                AND(timestamp <= '${endDate} 23:59:59')`);
      }
    } else if (isMtd === false) {
      const dateToday = new Date(Date.now() + 18000000)
        .toISOString()
        .slice(0, 10)
        .replace("T", " ");

      query = query.concat(`
                  AND (timestamp >= '${dateToday} 00:00:00')
                  AND (timestamp <= '${dateToday} 23:59:59')`);
    } else {
      const startMonthDate = new Date(Date.now() + 18000000)
        .toISOString()
        .slice(0, 8)
        .replace("T", " ");

      const dateToday = new Date(Date.now() + 18000000)
        .toISOString()
        .slice(0, 10)
        .replace("T", " ");

      query = query.concat(`
              AND (timestamp >= '${startMonthDate}01 00:00:00')
              AND (timestamp <= '${dateToday} 23:59:59')`);
    }
    if (companyId != undefined) {
      query = query.concat(`
          AND companyId = ${companyId}`);

      console.log(query);

      result = await dbQuery(query);
      machines = await dbQuery(
        `SELECT * FROM machines WHERE companyId =${companyId}`
      );
      users = await dbQuery(
        `SELECT * FROM companyusers WHERE companyId =${companyId}`
      );
    } else {
      result = await dbQuery(query);
      machines = await dbQuery(`SELECT * FROM machines`);
      users = await dbQuery(`SELECT * FROM users`);
    }

    let totalSales = 0;

    const totalOrders = result.length;
    const totalMachines = machines.length;
    const totalUsers = users.length;

    for (const element of result) {
      totalSales += element.price;
    }

    return {
      success: true,
      totalSales,
      totalOrders,
      totalUsers,
      totalMachines,
      //   result,
      //   users,
    };
  },
  adminWidgetList: async (req, res, companyId) => {
    let isMtd = req.body.isMtd; //true-monthlyData false-dailyData

    if (isMtd === undefined) isMtd = true;

    let queryCash = `SELECT 
                  SUM(price) AS cashSales,
                  COUNT(orderId) AS cashOrders
              FROM orders
              JOIN paymentmodes USING (paymentId)
              JOIN machines USING (machineId)
              JOIN companies c USING (companyId)
              LEFT JOIN rfidorders USING (orderId)
              WHERE paymentModeTag='CASH'
                AND transactionStatus IN ('complete','approved')
                AND transactionType IS NULL`;

    if (isMtd === false) {
      const dateToday = new Date(Date.now() + 18000000)
        .toISOString()
        .slice(0, 10)
        .replace("T", " ");

      queryCash += `
              AND (timestamp >= '${dateToday} 00:00:00')
              AND (timestamp <= '${dateToday} 23:59:59')`;
    } else {
      const startMonthDate = new Date(Date.now() + 18000000)
        .toISOString()
        .slice(0, 8)
        .replace("T", " ");

      const dateToday = new Date(Date.now() + 18000000)
        .toISOString()
        .slice(0, 10)
        .replace("T", " ");

      queryCash += `
              AND (timestamp >= '${startMonthDate}01 00:00:00')
              AND (timestamp <= '${dateToday} 23:59:59')`;
    }
    if (companyId != undefined) {
      queryCash += `
      AND c.companyId = ${companyId}`;
    }

    // console.log(queryCash);
    const resultCash = await dbQuery(queryCash);
    console.log(resultCash);

    let queryCashLM = `SELECT 
                        SUM(price) AS cashSalesLM,
                        COUNT(orderId) AS cashOrdersLM
                    FROM orders
                    JOIN paymentmodes USING (paymentId)
                    JOIN machines USING (machineId)
                    JOIN companies c USING (companyId)
                    LEFT JOIN rfidorders USING (orderId)
                    WHERE paymentModeTag='CASH'
                      AND transactionStatus IN ('complete','approved')
                      AND transactionType IS NULL`;

    if (isMtd) {
      const { startMonthDate, dateToday } = await getLastMonthDate();
      queryCashLM += `
        AND (timestamp >= '${startMonthDate}01 00:00:00')
        AND (timestamp <= '${dateToday} 23:59:59')`;
    } else {
      const { dateToday } = await getLastMonthDate();
      queryCashLM += `
        AND (timestamp >= '${dateToday} 00:00:00')
        AND (timestamp <= '${dateToday} 23:59:59')`;
    }

    if (companyId != undefined) {
      queryCashLM += `
        AND c.companyId = ${companyId}`;
    }

    // console.log(queryCashLM);
    const resultCashLM = await dbQuery(queryCashLM);
    console.log(resultCashLM);

    let query = `SELECT 
                  SUM(price) AS sales,
                  COUNT(orderId) AS cashlessOrders,
                  SUM(deductCompanyBalance) AS companySales,
                  SUM(deductRechargeBalance) AS personalSales 
              FROM orders
              JOIN paymentmodes USING (paymentId)
              JOIN machines USING (machineId)
              JOIN companies c USING (companyId)
              LEFT JOIN rfidorders USING (orderId)
              WHERE paymentModeTag!='CASH'
                AND transactionStatus IN ('complete','approved')
                AND ((transactionType IS NULL) OR (transactionType IN ('debit', 'debit-recharge','debit-both')))`;

    if (isMtd === false) {
      const dateToday = new Date(Date.now() + 18000000)
        .toISOString()
        .slice(0, 10)
        .replace("T", " ");

      query += `
              AND (timestamp >= '${dateToday} 00:00:00')
              AND (timestamp <= '${dateToday} 23:59:59')`;
    } else {
      const startMonthDate = new Date(Date.now() + 18000000)
        .toISOString()
        .slice(0, 8)
        .replace("T", " ");

      const dateToday = new Date(Date.now() + 18000000)
        .toISOString()
        .slice(0, 10)
        .replace("T", " ");

      query += `
              AND (timestamp >= '${startMonthDate}01 00:00:00')
              AND (timestamp <= '${dateToday} 23:59:59')`;
    }
    if (companyId != undefined) {
      query += `
      AND c.companyId = ${companyId}`;
    }

    // console.log(query);
    const result = await dbQuery(query);
    console.log(result);

    let queryCashlessLM = `SELECT 
                  SUM(price) AS salesLM,
                  COUNT(orderId) AS cashlessOrdersLM,
                  SUM(deductCompanyBalance) AS companySalesLM,
                  SUM(deductRechargeBalance) AS personalSalesLM
              FROM orders
              JOIN paymentmodes USING (paymentId)
              JOIN machines USING (machineId)
              JOIN companies c USING (companyId)
              LEFT JOIN rfidorders USING (orderId)
              WHERE paymentModeTag!='CASH'
                AND transactionStatus IN ('complete','approved')
                AND ((transactionType IS NULL) OR (transactionType IN ('debit', 'debit-recharge','debit-both')))`;

    if (isMtd) {
      const { startMonthDate, dateToday } = await getLastMonthDate();

      queryCashlessLM += `
              AND (timestamp >= '${startMonthDate}01 00:00:00')
              AND (timestamp <= '${dateToday} 23:59:59')`;
    } else {
      const { dateToday } = await getLastMonthDate();

      queryCashlessLM += `
              AND (timestamp >= '${dateToday} 00:00:00')
              AND (timestamp <= '${dateToday} 23:59:59')`;
    }
    if (companyId != undefined) {
      queryCashlessLM += `
      AND c.companyId = ${companyId}`;
    }

    // console.log(queryCashlessLM);
    const resultCashlessLM = await dbQuery(queryCashlessLM);
    console.log(resultCashlessLM);

    const machines = await dbQuery(
      `SELECT COUNT(machineId) AS totalMachines FROM machines`
    );
    const users = await dbQuery(
      `SELECT COUNT(userId) AS totalUsers FROM users`
    );

    const totalMachines = machines[0].totalMachines;
    const totalUsers = users[0].totalUsers;

    const { sales, cashlessOrders, companySales, personalSales } = result[0];
    const { salesLM, cashlessOrdersLM, companySalesLM, personalSalesLM } =
      resultCashlessLM[0];

    const { cashSales, cashOrders } = resultCash[0];
    const { cashSalesLM, cashOrdersLM } = resultCashLM[0];

    let totalCompanySales = 0;
    let totalPersonalSales = 0;
    let totalCompanySalesLM = 0;
    let totalPersonalSalesLM = 0;

    if (companySales !== null) totalCompanySales = companySales;
    if (personalSales !== null) totalPersonalSales = personalSales;
    if (companySalesLM !== null) totalCompanySalesLM = companySalesLM;
    if (personalSalesLM !== null) totalPersonalSalesLM = personalSalesLM;

    const cashlessSales = sales - totalCompanySales;
    const cashlessSalesLM = salesLM - totalCompanySalesLM;

    const cashS = cashSales != null ? cashSales : 0;
    const cashO = cashOrders != null ? cashOrders : 0;
    const cashSLM = cashSalesLM != null ? cashSalesLM : 0;
    const cashOLM = cashOrdersLM != null ? cashOrdersLM : 0;

    const totalSales = cashS + cashlessSales;
    const totalSalesLM = cashSalesLM + cashlessSalesLM; //LM
    const totalOrders = cashO + cashlessOrders;
    const totalOrdersLM = cashOLM + cashlessOrdersLM; //LM

    const cashSalesComparision = await calculatePercentageChange(
      cashSLM,
      cashS
    );
    const cashlessSalesComparision = await calculatePercentageChange(
      cashlessSalesLM,
      cashlessSales
    );
    const totalSalesComparision = await calculatePercentageChange(
      totalSalesLM,
      totalSales
    );
    const totalOrdersComparision = await calculatePercentageChange(
      totalOrdersLM,
      totalOrders
    );
    console.log(cashSalesComparision);
    console.log(cashlessSalesComparision);
    console.log(totalSalesComparision);
    console.log(totalOrdersComparision);

    return {
      success: true,
      totalSales,
      totalOrders,
      cashlessSales,
      cashlessOrders,
      cashSales: cashS,
      cashOrders: cashO,
      totalUsers,
      totalMachines,
      cashSalesComparision,
      cashlessSalesComparision,
      totalSalesComparision,
      totalOrdersComparision,
    };
  },
  partnerWidgetList: async (req, res, companyId) => {
    let isMtd = req.body.isMtd; //true-monthlyData false-dailyData

    if (isMtd === undefined) isMtd = true;

    let queryCash = `SELECT 
                  SUM(price) AS cashSales,
                  COUNT(orderId) AS cashOrders
              FROM orders
              JOIN paymentmodes USING (paymentId)
              JOIN machines USING (machineId)
              JOIN companies c USING (companyId)
              LEFT JOIN rfidorders USING (orderId)
              WHERE paymentModeTag='CASH'
                AND transactionStatus IN ('complete','approved')
                AND transactionType IS NULL`;

    if (isMtd === false) {
      const dateToday = new Date(Date.now() + 18000000)
        .toISOString()
        .slice(0, 10)
        .replace("T", " ");

      queryCash += `
              AND (timestamp >= '${dateToday} 00:00:00')
              AND (timestamp <= '${dateToday} 23:59:59')`;
    } else {
      const startMonthDate = new Date(Date.now() + 18000000)
        .toISOString()
        .slice(0, 8)
        .replace("T", " ");

      const dateToday = new Date(Date.now() + 18000000)
        .toISOString()
        .slice(0, 10)
        .replace("T", " ");

      queryCash += `
              AND (timestamp >= '${startMonthDate}01 00:00:00')
              AND (timestamp <= '${dateToday} 23:59:59')`;
    }
    if (companyId != undefined) {
      queryCash += `
      AND c.companyId = ${companyId}`;
    }

    // console.log(queryCash);
    const resultCash = await dbQuery(queryCash);
    console.log(resultCash);

    let queryCashLM = `SELECT 
                        SUM(price) AS cashSalesLM,
                        COUNT(orderId) AS cashOrdersLM
                    FROM orders
                    JOIN paymentmodes USING (paymentId)
                    JOIN machines USING (machineId)
                    JOIN companies c USING (companyId)
                    LEFT JOIN rfidorders USING (orderId)
                    WHERE paymentModeTag='CASH'
                      AND transactionStatus IN ('complete','approved')
                      AND transactionType IS NULL`;

    if (isMtd) {
      const { startMonthDate, dateToday } = await getLastMonthDate();
      queryCashLM += `
        AND (timestamp >= '${startMonthDate}01 00:00:00')
        AND (timestamp <= '${dateToday} 23:59:59')`;
    } else {
      const { dateToday } = await getLastMonthDate();
      queryCashLM += `
        AND (timestamp >= '${dateToday} 00:00:00')
        AND (timestamp <= '${dateToday} 23:59:59')`;
    }

    if (companyId != undefined) {
      queryCashLM += `
        AND c.companyId = ${companyId}`;
    }

    // console.log(queryCashLM);
    const resultCashLM = await dbQuery(queryCashLM);
    console.log(resultCashLM);

    let query = `SELECT 
                  SUM(price) AS sales,
                  COUNT(orderId) AS cashlessOrders,
                  SUM(deductCompanyBalance) AS companySales,
                  SUM(deductRechargeBalance) AS personalSales 
              FROM orders
              JOIN paymentmodes USING (paymentId)
              JOIN machines USING (machineId)
              JOIN companies c USING (companyId)
              LEFT JOIN rfidorders USING (orderId)
              WHERE paymentModeTag!='CASH'
                AND transactionStatus IN ('complete','approved')
                AND ((transactionType IS NULL) OR (transactionType IN ('debit', 'debit-recharge','debit-both')))`;

    if (isMtd === false) {
      const dateToday = new Date(Date.now() + 18000000)
        .toISOString()
        .slice(0, 10)
        .replace("T", " ");

      query += `
              AND (timestamp >= '${dateToday} 00:00:00')
              AND (timestamp <= '${dateToday} 23:59:59')`;
    } else {
      const startMonthDate = new Date(Date.now() + 18000000)
        .toISOString()
        .slice(0, 8)
        .replace("T", " ");

      const dateToday = new Date(Date.now() + 18000000)
        .toISOString()
        .slice(0, 10)
        .replace("T", " ");

      query += `
              AND (timestamp >= '${startMonthDate}01 00:00:00')
              AND (timestamp <= '${dateToday} 23:59:59')`;
    }
    if (companyId != undefined) {
      query += `
      AND c.companyId = ${companyId}`;
    }

    // console.log(query);
    const result = await dbQuery(query);
    console.log(result);

    let queryCashlessLM = `SELECT 
                  SUM(price) AS salesLM,
                  COUNT(orderId) AS cashlessOrdersLM,
                  SUM(deductCompanyBalance) AS companySalesLM,
                  SUM(deductRechargeBalance) AS personalSalesLM
              FROM orders
              JOIN paymentmodes USING (paymentId)
              JOIN machines USING (machineId)
              JOIN companies c USING (companyId)
              LEFT JOIN rfidorders USING (orderId)
              WHERE paymentModeTag!='CASH'
                AND transactionStatus IN ('complete','approved')
                AND ((transactionType IS NULL) OR (transactionType IN ('debit', 'debit-recharge','debit-both')))`;

    if (isMtd) {
      const { startMonthDate, dateToday } = await getLastMonthDate();

      queryCashlessLM += `
              AND (timestamp >= '${startMonthDate}01 00:00:00')
              AND (timestamp <= '${dateToday} 23:59:59')`;
    } else {
      const { dateToday } = await getLastMonthDate();

      queryCashlessLM += `
              AND (timestamp >= '${dateToday} 00:00:00')
              AND (timestamp <= '${dateToday} 23:59:59')`;
    }
    if (companyId != undefined) {
      queryCashlessLM += `
      AND c.companyId = ${companyId}`;
    }

    // console.log(queryCashlessLM);
    const resultCashlessLM = await dbQuery(queryCashlessLM);
    console.log(resultCashlessLM);

    const machines = await dbQuery(
      `SELECT COUNT(machineId) AS totalMachines FROM machines`
    );
    const users = await dbQuery(
      `SELECT COUNT(userId) AS totalUsers FROM users`
    );

    const totalMachines = machines[0].totalMachines;
    const totalUsers = users[0].totalUsers;

    const { sales, cashlessOrders, companySales, personalSales } = result[0];
    const { salesLM, cashlessOrdersLM, companySalesLM, personalSalesLM } =
      resultCashlessLM[0];

    const { cashSales, cashOrders } = resultCash[0];
    const { cashSalesLM, cashOrdersLM } = resultCashLM[0];

    let totalCompanySales = 0;
    let totalPersonalSales = 0;
    let totalCompanySalesLM = 0;
    let totalPersonalSalesLM = 0;

    if (companySales !== null) totalCompanySales = companySales;
    if (personalSales !== null) totalPersonalSales = personalSales;
    if (companySalesLM !== null) totalCompanySalesLM = companySalesLM;
    if (personalSalesLM !== null) totalPersonalSalesLM = personalSalesLM;

    const cashlessSales = sales - totalCompanySales;
    const cashlessSalesLM = salesLM - totalCompanySalesLM;

    const cashS = cashSales != null ? cashSales : 0;
    const cashO = cashOrders != null ? cashOrders : 0;
    const cashSLM = cashSalesLM != null ? cashSalesLM : 0;
    const cashOLM = cashOrdersLM != null ? cashOrdersLM : 0;

    const totalSales = cashS + cashlessSales;
    const totalSalesLM = cashSalesLM + cashlessSalesLM; //LM
    const totalOrders = cashO + cashlessOrders;
    const totalOrdersLM = cashOLM + cashlessOrdersLM; //LM

    const cashSalesComparision = await calculatePercentageChange(
      cashSLM,
      cashS
    );
    const cashlessSalesComparision = await calculatePercentageChange(
      cashlessSalesLM,
      cashlessSales
    );
    const totalSalesComparision = await calculatePercentageChange(
      totalSalesLM,
      totalSales
    );
    const totalOrdersComparision = await calculatePercentageChange(
      totalOrdersLM,
      totalOrders
    );
    console.log(cashSalesComparision);
    console.log(cashlessSalesComparision);
    console.log(totalSalesComparision);
    console.log(totalOrdersComparision);

    return {
      success: true,
      totalSales,
      totalOrders,
      cashlessSales,
      cashlessOrders,
      cashSales: cashS,
      cashOrders: cashO,
      totalUsers,
      totalMachines,
      cashSalesComparision,
      cashlessSalesComparision,
      totalSalesComparision,
      totalOrdersComparision,
    };
  },
  companyWidgetList: async (req, res, companyId) => {
    let isMtd = req.body.isMtd; //true-monthlyData false-dailyData
    let isCompany = req.body.isCompany;

    if (isCompany === undefined) isCompany = false;

    if (companyId === undefined)
      return {
        success: false,
        message: "companyId not present in credentials",
      };

    if (isMtd === undefined) isMtd = true;

    let queryCash = `SELECT 
                  SUM(price) AS cashSales,
                  COUNT(orderId) AS cashOrders
              FROM orders
              JOIN paymentmodes USING (paymentId)
              JOIN machines USING (machineId)
              JOIN companies c USING (companyId)
              LEFT JOIN rfidorders USING (orderId)
              WHERE paymentModeTag='CASH'
                AND transactionStatus IN ('complete','approved')
                AND transactionType IS NULL`;

    if (isMtd === false) {
      const dateToday = new Date(Date.now() + 18000000)
        .toISOString()
        .slice(0, 10)
        .replace("T", " ");

      queryCash += `
              AND (timestamp >= '${dateToday} 00:00:00')
              AND (timestamp <= '${dateToday} 23:59:59')`;
    } else {
      const startMonthDate = new Date(Date.now() + 18000000)
        .toISOString()
        .slice(0, 8)
        .replace("T", " ");

      const dateToday = new Date(Date.now() + 18000000)
        .toISOString()
        .slice(0, 10)
        .replace("T", " ");

      queryCash += `
              AND (timestamp >= '${startMonthDate}01 00:00:00')
              AND (timestamp <= '${dateToday} 23:59:59')`;
    }
    queryCash += `
      AND c.companyId = ${companyId}`;

    // console.log(queryCash);
    const resultCash = await dbQuery(queryCash);
    console.log(resultCash);

    let queryCashLM = `SELECT 
                        SUM(price) AS cashSalesLM,
                        COUNT(orderId) AS cashOrdersLM
                    FROM orders
                    JOIN paymentmodes USING (paymentId)
                    JOIN machines USING (machineId)
                    JOIN companies c USING (companyId)
                    LEFT JOIN rfidorders USING (orderId)
                    WHERE paymentModeTag='CASH'
                      AND transactionStatus IN ('complete','approved')
                      AND transactionType IS NULL`;

    if (isMtd) {
      const { startMonthDate, dateToday } = await getLastMonthDate();
      queryCashLM += `
        AND (timestamp >= '${startMonthDate}01 00:00:00')
        AND (timestamp <= '${dateToday} 23:59:59')`;
    } else {
      const { dateToday } = await getLastMonthDate();
      queryCashLM += `
        AND (timestamp >= '${dateToday} 00:00:00')
        AND (timestamp <= '${dateToday} 23:59:59')`;
    }

    queryCashLM += `
        AND c.companyId = ${companyId}`;

    // console.log(queryCashLM);
    const resultCashLM = await dbQuery(queryCashLM);
    console.log(resultCashLM);

    let query = `SELECT 
                  SUM(price) AS sales,
                  COUNT(orderId) AS cashlessOrders,
                  SUM(deductCompanyBalance) AS companySales,
                  SUM(deductRechargeBalance) AS personalSales 
              FROM orders
              JOIN paymentmodes USING (paymentId)
              JOIN machines USING (machineId)
              JOIN companies c USING (companyId)
              LEFT JOIN rfidorders USING (orderId)
              WHERE paymentModeTag!='CASH'
                AND transactionStatus IN ('complete','approved')`;

    if (isCompany) {
      query += `
            AND transactionType IN ('debit-both', 'debit-company')`;
    } else {
      query += `
            AND ((transactionType IS NULL) OR (transactionType IN ('debit', 'debit-recharge','debit-both')))`;
    }

    if (isMtd === false) {
      const dateToday = new Date(Date.now() + 18000000)
        .toISOString()
        .slice(0, 10)
        .replace("T", " ");

      query += `
              AND (timestamp >= '${dateToday} 00:00:00')
              AND (timestamp <= '${dateToday} 23:59:59')`;
    } else {
      const startMonthDate = new Date(Date.now() + 18000000)
        .toISOString()
        .slice(0, 8)
        .replace("T", " ");

      const dateToday = new Date(Date.now() + 18000000)
        .toISOString()
        .slice(0, 10)
        .replace("T", " ");

      query += `
              AND (timestamp >= '${startMonthDate}01 00:00:00')
              AND (timestamp <= '${dateToday} 23:59:59')`;
    }
    query += `
      AND c.companyId = ${companyId}`;

    // console.log(query);
    const result = await dbQuery(query);
    console.log(result);

    let queryCashlessLM = `SELECT 
                  SUM(price) AS salesLM,
                  COUNT(orderId) AS cashlessOrdersLM,
                  SUM(deductCompanyBalance) AS companySalesLM,
                  SUM(deductRechargeBalance) AS personalSalesLM
              FROM orders
              JOIN paymentmodes USING (paymentId)
              JOIN machines USING (machineId)
              JOIN companies c USING (companyId)
              LEFT JOIN rfidorders USING (orderId)
              WHERE paymentModeTag!='CASH'
                AND transactionStatus IN ('complete','approved')`;

    if (isCompany) {
      queryCashlessLM += `
        AND transactionType IN ('debit-both', 'debit-company')`;
    } else {
      queryCashlessLM += `
        AND ((transactionType IS NULL) OR (transactionType IN ('debit', 'debit-recharge','debit-both')))`;
    }

    if (isMtd) {
      const { startMonthDate, dateToday } = await getLastMonthDate();

      queryCashlessLM += `
              AND (timestamp >= '${startMonthDate}01 00:00:00')
              AND (timestamp <= '${dateToday} 23:59:59')`;
    } else {
      const { dateToday } = await getLastMonthDate();

      queryCashlessLM += `
              AND (timestamp >= '${dateToday} 00:00:00')
              AND (timestamp <= '${dateToday} 23:59:59')`;
    }
    queryCashlessLM += `
      AND c.companyId = ${companyId}`;

    // console.log(queryCashlessLM);
    const resultCashlessLM = await dbQuery(queryCashlessLM);
    console.log(resultCashlessLM);

    const machines = await dbQuery(
      `SELECT COUNT(machineId) AS totalMachines FROM machines WHERE companyId =${companyId}`
    );
    const users = await dbQuery(
      `SELECT COUNT(companyUserId) AS totalEmployees FROM companyusers WHERE companyId =${companyId} && isDeleted=0`
    );

    const totalMachines = machines[0].totalMachines;
    const totalUsers = users[0].totalEmployees;

    const { sales, cashlessOrders, companySales, personalSales } = result[0];
    const { salesLM, cashlessOrdersLM, companySalesLM, personalSalesLM } =
      resultCashlessLM[0];

    const { cashSales, cashOrders } = resultCash[0];
    const { cashSalesLM, cashOrdersLM } = resultCashLM[0];

    let totalCompanySales = 0;
    let totalPersonalSales = 0;
    let totalCompanySalesLM = 0;
    let totalPersonalSalesLM = 0;

    if (companySales !== null) totalCompanySales = companySales;
    if (personalSales !== null) totalPersonalSales = personalSales;
    if (companySalesLM !== null) totalCompanySalesLM = companySalesLM;
    if (personalSalesLM !== null) totalPersonalSalesLM = personalSalesLM;

    const cashlessSales = sales - totalCompanySales;
    const cashlessSalesLM = salesLM - totalCompanySalesLM;

    const cashS = cashSales != null ? cashSales : 0;
    const cashO = cashOrders != null ? cashOrders : 0;
    const cashSLM = cashSalesLM != null ? cashSalesLM : 0;
    const cashOLM = cashOrdersLM != null ? cashOrdersLM : 0;

    let totalSales = 0;
    let totalSalesLM = 0; //LM
    let totalOrders = 0;
    let totalOrdersLM = 0; //LM

    if (isCompany) {
      totalSales = cashlessSales;
      totalSalesLM = cashlessSalesLM; //LM
      totalOrders = cashlessOrders;
      totalOrdersLM = cashlessOrdersLM; //LM
    } else {
      totalSales = cashS + cashlessSales;
      totalSalesLM = cashSalesLM + cashlessSalesLM; //LM
      totalOrders = cashO + cashlessOrders;
      totalOrdersLM = cashOLM + cashlessOrdersLM; //LM
    }

    const cashSalesComparision = await calculatePercentageChange(
      cashSLM,
      cashS
    );
    const cashlessSalesComparision = await calculatePercentageChange(
      cashlessSalesLM,
      cashlessSales
    );
    const totalSalesComparision = await calculatePercentageChange(
      totalSalesLM,
      totalSales
    );
    const totalOrdersComparision = await calculatePercentageChange(
      totalOrdersLM,
      totalOrders
    );
    console.log(cashSalesComparision);
    console.log(cashlessSalesComparision);
    console.log(totalSalesComparision);
    console.log(totalOrdersComparision);

    return {
      success: true,
      totalSales,
      totalOrders,
      cashlessSales,
      cashlessOrders,
      cashSales: cashS,
      cashOrders: cashO,
      totalUsers,
      totalMachines,
      cashSalesComparision,
      cashlessSalesComparision,
      totalSalesComparision,
      totalOrdersComparision,
    };
  },
};

module.exports = widgetService;
