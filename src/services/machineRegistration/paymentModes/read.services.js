const { query } = require("express");
const { paginatefourJoin, dbQuery } = require("../../../utils/dbFunctions");

const readPaymentModeService = {
  readPaymentMode: async (req, res) => {
    const tableName = "paymentmodes"; // Default table
    const joinName = "banks";
    const joinIdName = "bankId";
    const joinName2 = "paymentmethods";
    const joinIdName2 = "paymentMethodId";
    const joinName3 = "machines";
    const joinIdName3 = "machineId";
    const joinName4 = "merchants";
    const joinIdName4 = "merchantId";
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    // Extract search and filter parameters
    const search = req.query.search || null; // Single search term across all fields
    const startDate = req.query.startDate || null;
    const endDate = req.query.endDate || null;

    try {
      const result = await paginatefourJoin(
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
        joinIdName4
      );
      return { success: true, ...result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  readPaymentModeMachine: async (req, res) => {
    const machineId = req.query.machineId;

    if (machineId === undefined) {
      return { success: false, error: "Machine ID is required" };
    }

    try {
      const query = `SELECT * FROM paymentmodes WHERE machineId = ${machineId}`;
      const result = await dbQuery(query);
      console.log(result);

      return { success: true, result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

module.exports = readPaymentModeService;
