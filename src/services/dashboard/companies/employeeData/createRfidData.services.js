const { dbQuery } = require("../../../../utils/dbFunctions");

const rfidService = {
  rfidList: async (req, res, companyId) => {
    let query;

    if (companyId === undefined) {
      query = `SELECT *
                FROM companyusers`;
    } else {
      query = `SELECT *
                FROM companyusers
                WHERE companyId = ${companyId}`;
    }

    const result = await dbQuery(query);

    return {
      success: true,
      result,
    };
  },
  rfidListCompany: async (req, res, companyId) => {
    const { employeeId, employeeName } = req.body;

    let rfidData = req.body.rfidData;
    let isActive = req.body.isActive;

    if (rfidData === undefined) rfidData = "";
    if (isActive === undefined) isActive = 1;

    const dateNow = new Date(Date.now() + 18000000)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const query = `INSERT INTO companyusers(
                employeeId,
                rfid,
                name,
                dateCreated,
                companyId,
                isActive,
                isDeleted
            )
            VALUES (
                '${employeeId}',
                '${rfidData}',
                '${employeeName}',
                '${dateNow}',
                ${companyId},
                ${isActive},
                0
            )`;

    const result = await dbQuery(query);

    return {
      success: true,
      message: "New employee added",
      companyUserId: result.insertId,
      result,
    };
  },
};

module.exports = rfidService;
