const updatePasswordService = require("../../services/authentication/updatePassword.services");
const { querySchema } = require("../../models/login.model");

exports.updatePassword = async (req, res) => {
  try {
    const { permissionArray, companyId } = req.user;
    let result = {};

    if (permissionArray.includes("admin")) {
      const companyId = req.query.companyId;
      result = await updatePasswordService.updatePassword(req, res, companyId);
    }

    return res.status(result.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
