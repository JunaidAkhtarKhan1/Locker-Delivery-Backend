const createCompanyService = require("../../../services/machineRegistration/company/create.services");

exports.createCompany = async (req, res) => {
  try {
    const { permissionArray } = req.user;
    let result = {};

    if (permissionArray.includes("admin")) {
      result = await createCompanyService.createCompany(req, res);
    } else result = { success: false, message: "Permission access denied" };

    return res.status(result.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
