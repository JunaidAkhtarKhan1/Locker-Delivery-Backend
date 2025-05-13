const readPaymentModeService = require("../../../services/machineRegistration/paymentModes/read.services");

exports.readPaymentMode = async (req, res) => {
  try {
    const { permissionArray, companyId } = req.user;
    // console.log(companyId);

    let result = {};

    if (permissionArray.includes("admin")) {
      result = await readPaymentModeService.readPaymentMode(req, res);
    } else if (permissionArray.includes("machine")) {
      result = await readPaymentModeService.readPaymentModeMachine(req, res);
    } else result = { success: false, message: "Permission access denied" };

    return res.status(result.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
