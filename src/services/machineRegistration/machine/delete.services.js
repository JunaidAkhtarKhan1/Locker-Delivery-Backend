const { dbQuery } = require("../../../utils/dbFunctions");

const deleteMachineService = {
  deleteMachine: async (req, res) => {
    const { id } = req.body;
    const machineId = id;

    // const machineId = req.query.machineId;

    if (machineId === undefined)
      return {
        success: false,
        message: "please provide machineId in query",
      };

    const query = `DELETE 
            FROM machines
            WHERE machineId = ${machineId}`;

    const result = await dbQuery(query);

    return {
      success: true,
      deletedRows: result.affectedRows,
    };
  },
};

module.exports = deleteMachineService;
