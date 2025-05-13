const getPaymentMethodsService = require("../../../services/machineRegistration/paymentMethods/getPaymentMethods.services");

exports.getAllPaymentMethods = async (req, res) => {
  try {
    const { permissionArray, companyId } = req.user;
    // console.log(companyId);

    let result = {};

    if (permissionArray.includes("admin")) {
      const companyId = req.query.companyId;
      result = await getPaymentMethodsService.getPaymentMethods(
        req,
        res,
        companyId
      );
    } else result = { success: false, message: "Permission access denied" };

    return res.status(result.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
