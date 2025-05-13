const {
  paginateOneJoin,
  paginateOneJoinWhere,
} = require("../../../utils/dbFunctions");

const readMachineService = {
  readMachine: async (req, res, companyId) => {
    const tableName = "machines"; // Default table
    const joinName = "companies";
    const joinIdName = "companyId";
    const sortId = "machineId";

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

  readCompanyMachine: async (req, res, companyId) => {
    const tableName = "machines"; // Default table
    const joinName = "companies";
    const joinIdName = "companyId";
    const sortId = "machineId";

    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    // Extract search and filter parameters
    const search = req.query.search || null; // Single search term across all fields
    const startDate = req.query.startDate || null;
    const endDate = req.query.endDate || null;

    try {
      const result = await paginateOneJoinWhere(
        tableName,
        page,
        limit,
        search,
        startDate,
        endDate,
        joinName,
        joinIdName,
        sortId,
        companyId
      );
      return { success: true, ...result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

module.exports = readMachineService;
