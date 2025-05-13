const { dbQuery } = require("../../../utils/dbFunctions");

const createMachineService = {
  createMachine: async (req, res) => {
    const { machineName, companyId } = req.body;
    // const { companyId } = req.user;
    // let machineSerialId = req.body.machineSerialId;
    // if (machineSerialId === undefined) machineSerialId = "";

    // if (machineTypeId === 2)
    //   if (machineSerialId.length === 0)
    //     return {
    //       success: false,
    //       message: "please provide machineSerialId",
    //     };
    // console.log("testt", companyId);

    if (companyId === undefined)
      return {
        success: false,
        message: "please provide companyId",
      };
    if (machineName === undefined)
      return {
        success: false,
        message: "please provide machineName",
      };

    let isActive = req.body.isActive || false;

    const query = `INSERT INTO machines(
                    machineName,
                    companyId,
                    isActive
                    )
                    VALUES (
                      '${machineName}',
                      ${companyId},
                      ${isActive}
                      )`;

    const result = await dbQuery(query);
    console.log(result);

    // if (machineTypeId !== 1) {
    //   return {
    //     success: true,
    //     message: "New machine added",
    //   };
    // }
    const deviceId = result.insertId.toString();

    // Define the new device
    const device = {
      deviceId,
    };

    const queryCompany = `SELECT * FROM companies 
                          WHERE companyId=${companyId}`;
    const result1 = await dbQuery(queryCompany);
    console.log(result1);

    const queryAdminUserRoles = `INSERT INTO adminuserroles (adminRoleId, adminUserId)
                                 VALUES (3, ${result1[0]?.adminUserId})`;

    const result2 = await dbQuery(queryAdminUserRoles);
    console.log(result2);

    const queryUserDetails = `SELECT * FROM adminuserroles
                            INNER JOIN adminusers USING (adminUserId)
                            WHERE adminUserRoleId =${result2?.insertId};`;

    const resultUserDetails = await dbQuery(queryUserDetails);
    console.log(resultUserDetails);

    const { email, decryptedPassword } = resultUserDetails[0];
    return {
      success: true,
      message: "New machine added",
      port: 3000,
      dns: process.env.BACKENDLINK,
      deviceId,
      email,
      password: decryptedPassword,
    };
  },
};

module.exports = createMachineService;
