const { dbQuery, dbUpdateGeneral } = require("../../utils/dbFunctions");
const bcrypt = require("bcrypt");

const updateUserService = {
  updateUser: async (req, res) => {
    const {
      adminUserId,
      name,
      email,
      password,
      companyId,
      adminRoleId,
      adminUserRoleId,
    } = req.body;
    console.log("here");

    if (!adminUserId)
      return {
        success: false,
        message: "please provide UserId",
      };
    if (!name)
      return {
        success: false,
        message: "please provide name",
      };
    if (!email)
      return {
        success: false,
        message: "please provide email",
      };
    let reqBody = {};
    if (password === "") {
      const {
        adminRoleId,
        passwordConfirmation,
        oldAdminRoleId,
        adminUserRoleId,
        password,
        ...body
      } = req.body;
      reqBody = body;
    } else {
      const {
        adminRoleId,
        passwordConfirmation,
        oldAdminRoleId,
        adminUserRoleId,
        ...body
      } = req.body;
      //Encrypt user password
      const salt = await bcrypt.genSalt(10);
      const encryptedPassword = await bcrypt.hash(password, salt);
      body.password = encryptedPassword;
      reqBody = body;
    }

    const obj = { adminUserId };

    const query = `
                UPDATE adminusers
                    SET	?
                    WHERE ?
                `;

    const data = [reqBody, obj];

    const result = await dbUpdateGeneral(query, data)
      .then((result) => {
        console.log("result", result);
        return result;
      })
      .catch((err) => {
        console.log("error", err);
        throw err;
      });

    const queryRole = `UPDATE adminuserroles
                        SET adminRoleId = ${adminRoleId}
                        WHERE adminUserRoleId = ${adminUserRoleId}`;

    const resultRole = await dbQuery(queryRole);

    return {
      success: true,
      message: "User updated",
      userUpdated: result,
      resultRole,
    };
  },
};

module.exports = updateUserService;
