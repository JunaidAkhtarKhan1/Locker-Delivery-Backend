const {
  dbQuery,
  paginateOneJoin,
  paginate,
  paginatefiveJoin,
} = require("../../../utils/dbFunctions");

const orderService = {
  orderList: async (req, res, companyId) => {
    console.log(req.body);

    let startDate = req.body.startDate;
    let endDate = req.body.endDate;
    let sort = req.body.sort;
    let limit = req.body.limit;
    let machineId = req.body.machineId;
    let paymentMethodId = req.body.paymentMethodId;
    let bankId = req.body.bankId;
    let transactionType = req.body.transactionType;
    let transactionStatus = req.body.transactionStatus;
    let startPrice = req.body.startPrice;
    let endPrice = req.body.endPrice;

    let query = `SELECT orderId,
            companyName,
            machineName,
            paymentName,
            price,
            transactionStatus,
            companyUserId,
            userMobileNumber,
            transactionType,
            timestamp
        FROM orders
        INNER JOIN paymentmodes USING (paymentId)
        INNER JOIN paymentmethods USING (paymentMethodId)
        INNER JOIN machines USING (machineId)
        INNER JOIN companies USING (companyId)
        LEFT JOIN users USING (userId)`;

    //Where clause
    if (
      (startDate !== undefined && startDate !== "") ||
      (companyId !== undefined && companyId !== 0) ||
      (machineId !== undefined && machineId !== 0) ||
      (paymentMethodId !== undefined && paymentMethodId !== 0) ||
      (bankId !== undefined && bankId !== 0)
    ) {
      let lastFilter = false;
      query = query.concat(`
            WHERE `);

      if (startDate !== undefined && startDate !== "") {
        lastFilter = true;
        query = query.concat(`(timestamp >= '${startDate} 00:00:00')`);
        if (endDate != undefined) {
          query = query.concat(`
                AND(timestamp <= '${endDate} 23:59:59')`);
        }
      }
      if (companyId !== undefined && companyId !== 0) {
        if (lastFilter)
          query = query.concat(`
                AND `);
        query = query.concat(`companyId = ${companyId}`);
      }
      if (machineId !== undefined && machineId !== 0) {
        if (lastFilter)
          query = query.concat(`
                AND `);
        query = query.concat(`machineId = ${machineId}`);
      }
      if (paymentMethodId !== undefined && paymentMethodId !== 0) {
        if (lastFilter)
          query = query.concat(`
                AND `);
        query = query.concat(`paymentMethodId = ${paymentMethodId}`);
      }
      if (bankId !== undefined && bankId !== 0) {
        if (lastFilter)
          query = query.concat(`
                AND `);
        query = query.concat(`bankId = ${bankId}`);
      }
      if (transactionType !== undefined && transactionType !== 0) {
        if (lastFilter)
          query = query.concat(`
                AND `);
        query = query.concat(`transactionType = '${transactionType}'`);
      }
      if (transactionStatus !== undefined && transactionStatus.length !== 0) {
        if (lastFilter)
          query = query.concat(`
                AND (`);
        let transactionStatusFilter;
        for (const element of transactionStatus) {
          if (transactionStatusFilter)
            query = query.concat(`
                    OR `);
          query = query.concat(`transactionStatus = '${element}'`);
          transactionStatusFilter = true;
        }
        query = query.concat(`)`);
      }
      if (startPrice !== undefined && startPrice !== 0) {
        if (lastFilter)
          query = query.concat(`
                AND `);
        query = query.concat(`price >= '${startPrice}'`);
      }
      if (endPrice !== undefined && endPrice !== 0) {
        if (lastFilter)
          query = query.concat(`
                AND `);
        query = query.concat(`price <= '${endPrice}'`);
      }
    }

    //Sort Filter
    if (sort === true)
      //Ascending Order
      query = query.concat(`
            ORDER BY orderId`);
    else if (sort === false)
      //Decending Order
      query = query.concat(`
            ORDER BY orderId DESC`);

    //Limit Filter
    if (limit)
      query = query.concat(`
            LIMIT ${limit}`);

    console.log(query);

    const result = await dbQuery(query);

    // for (const element of result) {
    //     const timestamp = (element.timestamp.getTime() + 18000000);
    //     const updatedTime = new Date(timestamp)
    //     element.timestamp = updatedTime;
    // }

    return {
      success: true,
      result,
    };
  },
  adminOrderList: async (req, res, companyId) => {
    const {
      startDate,
      endDate,
      sort,
      limit,
      machineId,
      paymentMethodId,
      bankId,
      transactionType,
      transactionStatus,
      startPrice,
      endPrice,
    } = req.body;
    let isCompany = req.body.isCompany;
    if (isCompany === undefined) isCompany = false;

    let query = `
      SELECT orderId, companyName, machineName, paymentName, price, transactionStatus,
             companyUserId, userMobileNumber, transactionType, timestamp
      FROM orders
      INNER JOIN paymentmodes USING (paymentId)
      INNER JOIN paymentmethods USING (paymentMethodId)
      INNER JOIN machines USING (machineId)
      INNER JOIN companies USING (companyId)
      LEFT JOIN users USING (userId)`;

    query += `
        WHERE
          ${(startDate && `timestamp >= '${startDate} 00:00:00'`) || ""}
          ${
            (startDate &&
              endDate &&
              `AND timestamp <= '${endDate} 23:59:59'`) ||
            ""
          }
          ${(companyId && `AND companyId = ${companyId}`) || ""}
          ${(machineId && `AND machineId = ${machineId}`) || ""}
          ${
            (paymentMethodId && `AND paymentMethodId = ${paymentMethodId}`) ||
            ""
          }
          ${(bankId && `AND bankId = ${bankId}`) || ""}
          ${
            (transactionStatus &&
              transactionStatus.length > 0 &&
              `AND transactionStatus IN ('${transactionStatus.join(
                "','"
              )}')`) ||
            ""
          }
          ${(startPrice && `AND price >= '${startPrice}'`) || ""}
          ${(endPrice && `AND price <= '${endPrice}'`) || ""}`;

    query +=
      (isCompany && `AND transactionType IN ('debit-both', 'debit-company')`) ||
      "";
    query +=
      (isCompany === false &&
        `AND ((transactionType IS NULL) OR (transactionType IN ('debit', 'debit-recharge','debit-both')))`) ||
      "";

    query +=
      sort !== undefined
        ? `
        ORDER BY orderId ${sort ? "ASC" : "DESC"}`
        : "";

    query += limit ? ` LIMIT ${limit}` : "";

    console.log(query);

    const result = await dbQuery(query);

    return {
      success: true,
      result,
    };
  },

  partnerOrderList: async (req, res, companyId) => {
    const {
      startDate,
      endDate,
      sort,
      limit,
      machineId,
      paymentMethodId,
      bankId,
      transactionType,
      transactionStatus,
      startPrice,
      endPrice,
    } = req.body;
    let isCompany = req.body.isCompany;
    if (isCompany === undefined) isCompany = false;

    let query = `
      SELECT orderId, companyName, machineName, paymentName, price, transactionStatus,
             companyUserId, userMobileNumber, transactionType, timestamp
      FROM orders
      INNER JOIN paymentmodes USING (paymentId)
      INNER JOIN paymentmethods USING (paymentMethodId)
      INNER JOIN machines USING (machineId)
      INNER JOIN companies USING (companyId)
      LEFT JOIN users USING (userId)`;

    query += `
        WHERE
          ${(startDate && `timestamp >= '${startDate} 00:00:00'`) || ""}
          ${
            (startDate &&
              endDate &&
              `AND timestamp <= '${endDate} 23:59:59'`) ||
            ""
          }
          ${(companyId && `AND companyId = ${companyId}`) || ""}
          ${(machineId && `AND machineId = ${machineId}`) || ""}
          ${
            (paymentMethodId && `AND paymentMethodId = ${paymentMethodId}`) ||
            ""
          }
          ${(bankId && `AND bankId = ${bankId}`) || ""}
          ${
            (transactionStatus &&
              transactionStatus.length > 0 &&
              `AND transactionStatus IN ('${transactionStatus.join(
                "','"
              )}')`) ||
            ""
          }
          ${(startPrice && `AND price >= '${startPrice}'`) || ""}
          ${(endPrice && `AND price <= '${endPrice}'`) || ""}`;

    query +=
      (isCompany && `AND transactionType IN ('debit-both', 'debit-company')`) ||
      "";
    query +=
      (isCompany === false &&
        `AND ((transactionType IS NULL) OR (transactionType IN ('debit', 'debit-recharge','debit-both')))`) ||
      "";

    query +=
      sort !== undefined
        ? `
        ORDER BY orderId ${sort ? "ASC" : "DESC"}`
        : "";

    query += limit ? ` LIMIT ${limit}` : "";

    console.log(query);

    const result = await dbQuery(query);

    return {
      success: true,
      result,
    };
  },
  staffOrderList: async (req, res, companyId) => {
    const {
      startDate,
      endDate,
      sort,
      limit,
      machineId,
      paymentMethodId,
      bankId,
      transactionType,
      transactionStatus,
      startPrice,
      endPrice,
    } = req.body;
    let isCompany = req.body.isCompany;
    if (isCompany === undefined) isCompany = false;

    let query = `
      SELECT orderId, companyName, machineName, paymentName, price, transactionStatus,
             companyUserId, userMobileNumber, transactionType, timestamp
      FROM orders
      INNER JOIN paymentmodes USING (paymentId)
      INNER JOIN paymentmethods USING (paymentMethodId)
      INNER JOIN machines USING (machineId)
      INNER JOIN companies USING (companyId)
      LEFT JOIN users USING (userId)`;

    query += `
        WHERE
          ${(startDate && `timestamp >= '${startDate} 00:00:00'`) || ""}
          ${
            (startDate &&
              endDate &&
              `AND timestamp <= '${endDate} 23:59:59'`) ||
            ""
          }
          ${(companyId && `AND companyId = ${companyId}`) || ""}
          ${(machineId && `AND machineId = ${machineId}`) || ""}
          ${
            (paymentMethodId && `AND paymentMethodId = ${paymentMethodId}`) ||
            ""
          }
          ${(bankId && `AND bankId = ${bankId}`) || ""}
          ${
            (transactionStatus &&
              transactionStatus.length > 0 &&
              `AND transactionStatus IN ('${transactionStatus.join(
                "','"
              )}')`) ||
            ""
          }
          ${(startPrice && `AND price >= '${startPrice}'`) || ""}
          ${(endPrice && `AND price <= '${endPrice}'`) || ""}`;

    query +=
      (isCompany && `AND transactionType IN ('debit-both', 'debit-company')`) ||
      "";
    query +=
      (isCompany === false &&
        `AND ((transactionType IS NULL) OR (transactionType IN ('debit', 'debit-recharge','debit-both')))`) ||
      "";

    query +=
      sort !== undefined
        ? `
        ORDER BY orderId ${sort ? "ASC" : "DESC"}`
        : "";

    query += limit ? ` LIMIT ${limit}` : "";

    console.log(query);

    const result = await dbQuery(query);

    return {
      success: true,
      result,
    };
  },
  adminOrdersList: async (req, res, companyId) => {
    const tableName = "orders"; // Default table
    const joinName = "paymentmodes";
    const joinIdName = "paymentId";
    const joinName2 = "paymentmethods";
    const joinIdName2 = "paymentMethodId";
    const joinName3 = "machines";
    const joinIdName3 = "machineId";
    const joinName4 = "companies";
    const joinIdName4 = "companyId";
    const joinName5 = "users";
    const joinIdName5 = "userId";
    const sortId = "orderId";
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    // Extract search and filter parameters
    const search = req.query.search || null; // Single search term across all fields
    const startDate = req.query.startDate || null;
    const endDate = req.query.endDate || null;

    try {
      const result = await paginatefiveJoin(
        tableName,
        page,
        limit,
        search,
        startDate,
        endDate,
        joinName,
        joinIdName,
        joinName2,
        joinIdName2,
        joinName3,
        joinIdName3,
        joinName4,
        joinIdName4,
        joinName5,
        joinIdName5,
        sortId
      );
      return { success: true, ...result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

module.exports = orderService;
