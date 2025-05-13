const getBanksService = require("../../../services/machineRegistration/banks/getBanks.services");

exports.getAllBanks = async (req, res) => {
  try {
    const { permissionArray, companyId } = req.user;
    // console.log(companyId);

    let result = {};

    if (permissionArray.includes("admin")) {
      const companyId = req.query.companyId;
      result = await getBanksService.getBanks(req, res, companyId);
    } else result = { success: false, message: "Permission access denied" };

    return res.status(result.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
