const { dbQuery, paginateOneJoin } = require("../../../../utils/dbFunctions");

const rfidService = {
  rfidList: async (req, res, companyId) => {
    let query;

    if (companyId === undefined) {
      query = `SELECT 
                companyUserId,
                employeeId,
                name,
                balance,
                companyBalance,
                companyId,
                isActive,
                isDeleted
              FROM companyusers`;
    } else {
      query = `SELECT 
                companyUserId,
                employeeId,
                name,
                balance,
                companyBalance,
                companyId,
                isActive,
                isDeleted
              FROM companyusers
              WHERE companyId = ${companyId}`;
    }

    let result = await dbQuery(query);

    result.sort((a, b) => {
      // Convert employeeId values to numbers for numerical comparison
      const employeeIdA = parseInt(a.employeeId);
      const employeeIdB = parseInt(b.employeeId);

      return employeeIdA - employeeIdB;
    });

    return {
      success: true,
      result,
    };
  },
  rfidListAdmin: async (req, res, companyId) => {
    let query = "";

    if (companyId === undefined || companyId === "" || companyId === null) {
      query = `SELECT 
                companyUserId,
                employeeId,
                name,
                balance,
                companyBalance,
                companyId,
                isActive,
                isDeleted
                FROM companyusers`;
    } else {
      query = `SELECT 
                companyUserId,
                employeeId,
                name,
                balance,
                companyBalance,
                companyId,
                isActive,
                isDeleted
              FROM companyusers
              WHERE companyId = ${companyId}`;
    }

    let result = await dbQuery(query);

    result.sort((a, b) => {
      // Convert employeeId values to numbers for numerical comparison
      const employeeIdA = parseInt(a.employeeId);
      const employeeIdB = parseInt(b.employeeId);

      return employeeIdA - employeeIdB;
    });

    return {
      success: true,
      result,
    };
  },
  rfidListCompany: async (req, res, companyId) => {
    const query = `SELECT 
                    companyUserId,
                    employeeId,
                    name,
                    balance,
                    companyBalance,
                    companyId,
                    isActive,
                    isDeleted
                  FROM companyusers
                  WHERE companyId = ${companyId}`;

    let result = await dbQuery(query);

    result.sort((a, b) => {
      // Convert employeeId values to numbers for numerical comparison
      const employeeIdA = parseInt(a.employeeId);
      const employeeIdB = parseInt(b.employeeId);

      return employeeIdA - employeeIdB;
    });

    return {
      success: true,
      result,
    };
  },
  rfidListCompanyEasyvend: async (req, res, companyId) => {
    const query = `SELECT 
                    companyUserId,
                    employeeId,
                    name,
                    rfid,
                    balance,
                    companyBalance,
                    companyId,
                    isActive,
                    isDeleted
                  FROM companyusers
                  WHERE companyId = ${companyId}`;

    let result = await dbQuery(query);

    result.sort((a, b) => {
      // Convert employeeId values to numbers for numerical comparison
      const employeeIdA = parseInt(a.rfid);
      const employeeIdB = parseInt(b.rfid);

      return employeeIdA - employeeIdB;
    });

    return {
      success: true,
      result,
    };
  },
  rfidData: async (req, res, companyId) => {
    const tableName = "companyusers"; // Default table
    const joinName = "companies";
    const joinIdName = "companyId";
    const sortId = "companyUserId";
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    // Extract search and filter parameters
    const search = req.query.search || null; // Single search term across all fields
    const startDate = req.query.startDate || null;
    const endDate = req.query.endDate || null;

    try {
      const result = await paginateOneJoin(
        tableName,
        page,
        limit,
        search,
        startDate,
        endDate,
        joinName,
        joinIdName,
        sortId
      );
      return { success: true, ...result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

module.exports = rfidService;
