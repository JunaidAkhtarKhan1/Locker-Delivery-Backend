const loginService = require("../../services/authentication/login.services");
const { querySchema } = require("../../models/login.model");

exports.login = async (req, res) => {
  try {
    const { error } = querySchema.validate(req.body);
    if (error) {
      const errorMessage = error.details[0].message;
      return res.status(400).json({ success: false, message: errorMessage });
    }
    const result = await loginService.login(req, res);
    return res
      .status(result.success ? 200 : 400)
      .header("x-auth-token", result.token)
      .send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
