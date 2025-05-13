const postMerchantService = require("../../../services/machineRegistration/merchants/postMerchants.services");

exports.postMerchants = async (req, res) => {
  try {
    const { permissionArray, companyId } = req.user;

    let result = {};

    if (permissionArray.includes("admin")) {
      const companyId = req.query.companyId;
      result = await postMerchantService.postMerchants(req, res, companyId);
    }
    // if (permissionArray.includes("superAdmin")) {
    //   const companyId = req.query.companyId;
    //   result = await postMerchantService.postMerchants(req, res, companyId);
    // }
    else result = { success: false, message: "Permission access denied" };

    return res.status(result.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
