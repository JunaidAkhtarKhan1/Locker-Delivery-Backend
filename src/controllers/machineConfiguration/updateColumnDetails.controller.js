const updateColumnDetailsService = require("../../services/machineConfiguration/updateColumnDetails.services");

exports.updateColumnDetails = async (req, res) => {
  try {
    const { permissionArray, companyId } = req.user;
    // console.log(companyId);

    let result = {};

    if (permissionArray.includes("superAdmin")) {
      const companyId = req.query.companyId;
      result = await updateColumnDetailsService.updateColumnDetailsAdmin(
        req,
        res,
        companyId
      );
    } else if (permissionArray.includes("admin")) {
      const companyId = req.query.companyId;
      result = await updateColumnDetailsService.updateColumnDetailsAdmin(
        req,
        res,
        companyId
      );
    } else if (permissionArray.includes("machine")) {
      const companyId = req.query.companyId;
      result = await updateColumnDetailsService.updateColumnDetails(
        req,
        res,
        companyId
      );
    } else if (permissionArray.includes("partner")) {
      const companyId = req.query.companyId;
      result = await updateColumnDetailsService.updateColumnDetailsAdmin(
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
