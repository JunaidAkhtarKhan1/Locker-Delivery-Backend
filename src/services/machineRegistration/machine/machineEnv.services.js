const { de } = require("date-fns/locale");
const { dbQuery } = require("../../../utils/dbFunctions");
require("dotenv").config();

const createMachineEnvService = {
  createMachineEnv: async (req, res, companyId) => {
    let query;
    let result;

    try {
      if (companyId === undefined) {
        query = `SELECT *
                  FROM machines`;

        result = await dbQuery(query);
      } else {
        query = `SELECT *
                  FROM machines
                  WHERE companyId=${companyId}`;

        result = await dbQuery(query);
        console.log(result[0].machineId.toString());

        const deviceId = result[0].machineId;

        console.log(deviceId);

        const queryAdmin = `SELECT * FROM cashless_vending_machine.adminusers
                      WHERE companyId = ${companyId}
                      LIMIT 1;`;

        const resultAdmin = await dbQuery(queryAdmin);

        console.log(resultAdmin);

        const { email, decryptedPassword } = resultAdmin[0];

        return {
          success: true,
          message: "get machine",
          port: 3000,
          dns: process.env.BACKENDLINK,
          deviceId,
          email,
          password: decryptedPassword,
        };
      }
    } catch (error) {
      console.error("Error in reading machine:", error);
      return {
        success: false,
        message: "Failed to read machine data.",
        error: error.toString(),
      };
    }
  },
};

module.exports = createMachineEnvService;
