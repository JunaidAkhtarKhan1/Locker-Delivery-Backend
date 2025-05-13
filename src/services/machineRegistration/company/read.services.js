const { paginate } = require("../../../utils/dbFunctions");

const readCompanyService = {
  readCompany: async (req, res, companyId) => {
    const tableName = "companies"; // Default table
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    // Extract search and filter parameters
    const search = req.query.search || null; // Single search term across all fields
    const startDate = req.query.startDate || null;
    const endDate = req.query.endDate || null;

    try {
      const result = await paginate(
        tableName,
        page,
        limit,
        search,
        startDate,
        endDate
      );
      return { success: true, ...result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

module.exports = readCompanyService;
