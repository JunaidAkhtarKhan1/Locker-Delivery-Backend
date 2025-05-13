const { dbQuery } = require("../../utils/dbFunctions");
const bcrypt = require("bcrypt");

const registerUserService = {
  registerUser: async (req, res) => {
    let companyId;
    companyId = req.body.companyId;
    const { name, email, password, isActive, adminRoleId } = req.body;

    if (companyId === undefined) companyId = null;

    //Encrypt user password
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const dateNow = new Date(Date.now() + 18000000)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const query = `INSERT INTO adminusers(name, email, password, companyId, isActive, dateRegistered)
            VALUES (
                "${name}",
                "${email}",
                "${encryptedPassword}",
                ${companyId},
                ${isActive},
                "${dateNow}"
            )`;

    const result = await dbQuery(query);

    const adminUserId = result.insertId;

    if (adminRoleId === undefined || adminUserId === undefined)
      return {
        success: false,
        message: "please provide adminRoleId & adminUserId",
      };

    const queryAdmin = `INSERT INTO adminuserroles(
                    adminRoleId,
                    adminUserId
                )
                VALUES (
                    ${adminRoleId},
                    ${adminUserId}
                )`;

    const resultPermission = await dbQuery(queryAdmin);

    return {
      success: true,
      result,
      resultPermission,
    };
  },
};

module.exports = registerUserService;
