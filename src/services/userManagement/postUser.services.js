const { dbQuery } = require("../../utils/dbFunctions");
const bcrypt = require("bcrypt");

const postUserService = {
  postUser: async (req, res) => {
    let companyId;

    companyId = req.body.companyId;
    const { name, email, password, isActive } = req.body;

    if (companyId === undefined) companyId = null;

    //Encrypt user password
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const dateNow = new Date(Date.now())
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
    // console.log("test");

    return {
      success: true,
      message: "New user added",
      result,
    };
  },
};

module.exports = postUserService;
