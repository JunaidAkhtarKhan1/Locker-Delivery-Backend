const { dbQuery } = require("../../utils/dbFunctions");

const getColumnDetailsService = {
  getColumnDetails: async (req, res) => {
    const machineId = req.query.machineId;
    // Validate machineId
    if (!machineId) {
      return {
        success: false,
        message: "Please provide machineId",
      };
    }

    const query = `SELECT * FROM columnprice
                  LEFT JOIN products USING (productId) `;

    const result = await dbQuery(query);

    return {
      success: true,
      result,
    };
  },
  getColumnDetailsAdmin: async (req, res) => {
    const machineId = req.query.machineId;
    // Validate machineId
    if (!machineId) {
      return {
        success: false,
        message: "Please provide machineId",
      };
    }

    const query = `SELECT * FROM columnprice
                  INNER JOIN products USING (productId) `;

    const result = await dbQuery(query);

    return {
      success: true,
      result,
    };
  },
};

module.exports = getColumnDetailsService;
