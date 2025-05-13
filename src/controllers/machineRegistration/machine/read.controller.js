const readMachineService = require("../../../services/machineRegistration/machine/read.services");

exports.readMachine = async (req, res) => {
  try {
    const { permissionArray, companyId } = req.user;
    // console.log(companyId);

    let result = {};

    if (permissionArray.includes("admin")) {
      const companyId = req.body.companyId;
      result = await readMachineService.readMachine(req, res, companyId);
    } else if (permissionArray.includes("staffAdmin")) {
      result = await readMachineService.readCompanyMachine(req, res, companyId);
    } else result = { success: false, message: "Permission access denied" };

    return res.status(result.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
