const signupService = require("../../services/authentication/signup.services");
const { querySchema } = require("../../models/users.model");

exports.signup = async (req, res) => {
  try {
    const { permissionArray, companyId } = req.user;
    let result = {};

    if (permissionArray.includes("admin")) {
      const companyId = req.query.companyId;
      result = await signupService.signup(req, res, companyId);
    }

    return res.status(result.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
