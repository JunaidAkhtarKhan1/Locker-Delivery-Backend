const { dbQuery } = require("../../utils/dbFunctions");
const bcrypt = require("bcrypt");

const updatePasswordService = {
  updatePassword: async (req, res) => {
    const { email, password } = req.body;

    //Encrypt user password
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const query = `UPDATE adminusers
                  SET password = '${encryptedPassword}'
                  WHERE email = '${email}'`;

    const result = await dbQuery(query);

    return {
      success: true,
      result,
    };
  },
};

module.exports = updatePasswordService;
