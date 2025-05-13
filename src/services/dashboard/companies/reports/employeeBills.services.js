const { dbQueryMonth, dbQuery } = require("../../../../utils/dbFunctions");
const { calculatePercentageChange } = require("../../../../utils/functions");

const {
  parseISO,
  addMonths,
  startOfMonth,
  endOfMonth,
  format,
} = require("date-fns");

const employeeBillsService = {
  employeeBillsInfo: async (req, res, companyId) => {
    let inputYear = req.body.inputYear;
    let inputMonth = req.body.inputMonth;

    let currentDate = new Date(`${inputYear}-${inputMonth}-01 00:00:00`);
    let startDate = addMonths(currentDate, -5);

    const formattedDate = format(startDate, "MMM yyyy"); // 'Jun 2023'
    console.log(formattedDate);

    const results = [];

    for (let i = 0; i < 6; i++) {
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
      if (result[0] === undefined) {
        results.push({
          companyId,
          totalOrders: 0,
          billingAmount: 0,
          month: format(startDate, "MMMM yyyy"),
        });
      } else results.push(result[0]);

      startDate = addMonths(startDate, 1);
    }

    const totalOrders = results[5].totalOrders;
    const billingAmount = results[5].billingAmount;
    const billingMonth = results[5].month;

    const previousMonthBill = results[4].billingAmount;

    const { monthlyPercentage, color } = await calculatePercentageChange(
      previousMonthBill,
      billingAmount
    );

    console.log(200, monthlyPercentage);
    console.log(201, color);

    // Now results array contains data for the last six months month-wise

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
    console.log(resultBasic);

    const { companyName, totalMachines } = resultBasic[0];

    let labels = [];
    let data = [];

    for (const element of results) {
      const parts = element.month.split(" ");
      const abbreviatedMonth = parts[0].substring(0, 3);
      const lastTwoDigitsOfYear = parts[1].substring(2, 4);
      const formattedDate = `${abbreviatedMonth} ${lastTwoDigitsOfYear}`;

      labels.push(formattedDate);
      data.push(element.billingAmount);
    }

    const billingHistory = {
      labels,
      datasets: {
        label: "Bill Amount",
        data,
      },
    };

    return {
      success: true,
      companyName,
      billingMonth,
      totalMachines,
      totalOrders,
      billingAmount,
      monthlyPercentage,
      color,
      previousMonth: previousMonthBill,
      results,
      billingGraph: billingHistory,
      message: "Company Reports",
    };
  },

  employeeBillsCompany: async (req, res, companyId) => {
    let billingDate = req.body.billingDate;

    const parsedDate = new Date(billingDate + "-01"); // Adding "-01" to represent the first day of the month

    // Extract the month and year components
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
    const year = parsedDate.getFullYear().toString();

    let startDate = new Date(`${year}-${month}-01 00:00:00`);

    const formattedDate = format(startDate, "MMMM yyyy");

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
    const results = await dbQueryMonth(query, startDate, endDate);

    let queryEmployee = `SELECT 
              companyusers.companyUserId AS companyUserId,
              companyusers.employeeId AS employeeId,
              companyusers.name AS employeeName,
              COUNT(orders.orderId) AS totalOrders,
              SUM(rfidorders.deductCompanyBalance) AS billAmount
            FROM orders
              INNER JOIN paymentmodes USING (paymentId)
              INNER JOIN paymentmethods USING (paymentMethodId)
              INNER JOIN machines USING (machineId)
              INNER JOIN companies c USING (companyId)
              INNER JOIN companyusers USING (companyUserId)
              LEFT JOIN rfidorders USING (orderId)
        WHERE 
            c.companyId = ${companyId}
            AND transactionStatus IN ('approved', 'complete')
            AND paymentName = 'rfid'
            AND transactionType IN ('debit-both', 'debit-company')
            AND timestamp BETWEEN ? AND ?
            GROUP BY companyusers.companyUserId`;

    const resultDate = await dbQueryMonth(queryEmployee, startDate, endDate);

    let totalOrders = 0;
    let billingAmount = 0;

    if (results.length > 0) {
      totalOrders = results[0]?.totalOrders;
      billingAmount = results[0]?.billingAmount;
    }

    let basicQuery = `
        SELECT 
            companyId,
            companyName,
            address,
            COUNT(DISTINCT machineId) AS totalMachines
        FROM companies
        JOIN machines USING (companyId)
        LEFT JOIN paymentmodes USING (machineId)
        WHERE companyId= ${companyId}
        GROUP BY companyId;`;

    const resultBasic = await dbQueryMonth(basicQuery);

    const { companyName, totalMachines, address } = resultBasic[0];
    const splitAddress = address.split(",").map((str) => str.trim());

    // Combining the first two parts and the rest
    const address1 = splitAddress.slice(0, 2).join(", ");
    const address2 = splitAddress.slice(2).join(", ");

    return {
      success: true,
      companyName,
      address,
      address1,
      address2,
      totalMachines,
      totalOrders,
      billingAmount,
      billingMonth: formattedDate,
      results: resultDate,
      // results,
      message: "Billing Reports",
    };
  },
};

module.exports = employeeBillsService;
