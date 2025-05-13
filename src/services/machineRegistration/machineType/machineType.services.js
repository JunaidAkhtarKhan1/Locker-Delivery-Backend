const { dbQuery } = require("../../../utils/dbFunctions");

const readMachineTypeService = {
  readMachineType: async (req, res) => {
    const query = `SELECT *
                FROM machinetype`;

    const result = await dbQuery(query);
    return {
      success: true,
      result,
    };
  },
};

module.exports = readMachineTypeService;
