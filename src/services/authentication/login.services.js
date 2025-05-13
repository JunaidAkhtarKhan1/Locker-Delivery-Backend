const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { dbQuery } = require("../../utils/dbFunctions");

const loginService = {
  login: async (req, res) => {
    const email = req.body.email;
    const passwordEntered = req.body.password;
    let match = false;
    let emailMatch = false;
    let passwordHash;
    let message = "User not exists";
    let token = "";
    let userRightsArray = [];
    let userObject;
    let jwturl = process.env.JWTPRIVATEKEY;
    let permissionArray = [];

    const query = `SELECT *
            FROM adminusers`;

    const result = await dbQuery(query);

    for (const elements of result) {
      if (email === elements.email) {
        emailMatch = true;
        passwordHash = elements.password;
        userObject = elements;
        break;
      }
    }

    if (emailMatch) {
      match = await bcrypt.compare(passwordEntered, passwordHash);
      if (match) {
        message = "Login Successful";
        const query = `SELECT adminRoleCategory, 
                            companyId,
                            adminRoleId
                    FROM adminusers
                    INNER JOIN adminuserroles USING (adminUserId)
                    INNER JOIN adminroles USING (adminRoleId)
                    WHERE adminUserId = ${userObject.adminUserId};`;

        const login = await dbQuery(query);

        console.log("Login: ", login);

        if (login.length !== 0)
          for (const element of login) {
            permissionArray.push(element?.adminRoleCategory);
            userRightsArray.push(element?.adminRoleId);
          }
        else
          return {
            success: false,
            message: "Permissions not allocated to user",
          };

        const permission = {
          email,
          permissionArray,
          companyId: login[0].companyId,
        };
        token = jwt.sign(permission, jwturl);

        const queryRights = `SELECT * FROM adminrights WHERE adminRoleId IN (${userRightsArray.join(
          ","
        )})`;
        const userRightsQuery = await dbQuery(queryRights);
        for (const elements of userRightsQuery) {
          elements.add = elements.add ? true : false;
          elements.edit = elements.edit ? true : false;
          elements.view = elements.view ? true : false;
          elements.delete = elements.delete ? true : false;
        }
        userObject.userRights = userRightsQuery;
        delete userObject.password;
        delete userObject.isActive;
      } else
        return {
          success: false,
          message: "Incorrect User or Password",
        };
    } else
      return {
        success: false,
        message: "Incorrect User or Password",
      };

    return {
      success: true,
      loginSuccess: match,
      message,
      token,
      user: userObject,
    };
  },
};

module.exports = loginService;
