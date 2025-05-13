const { dbQuery, dbUpdateGeneral } = require("../../../utils/dbFunctions");

const updateMachineService = {
  updateMachine: async (req, res) => {
    const { machineName, companyId, machineId } = req.body;
    // const machineId = req.query.machineId;
    // console.log(machineId);

    if (machineId === undefined)
      return {
        success: false,
        message: "please provide machineId in query",
      };

    const obj = { machineId };

    const query = `
                UPDATE machines
                    SET	?
                    WHERE ?
                `;

    const data = [req.body, obj];

    const result = await dbUpdateGeneral(query, data);

    return {
      success: true,
      message: "user updated",
      userUpdated: result.changedRows,
    };
  },
};

module.exports = updateMachineService;
