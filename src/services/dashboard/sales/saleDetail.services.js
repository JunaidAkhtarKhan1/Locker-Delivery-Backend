const { dbQuery } = require("../../../utils/dbFunctions");

const saleDetailService = {
  saleDetail: async (req, res, companyId) => {
    // console.log(req.body);

    let startDate = req.body.startDate;
    let endDate = req.body.endDate;
    let machineId = req.body.machineId;

    if (machineId === undefined)
      return {
        success: false,
        message: "machineId is not defined",
      };

    //First take out the list of machines with companies and status
    let queryPaymentModes = `SELECT paymentId, machineId, companyId, bankName, paymentName, machineName, companyName, isActive
                                FROM paymentmodes
                              JOIN banks USING (bankId)
                              JOIN paymentmethods USING (paymentMethodId)
                              JOIN machines USING (machineId)
                              JOIN companies USING (companyId)
                              WHERE machineId=${machineId};`;

    const resultMachine = await dbQuery(queryPaymentModes);

    let query = `SELECT companyId, machineId,paymentId,companyName,machineName,bankName,paymentName, SUM(price) AS totalPrice
                  FROM orders
                JOIN paymentmodes USING (paymentId)
                JOIN banks USING (bankId)
                JOIN paymentmethods USING (paymentMethodId)
                JOIN machines USING (machineId)
                JOIN companies USING (companyId)
                  WHERE transactionStatus IN ('complete','approved') 
                AND ((transactionType IS NULL) OR (transactionType != 'credit'))`;

    if (startDate !== undefined && startDate !== "") {
      query = query.concat(`
                AND (timestamp >= '${startDate} 00:00:00')`);
      if (endDate != undefined) {
        query = query.concat(`
                AND(timestamp <= '${endDate} 23:59:59')`);
      }
    }

    query = query.concat(`
        AND machineId=${machineId}
        GROUP BY paymentId;`);

    const result = await dbQuery(query);

    console.log("result");
    console.log(result);

    //Use resultMachine and add totalPrice in it using array below
    for (const element of resultMachine) {
      console.log(element);
      const found = result.some((item) => item.paymentId === element.paymentId);
      console.log(found);
      if (!found) {
        // If not found, add a new item
        result.push({
          companyId: element.companyId,
          machineId: element.machineId,
          paymentId: element.paymentId,
          companyName: element.companyName,
          machineName: element.machineName,
          bankName: element.bankName,
          paymentName: element.paymentName,
          totalPrice: 0,
        });
      }

      console.log("resultMachine");
      console.log(result);
    }

    return {
      success: true,
      companyName: result[0].companyName,
      machineName: result[0].machineName,
      result,
    };
  },
  adminSaleDetail: async (req, res, companyId) => {
    // console.log(req.body);

    let startDate = req.body.startDate;
    let endDate = req.body.endDate;
    let machineId = req.body.machineId;

    if (machineId === undefined)
      return {
        success: false,
        message: "machineId is not defined",
      };

    //First take out the list of machines with companies and status
    let queryPaymentModes = `SELECT paymentId, machineId, companyId, bankName, paymentName, machineName, companyName, isActive
                                FROM paymentmodes
                              JOIN banks USING (bankId)
                              JOIN paymentmethods USING (paymentMethodId)
                              JOIN machines USING (machineId)
                              JOIN companies USING (companyId)
                              WHERE machineId=${machineId};`;

    const resultMachine = await dbQuery(queryPaymentModes);
    if (resultMachine.length === 0)
      return {
        success: false,
        message: "Machine does not have a payment method",
      };

    console.log(109, resultMachine);

    let query = `SELECT companyId, machineId,paymentId,companyName,machineName,bankName,paymentName, SUM(price) AS totalPrice
                    FROM orders
                  JOIN paymentmodes USING (paymentId)
                  JOIN banks USING (bankId)
                  JOIN paymentmethods USING (paymentMethodId)
                  JOIN machines USING (machineId)
                  JOIN companies USING (companyId)
                  WHERE transactionStatus IN ('complete','approved')
                  AND ((transactionType IS NULL) OR (transactionType != 'credit'))`;

    if (startDate !== undefined && startDate !== "") {
      query = query.concat(`
                AND (timestamp >= '${startDate} 00:00:00')`);
      if (endDate != undefined) {
        query = query.concat(`
                AND(timestamp <= '${endDate} 23:59:59')`);
      }
    }

    query = query.concat(`
        AND machineId=${machineId}
        GROUP BY paymentId;`);

    const result = await dbQuery(query);

    console.log("result");
    // console.log(result);

    for (const element of resultMachine) {
      console.log(element);
      const found = result.some((item) => item.paymentId === element.paymentId);
      console.log(found);
      if (!found) {
        // If not found, add a new item
        result.push({
          companyId: element.companyId,
          machineId: element.machineId,
          paymentId: element.paymentId,
          companyName: element.companyName,
          machineName: element.machineName,
          bankName: element.bankName,
          paymentName: element.paymentName,
          totalPrice: 0,
        });
      }

      console.log("resultMachine");
      console.log(result);
    }

    return {
      success: true,
      companyName: result[0].companyName,
      machineName: result[0].machineName,
      result,
    };
  },
  partnerSaleDetail: async (req, res, companyId) => {
    // console.log(req.body);

    let startDate = req.body.startDate;
    let endDate = req.body.endDate;
    let machineId = req.body.machineId;

    if (machineId === undefined)
      return {
        success: false,
        message: "machineId is not defined",
      };

    //First take out the list of machines with companies and status
    let queryPaymentModes = `SELECT paymentId, machineId, companyId, bankName, paymentName, machineName, companyName, isActive
                                FROM paymentmodes
                              JOIN banks USING (bankId)
                              JOIN paymentmethods USING (paymentMethodId)
                              JOIN machines USING (machineId)
                              JOIN companies USING (companyId)
                              WHERE machineId=${machineId};`;

    const resultMachine = await dbQuery(queryPaymentModes);
    if (resultMachine.length === 0)
      return {
        success: false,
        message: "Machine does not have a payment method",
      };

    let query = `SELECT companyId, machineId,paymentId,companyName,machineName,bankName,paymentName, SUM(price) AS totalPrice
                    FROM orders
                  JOIN paymentmodes USING (paymentId)
                  JOIN banks USING (bankId)
                  JOIN paymentmethods USING (paymentMethodId)
                  JOIN machines USING (machineId)
                  JOIN companies USING (companyId)
                  WHERE transactionStatus IN ('complete','approved')
                  AND ((transactionType IS NULL) OR (transactionType != 'credit'))`;

    if (startDate !== undefined && startDate !== "") {
      query = query.concat(`
                AND (timestamp >= '${startDate} 00:00:00')`);
      if (endDate != undefined) {
        query = query.concat(`
                AND(timestamp <= '${endDate} 23:59:59')`);
      }
    }

    query = query.concat(`
        AND machineId=${machineId}
        GROUP BY paymentId;`);

    const result = await dbQuery(query);

    console.log("result");
    // console.log(result);

    for (const element of resultMachine) {
      console.log(element);
      const found = result.some((item) => item.paymentId === element.paymentId);
      console.log(found);
      if (!found) {
        // If not found, add a new item
        result.push({
          companyId: element.companyId,
          machineId: element.machineId,
          paymentId: element.paymentId,
          companyName: element.companyName,
          machineName: element.machineName,
          bankName: element.bankName,
          paymentName: element.paymentName,
          totalPrice: 0,
        });
      }

      console.log("resultMachine");
      console.log(result);
    }

    return {
      success: true,
      companyName: result[0].companyName,
      machineName: result[0].machineName,
      result,
    };
  },
  companySaleDetail: async (req, res, companyId) => {
    let startDate = req.body.startDate;
    let endDate = req.body.endDate;
    let machineId = req.body.machineId;

    if (machineId === undefined)
      return {
        success: false,
        message: "machineId is not defined",
      };

    if (companyId === undefined)
      return {
        success: false,
        message: "companyId is not defined",
      };

    //First take out the list of machines with companies and status
    let queryPaymentModes = `SELECT paymentId, machineId, companyId, bankName, paymentName, machineName, companyName, isActive
                                FROM paymentmodes
                              JOIN banks USING (bankId)
                              JOIN paymentmethods USING (paymentMethodId)
                              JOIN machines USING (machineId)
                              JOIN companies USING (companyId)
                              WHERE machineId=${machineId} 
                              AND companyId=${companyId};`;

    const resultMachine = await dbQuery(queryPaymentModes);
    if (resultMachine.length === 0)
      return {
        success: false,
        message: "Machine does not have a payment method",
      };

    let query = `SELECT companyId, machineId,paymentId,companyName,machineName,bankName,paymentName, SUM(price) AS totalPrice
                    FROM orders
                  JOIN paymentmodes USING (paymentId)
                  JOIN banks USING (bankId)
                  JOIN paymentmethods USING (paymentMethodId)
                  JOIN machines USING (machineId)
                  JOIN companies USING (companyId)
                  WHERE transactionStatus IN ('complete','approved') 
                  AND ((transactionType IS NULL) OR (transactionType != 'credit'))`;

    if (startDate !== undefined && startDate !== "") {
      query = query.concat(`
                AND (timestamp >= '${startDate} 00:00:00')`);
      if (endDate != undefined) {
        query = query.concat(`
                AND(timestamp <= '${endDate} 23:59:59')`);
      }
    }

    query = query.concat(`
      AND machineId=${machineId}
      AND companyId=${companyId}
      GROUP BY paymentId;`);

    const result = await dbQuery(query);

    console.log("result");
    // console.log(result);

    //Use resultMachine and add totalPrice in it using array below

    for (const element of resultMachine) {
      console.log(element);
      const found = result.some((item) => item.paymentId === element.paymentId);
      console.log(found);
      if (!found) {
        // If not found, add a new item
        result.push({
          companyId: element.companyId,
          machineId: element.machineId,
          paymentId: element.paymentId,
          companyName: element.companyName,
          machineName: element.machineName,
          bankName: element.bankName,
          paymentName: element.paymentName,
          totalPrice: 0,
        });
      }

      console.log("resultMachine");
      console.log(result);
    }

    return {
      success: true,
      companyName: result[0].companyName,
      machineName: result[0].machineName,
      result,
    };
  },
};

module.exports = saleDetailService;
