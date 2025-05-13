const bcrypt = require("bcrypt");
const { dbQuery } = require("../../../utils/dbFunctions");
const {
  generateRandomPassword,
  cleanUsername,
} = require("../../../utils/functions");

const createCompanyService = {
  createCompany: async (req, res) => {
    const { companyName } = req.body;
    console.log("test");
    let address = req.body.address || "";
    let isActive = req.body.isActive || false;

    if (companyName === undefined)
      return {
        success: false,
        message: "Please provide companyName",
      };

    const query = `INSERT INTO companies(
                companyName,
                address
            )
            VALUES (
                '${companyName}',
                '${address}'
            )`;

    const result = await dbQuery(query);
    const companyId = result.insertId;

    if (result.affectedRows !== 1) {
      return {
        success: false,
        message: "Company Registration Failed",
      };
    }

    // Construct the email address using the cleaned company name
    const emailCompanyName = await cleanUsername(companyName);
    const email = `${emailCompanyName}@easyvend.com`;
    console.log(email);
    //Random generate 8 words passwords
    const password = await generateRandomPassword(8);
    console.log(password);

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);

    const dateNow = new Date(Date.now() + 18000000)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const queryAdminUser = `INSERT INTO adminusers(name, email, password, decryptedPassword, companyId, isActive, dateRegistered)
                VALUES (
                    "${companyName}",
                    "${email}",
                    "${encryptedPassword}",
                    "${password}",
                    ${companyId},
                    ${isActive},
                    "${dateNow}"
                )`;

    const resultAdminUser = await dbQuery(queryAdminUser);

    const queryUpdateUser = `UPDATE companies
                            SET adminUserId=${resultAdminUser.insertId}
                            WHERE companyId=${companyId}`;

    const resultUpdateUser = await dbQuery(queryUpdateUser);

    return {
      success: true,
      message: "New company and user added",
      companyId: companyId,
      userId: resultAdminUser.insertId,
      email,
    };
  },
};

module.exports = createCompanyService;
