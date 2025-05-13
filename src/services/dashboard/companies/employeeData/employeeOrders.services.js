const { dbQuery } = require("../../../../utils/dbFunctions");

const employeeOrdersService = {
  employeeOrders: async (req, res, companyId) => {
    const {
      startDate,
      endDate,
      sort,
      limit,
      machineId,
      paymentMethodId,
      transactionType,
      transactionStatus,
      startPrice,
      endPrice,
      companyUserId,
    } = req.body;
    let isCompany = req.body.isCompany;
    if (isCompany === undefined) isCompany = false;

    let query = `
      SELECT orderId, companyName, machineName, paymentName, price, transactionStatus,
             companyUserId, transactionType, timestamp
      FROM orders
      INNER JOIN paymentmodes USING (paymentId)
      INNER JOIN paymentmethods USING (paymentMethodId)
      INNER JOIN machines USING (machineId)
      INNER JOIN companies USING (companyId)
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
          ${`AND paymentName = 'rfid'`}
          ${(companyUserId && `AND companyUserId = ${companyUserId}`) || ""}
          ${
            (transactionStatus &&
              transactionStatus.length > 0 &&
              `AND transactionStatus IN ('${transactionStatus.join(
                "','"
              )}')`) ||
            ""
          }
          ${(startPrice && `AND price >= '${startPrice}'`) || ""}
          ${(endPrice && `AND price <= '${endPrice}'`) || ""}
          ${
            (isCompany &&
              `AND transactionType IN ('debit-both', 'debit-company')`) ||
            ""
          }
          ${
            (isCompany === false &&
              `AND ((transactionType IS NULL) OR (transactionType IN ('debit', 'debit-recharge','debit-both')))`) ||
            ""
          }
          ${
            sort !== undefined
              ? `ORDER BY orderId ${sort ? "ASC" : "DESC"}`
              : ""
          }
     ${limit ? ` LIMIT ${limit}` : ""}`;

    console.log(query);

    const result = await dbQuery(query);

    return {
      success: true,
      result,
    };
  },

  staffEmployeeOrders: async (req, res, companyId) => {
    const {
      startDate,
      endDate,
      sort,
      limit,
      machineId,
      paymentMethodId,
      transactionType,
      transactionStatus,
      startPrice,
      endPrice,
      companyUserId,
    } = req.body;
    let isCompany = req.body.isCompany;
    if (isCompany === undefined) isCompany = false;

    let query = `
      SELECT orderId, companyName, machineName, paymentName, price, transactionStatus,
             companyUserId, transactionType, timestamp
      FROM orders
      INNER JOIN paymentmodes USING (paymentId)
      INNER JOIN paymentmethods USING (paymentMethodId)
      INNER JOIN machines USING (machineId)
      INNER JOIN companies USING (companyId)
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
          ${`AND paymentName = 'rfid'`}
          ${(companyUserId && `AND companyUserId = ${companyUserId}`) || ""}
          ${
            (transactionStatus &&
              transactionStatus.length > 0 &&
              `AND transactionStatus IN ('${transactionStatus.join(
                "','"
              )}')`) ||
            ""
          }
          ${(startPrice && `AND price >= '${startPrice}'`) || ""}
          ${(endPrice && `AND price <= '${endPrice}'`) || ""}
          ${
            (isCompany &&
              `AND transactionType IN ('debit-both', 'debit-company')`) ||
            ""
          }
          ${
            (isCompany === false &&
              `AND ((transactionType IS NULL) OR (transactionType IN ('debit', 'debit-recharge','debit-both')))`) ||
            ""
          }
          ${
            sort !== undefined
              ? `ORDER BY orderId ${sort ? "ASC" : "DESC"}`
              : ""
          }
     ${limit ? ` LIMIT ${limit}` : ""}`;

    console.log(query);

    const result = await dbQuery(query);

    return {
      success: true,
      result,
    };
  },
};

module.exports = employeeOrdersService;
