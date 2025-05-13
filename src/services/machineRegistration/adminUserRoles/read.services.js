const { paginatetwoJoin } = require("../../../utils/dbFunctions");

const readAdminUserRoleService = {
  readAdminUserRoles: async (req, res, companyId) => {
    const tableName = "adminuserroles"; // Default table
    const joinName = "adminroles";
    const joinIdName = "adminRoleId";
    const joinName2 = "adminusers";
    const joinIdName2 = "adminUserId";
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    // Extract search and filter parameters
    const search = req.query.search || null; // Single search term across all fields
    const startDate = req.query.startDate || null;
    const endDate = req.query.endDate || null;

    try {
      const result = await paginatetwoJoin(
        tableName,
        page,
        limit,
        search,
        startDate,
        endDate,
        joinName,
        joinIdName,
        joinName2,
        joinIdName2
      );
      return { success: true, ...result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

module.exports = readAdminUserRoleService;
