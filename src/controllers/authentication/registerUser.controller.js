const { querySchema } = require("../../models/users.model");
const registerUserService = require("../../services/authentication/registerUser.services");

exports.registerUser = async (req, res) => {
  try {
    const { permissionArray, companyId } = req.user;
    let result = {};

    if (
      permissionArray.includes("superAdmin") ||
      permissionArray.includes("admin")
    ) {
      const companyId = req.query.companyId;
      result = await registerUserService.registerUser(req, res);
    }

    return res.status(result.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
