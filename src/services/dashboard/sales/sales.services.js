const { dbQuery } = require("../../../utils/dbFunctions");

const saleService = {
  saleList: async (req, res, companyId) => {
    // console.log(req.body);

    let startDate = req.body.startDate;
    let endDate = req.body.endDate;
    let machineId = req.body.machineId;

    //First take out the list of machines with companies and status
    let queryMachine = `SELECT * 
                FROM machines
                JOIN companies USING (companyId)`;

    const resultMachine = await dbQuery(queryMachine);
    // console.log(resultMachine);
    let querySales = `SELECT companyId, machineId,companyName,machineName, SUM(price) AS totalPrice
                        FROM orders
                    JOIN paymentmodes USING (paymentId)
                    JOIN banks USING (bankId)
                    JOIN paymentmethods USING (paymentMethodId)
                    JOIN machines USING (machineId)
                    JOIN companies USING (companyId)
                    WHERE transactionStatus IN ('complete','approved') 
                    AND ((transactionType IS NULL) OR (transactionType != 'credit'))`;

    if (startDate !== undefined && startDate !== "") {
      querySales = querySales.concat(`
                AND (timestamp >= '${startDate} 00:00:00')`);
      if (endDate != undefined) {
        querySales = querySales.concat(`
                AND(timestamp <= '${endDate} 23:59:59')`);
      }
    }
    querySales = querySales.concat(`
            GROUP BY machineId;`);

    const resultSales = await dbQuery(querySales);
    // console.log(resultSales);

    //Use resultMachine and add totalPrice in it using array below

    for (const element of resultMachine) {
      if (element.isActive === 1) element.status = "ONLINE";
      else element.status = "OFFLINE";

      const foundIndex = resultSales.findIndex(
        (item) => item.machineId === element.machineId
      );
      if (foundIndex === -1) {
        // If not found, add a new item
        resultSales.push({
          companyId: element.companyId,
          machineId: element.machineId,
          companyName: element.companyName,
          machineName: element.machineName,
          isActive: element.isActive,
          status: element.status,
          totalPrice: 0,
        });
      } else {
        // If found, update the existing item
        resultSales[foundIndex].isActive = element.isActive;
        resultSales[foundIndex].status = element.status;
      }
    }

    console.log(resultSales);

    return {
      success: true,
      result: resultSales,
    };
  },

  adminSaleList: async (req, res, companyId) => {
    let startDate = req.body.startDate;
    let endDate = req.body.endDate;
    let machineId = req.body.machineId;
    let isCompany = req.body.isCompany;
    if (isCompany === undefined) isCompany = false;

    //First take out the list of machines with companies and status
    let queryMachine = `SELECT * 
              FROM machines
              JOIN companies USING (companyId)`;

    const resultMachine = await dbQuery(queryMachine);
    // console.log(resultMachine);
    let querySales = `SELECT 
                      c.companyId, 
                      machineId,
                      companyName,
                      machineName, 
                      SUM(price) AS totalPrice,
                      SUM(deductCompanyBalance) AS totalCompanySales,
                      SUM(deductRechargeBalance) AS totalPersonalSales 
                  FROM orders
                  JOIN paymentmodes USING (paymentId)
                  JOIN banks USING (bankId)
                  JOIN paymentmethods USING (paymentMethodId)
                  JOIN machines USING (machineId)
                  JOIN companies c USING (companyId)
                  LEFT JOIN rfidorders USING (orderId)
                  WHERE transactionStatus IN ('complete','approved')`;

    if (isCompany)
      querySales += `AND transactionType IN ('debit-both', 'debit-company')`;
    else
      querySales += `AND ((transactionType IS NULL) OR (transactionType IN ('debit', 'debit-recharge','debit-both')))`;

    if (startDate !== undefined && startDate !== "") {
      querySales = querySales.concat(`
              AND (timestamp >= '${startDate} 00:00:00')`);
      if (endDate != undefined) {
        querySales = querySales.concat(`
              AND(timestamp <= '${endDate} 23:59:59')`);
      }
    }

    querySales = querySales.concat(`
      GROUP BY machineId;`);

    const resultSales = await dbQuery(querySales);

    //Use resultMachine and add totalPrice in it using array below

    for (const element of resultMachine) {
      if (element.isActive === 1) element.status = "ONLINE";
      else element.status = "OFFLINE";

      const foundIndex = resultSales.findIndex(
        (item) => item.machineId === element.machineId
      );
      if (foundIndex === -1) {
        // If not found, add a new item
        resultSales.push({
          companyId: element.companyId,
          machineId: element.machineId,
          companyName: element.companyName,
          machineName: element.machineName,
          isActive: element.isActive,
          status: element.status,
          totalPrice: 0,
        });
      } else {
        // If found, update the existing item
        resultSales[foundIndex].isActive = element.isActive;
        resultSales[foundIndex].status = element.status;
      }
    }

    if (isCompany)
      for (const element of resultSales) {
        if (element.totalCompanySales != null)
          element.finalPrice = element.totalCompanySales;
        else element.finalPrice = 0;
      }
    else
      for (const element of resultSales) {
        if (element.totalCompanySales != null)
          element.finalPrice = element.totalPrice - element.totalCompanySales;
        else element.finalPrice = element.totalPrice - 0;
      }

    // console.log(resultSales);

    // Extract last three characters, convert to number and sort
    resultSales.sort((a, b) => {
      const lastThreeA = parseInt(a.machineName.slice(-3));
      const lastThreeB = parseInt(b.machineName.slice(-3));
      return lastThreeA - lastThreeB;
    });

    return {
      success: true,
      result: resultSales,
    };
  },
  partnerSaleList: async (req, res, companyId) => {
    let startDate = req.body.startDate;
    let endDate = req.body.endDate;
    let machineId = req.body.machineId;
    let isCompany = req.body.isCompany;
    if (isCompany === undefined) isCompany = false;

    //First take out the list of machines with companies and status
    let queryMachine = `SELECT * 
              FROM machines
              JOIN companies USING (companyId)`;

    const resultMachine = await dbQuery(queryMachine);
    // console.log(resultMachine);
    let querySales = `SELECT 
                      c.companyId, 
                      machineId,
                      companyName,
                      machineName, 
                      SUM(price) AS totalPrice,
                      SUM(deductCompanyBalance) AS totalCompanySales,
                      SUM(deductRechargeBalance) AS totalPersonalSales 
                  FROM orders
                  JOIN paymentmodes USING (paymentId)
                  JOIN banks USING (bankId)
                  JOIN paymentmethods USING (paymentMethodId)
                  JOIN machines USING (machineId)
                  JOIN companies c USING (companyId)
                  LEFT JOIN rfidorders USING (orderId)
                  WHERE transactionStatus IN ('complete','approved')`;

    if (isCompany)
      querySales += `AND transactionType IN ('debit-both', 'debit-company')`;
    else
      querySales += `AND ((transactionType IS NULL) OR (transactionType IN ('debit', 'debit-recharge','debit-both')))`;

    if (startDate !== undefined && startDate !== "") {
      querySales = querySales.concat(`
              AND (timestamp >= '${startDate} 00:00:00')`);
      if (endDate != undefined) {
        querySales = querySales.concat(`
              AND(timestamp <= '${endDate} 23:59:59')`);
      }
    }

    querySales = querySales.concat(`
      GROUP BY machineId;`);

    console.log(querySales);
    const resultSales = await dbQuery(querySales);

    //Use resultMachine and add totalPrice in it using array below

    for (const element of resultMachine) {
      if (element.isActive === 1) element.status = "ONLINE";
      else element.status = "OFFLINE";

      const foundIndex = resultSales.findIndex(
        (item) => item.machineId === element.machineId
      );
      if (foundIndex === -1) {
        // If not found, add a new item
        resultSales.push({
          companyId: element.companyId,
          machineId: element.machineId,
          companyName: element.companyName,
          machineName: element.machineName,
          isActive: element.isActive,
          status: element.status,
          totalPrice: 0,
        });
      } else {
        // If found, update the existing item
        resultSales[foundIndex].isActive = element.isActive;
        resultSales[foundIndex].status = element.status;
      }
    }

    if (isCompany)
      for (const element of resultSales) {
        if (element.totalCompanySales != null)
          element.finalPrice = element.totalCompanySales;
        else element.finalPrice = 0;
      }
    else
      for (const element of resultSales) {
        if (element.totalCompanySales != null)
          element.finalPrice = element.totalPrice - element.totalCompanySales;
        else element.finalPrice = element.totalPrice - 0;
      }

    // console.log(resultSales);

    // Extract last three characters, convert to number and sort
    resultSales.sort((a, b) => {
      const lastThreeA = parseInt(a.machineName.slice(-3));
      const lastThreeB = parseInt(b.machineName.slice(-3));
      return lastThreeA - lastThreeB;
    });

    return {
      success: true,
      result: resultSales,
    };
  },
  companySaleList: async (req, res, companyId) => {
    console.log(req.body);

    let startDate = req.body.startDate;
    let endDate = req.body.endDate;
    let machineId = req.body.machineId;
    let isCompany = req.body.isCompany;
    if (isCompany === undefined) isCompany = false;

    //First take out the list of machines with companies and status
    let queryMachine = `SELECT * 
                FROM machines
                JOIN companies USING (companyId)
                WHERE companyId=${companyId}`;

    const resultMachine = await dbQuery(queryMachine);
    // console.log(resultMachine);
    let querySales = `SELECT 
                        c.companyId, 
                        machineId,
                        companyName,
                        machineName, 
                        SUM(price) AS totalPrice,
                        SUM(deductCompanyBalance) AS totalCompanySales,
                        SUM(deductRechargeBalance) AS totalPersonalSales 
                    FROM orders
                    JOIN paymentmodes USING (paymentId)
                    JOIN banks USING (bankId)
                    JOIN paymentmethods USING (paymentMethodId)
                    JOIN machines USING (machineId)
                    JOIN companies c USING (companyId)
                    LEFT JOIN rfidorders USING (orderId)
                    WHERE transactionStatus IN ('complete','approved')`;

    if (isCompany)
      querySales += `AND transactionType IN ('debit-both', 'debit-company')`;
    else
      querySales += `AND ((transactionType IS NULL) OR (transactionType IN ('debit', 'debit-recharge','debit-both')))`;

    if (startDate !== undefined && startDate !== "") {
      querySales = querySales.concat(`
                AND (timestamp >= '${startDate} 00:00:00')`);
      if (endDate != undefined) {
        querySales = querySales.concat(`
                AND(timestamp <= '${endDate} 23:59:59')`);
      }
    }

    querySales = querySales.concat(`
        AND c.companyId = ${companyId}
        GROUP BY machineId;`);

    console.log(querySales);
    const resultSales = await dbQuery(querySales);

    //Use resultMachine and add totalPrice in it using array below

    for (const element of resultMachine) {
      if (element.isActive === 1) element.status = "ONLINE";
      else element.status = "OFFLINE";

      const foundIndex = resultSales.findIndex(
        (item) => item.machineId === element.machineId
      );
      if (foundIndex === -1) {
        // If not found, add a new item
        resultSales.push({
          companyId: element.companyId,
          machineId: element.machineId,
          companyName: element.companyName,
          machineName: element.machineName,
          isActive: element.isActive,
          status: element.status,
          totalPrice: 0,
        });
      } else {
        // If found, update the existing item
        resultSales[foundIndex].isActive = element.isActive;
        resultSales[foundIndex].status = element.status;
      }
    }

    if (isCompany)
      for (const element of resultSales) {
        if (element.totalCompanySales != null)
          element.finalPrice = element.totalCompanySales;
        else element.finalPrice = 0;
      }
    else
      for (const element of resultSales) {
        if (element.totalCompanySales != null)
          element.finalPrice = element.totalPrice - element.totalCompanySales;
        else element.finalPrice = element.totalPrice - 0;
      }

    // console.log(resultSales);
    // Extract last three characters, convert to number and sort
    resultSales.sort((a, b) => {
      const lastThreeA = parseInt(a.machineName.slice(-3));
      const lastThreeB = parseInt(b.machineName.slice(-3));
      return lastThreeA - lastThreeB;
    });

    return {
      success: true,
      result: resultSales,
    };
  },
};

module.exports = saleService;
