const { dbQueryMonth, dbQuery } = require("../../../../utils/dbFunctions");
const {
  parseISO,
  addMonths,
  startOfMonth,
  endOfMonth,
  format,
} = require("date-fns");

const billingReportService = {
  billingRfidPartner: async (req, res) => {
    let inputYear = req.body.inputYear;
    let inputMonth = req.body.inputMonth;

    // Dynamically adjust the month for the timestamp conditions
    const startDate = new Date(`${inputYear}-${inputMonth}-01 00:00:00`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);

    let basicQuery = `
        SELECT 
            companyId,
            companyName,
            COUNT(DISTINCT machineId) AS totalMachines
        FROM companies
        JOIN machines USING (companyId)
        LEFT JOIN paymentmodes USING (machineId)
        GROUP BY companyId;`;

    const resultBasic = await dbQueryMonth(basicQuery);

    let query = `
    SELECT 
        c.companyId,
        COUNT(orderId) AS totalOrders,
        SUM(deductCompanyBalance) AS billingAmount
    FROM orders
        INNER JOIN paymentmodes USING (paymentId)
        INNER JOIN paymentmethods USING (paymentMethodId)
        INNER JOIN machines m USING (machineId)
        INNER JOIN companies c USING (companyId)
        LEFT JOIN rfidorders USING (orderId)
    WHERE 
        transactionStatus IN ('approved', 'complete')
        AND paymentName = 'rfid'
        AND transactionType IN ('debit-both', 'debit-company')
        AND timestamp >= ?
        AND timestamp <= ?
    GROUP BY companyId;`;

    const result = await dbQueryMonth(query, startDate, endDate);

    // Combine arrays based on companyId
    const combinedArray = resultBasic.map((item1) => {
      const matchingItem = result.find(
        (item2) => item1.companyId === item2.companyId
      );

      return {
        companyId: item1.companyId,
        companyName: item1.companyName,
        totalMachines: item1.totalMachines,
        totalOrders: matchingItem ? matchingItem.totalOrders : 0,
        billingAmount: matchingItem ? matchingItem.billingAmount : 0,
      };
    });

    return {
      success: true,
      result: combinedArray,
      message: "Company Reports",
    };
  },
  billingRfidCompany: async (req, res, companyId) => {
    let inputYear = req.body.inputYear;
    let inputMonth = req.body.inputMonth;

    // Dynamically adjust the month for the timestamp conditions
    const startDate = new Date(`${inputYear}-${inputMonth}-01 00:00:00`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);

    let basicQuery = `
        SELECT 
            companyId,
            companyName,
            COUNT(DISTINCT machineId) AS totalMachines
        FROM companies
        JOIN machines USING (companyId)
        LEFT JOIN paymentmodes USING (machineId)
        WHERE companyId= ${companyId}
        GROUP BY companyId;`;

    const resultBasic = await dbQueryMonth(basicQuery);

    let query = `
    SELECT 
        c.companyId,
        COUNT(orderId) AS totalOrders,
        SUM(deductCompanyBalance) AS billingAmount
    FROM orders
        INNER JOIN paymentmodes USING (paymentId)
        INNER JOIN paymentmethods USING (paymentMethodId)
        INNER JOIN machines m USING (machineId)
        INNER JOIN companies c USING (companyId)
        LEFT JOIN rfidorders USING (orderId)
    WHERE 
        c.companyId=${companyId}
        AND transactionStatus IN ('approved', 'complete')
        AND paymentName = 'rfid'
        AND transactionType IN ('debit-both', 'debit-company')
        AND timestamp >= ?
        AND timestamp <= ?
    GROUP BY companyId;`;

    const result = await dbQueryMonth(query, startDate, endDate);

    console.log(result);

    // Combine arrays based on companyId
    const combinedArray = resultBasic.map((item1) => {
      const matchingItem = result.find(
        (item2) => item1.companyId === item2.companyId
      );

      return {
        companyId: item1.companyId,
        companyName: item1.companyName,
        totalMachines: item1.totalMachines,
        totalOrders: matchingItem ? matchingItem.totalOrders : 0,
        billingAmount: matchingItem ? matchingItem.billingAmount : 0,
      };
    });

    return {
      success: true,
      result: combinedArray,
      message: "Company Reports",
    };
  },
  adminBillingInfo: async (req, res, companyId) => {
    let inputYear = req.body.inputYear;

    let currentDate = new Date(`${inputYear}-12-01 00:00:00`);
    let startDate = addMonths(currentDate, -11);

    const results = [];

    for (let i = 0; i < 12; i++) {
      const endDate = endOfMonth(startDate);

      const query = `
            SELECT 
                c.companyId,
                COUNT(orderId) AS totalOrders,
                SUM(deductCompanyBalance) AS billingAmount,
                '${format(startDate, "MMMM yyyy")}' AS month
            FROM orders
                INNER JOIN paymentmodes USING (paymentId)
                INNER JOIN paymentmethods USING (paymentMethodId)
                INNER JOIN machines m USING (machineId)
                INNER JOIN companies c USING (companyId)
                LEFT JOIN rfidorders USING (orderId)
            WHERE 
                c.companyId = ${companyId}
                AND transactionStatus IN ('approved', 'complete')
                AND paymentName = 'rfid'
                AND transactionType IN ('debit-both', 'debit-company')
                AND timestamp BETWEEN ? AND ?
            GROUP BY companyId;`;

      const result = await dbQueryMonth(query, startDate, endDate);

      if (result[0] !== undefined) results.push(result[0]);

      startDate = addMonths(startDate, 1);
    }

    let result = results.reverse();

    for (let i = 0; i < result.length; i++) {
      result[i].serialNumber = i + 1;
    }

    let basicQuery = `
        SELECT 
            companyId,
            companyName,
            COUNT(DISTINCT machineId) AS totalMachines
        FROM companies
        JOIN machines USING (companyId)
        LEFT JOIN paymentmodes USING (machineId)
        WHERE companyId= ${companyId}
        GROUP BY companyId;`;

    const resultBasic = await dbQueryMonth(basicQuery);

    const { companyName, totalMachines } = resultBasic[0];

    return {
      success: true,
      companyName,
      result,
      message: "Company Reports",
    };
  },
  partnerBillingInfo: async (req, res, companyId) => {
    let inputYear = req.body.inputYear;

    let currentDate = new Date(`${inputYear}-12-01 00:00:00`);
    let startDate = addMonths(currentDate, -11);

    const results = [];

    for (let i = 0; i < 12; i++) {
      const endDate = endOfMonth(startDate);

      const query = `
            SELECT 
                c.companyId,
                COUNT(orderId) AS totalOrders,
                SUM(deductCompanyBalance) AS billingAmount,
                '${format(startDate, "MMMM yyyy")}' AS month
            FROM orders
                INNER JOIN paymentmodes USING (paymentId)
                INNER JOIN paymentmethods USING (paymentMethodId)
                INNER JOIN machines m USING (machineId)
                INNER JOIN companies c USING (companyId)
                LEFT JOIN rfidorders USING (orderId)
            WHERE 
                c.companyId = ${companyId}
                AND transactionStatus IN ('approved', 'complete')
                AND paymentName = 'rfid'
                AND transactionType IN ('debit-both', 'debit-company')
                AND timestamp BETWEEN ? AND ?
            GROUP BY companyId;`;

      const result = await dbQueryMonth(query, startDate, endDate);

      if (result[0] !== undefined) results.push(result[0]);

      startDate = addMonths(startDate, 1);
    }

    let result = results.reverse();

    for (let i = 0; i < result.length; i++) {
      result[i].serialNumber = i + 1;
    }

    let basicQuery = `
        SELECT 
            companyId,
            companyName,
            COUNT(DISTINCT machineId) AS totalMachines
        FROM companies
        JOIN machines USING (companyId)
        LEFT JOIN paymentmodes USING (machineId)
        WHERE companyId= ${companyId}
        GROUP BY companyId;`;

    const resultBasic = await dbQueryMonth(basicQuery);

    const { companyName, totalMachines } = resultBasic[0];

    return {
      success: true,
      companyName,
      result,
      message: "Company Reports",
    };
  },
  billingInfo: async (req, res, companyId) => {
    let inputYear = req.body.inputYear;

    let currentDate = new Date(`${inputYear}-12-01 00:00:00`);
    let startDate = addMonths(currentDate, -11);

    const results = [];

    for (let i = 0; i < 12; i++) {
      const endDate = endOfMonth(startDate);

      const query = `
            SELECT 
                c.companyId,
                COUNT(orderId) AS totalOrders,
                SUM(deductCompanyBalance) AS billingAmount,
                '${format(startDate, "MMMM yyyy")}' AS month
            FROM orders
                INNER JOIN paymentmodes USING (paymentId)
                INNER JOIN paymentmethods USING (paymentMethodId)
                INNER JOIN machines m USING (machineId)
                INNER JOIN companies c USING (companyId)
                LEFT JOIN rfidorders USING (orderId)
            WHERE 
                c.companyId = ${companyId}
                AND transactionStatus IN ('approved', 'complete')
                AND paymentName = 'rfid'
                AND transactionType IN ('debit-both', 'debit-company')
                AND timestamp BETWEEN ? AND ?
            GROUP BY companyId;`;

      const result = await dbQueryMonth(query, startDate, endDate);

      if (result[0] !== undefined) results.push(result[0]);

      startDate = addMonths(startDate, 1);
    }

    let result = results.reverse();

    //call database billingDate table with where year='inputYear'
    let dateQuery = `SELECT *
            FROM billingdates
            WHERE year= '${inputYear}';`;

    const resultDate = await dbQueryMonth(dateQuery);

    // Iterate over array2
    for (let i = 0; i < result.length; i++) {
      // Get the month from result
      let monthFromArray2 = result[i].month;

      // Find the corresponding object in array1
      let correspondingObject = resultDate.find(
        (obj) => obj.date === monthFromArray2
      );

      // If a corresponding object is found, add billingDateId to result
      if (correspondingObject) {
        result[i].billingDateId = correspondingObject.billingDateId;
      }
    }

    // for (let i = 0; i < result.length; i++) {
    //   result[i].serialNumber = i + 1;
    // }

    let basicQuery = `
        SELECT 
            companyId,
            companyName,
            COUNT(DISTINCT machineId) AS totalMachines
        FROM companies
        JOIN machines USING (companyId)
        LEFT JOIN paymentmodes USING (machineId)
        WHERE companyId= ${companyId}
        GROUP BY companyId;`;

    const resultBasic = await dbQueryMonth(basicQuery);

    const { companyName, totalMachines } = resultBasic[0];

    return {
      success: true,
      companyName,
      result,
      message: "Company Reports",
    };
  },
};

module.exports = billingReportService;
