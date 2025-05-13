const rfidService = require("../../../../services/dashboard/companies/employeeData/getRfidData.services");

exports.getRfidData = async (req, res) => {
  try {
    const { permissionArray, companyId } = req.user;
    // console.log(companyId);

    if (permissionArray.includes("admin")) {
      const companyId = req.body.companyId;
      result = await rfidService.rfidData(req, res, companyId);
    } else if (permissionArray.includes("staffAdmin"))
      result = await rfidService.rfidListCompanyEasyvend(req, res, companyId);
    else if (permissionArray.includes("staffFinance"))
      result = await rfidService.rfidListCompanyEasyvend(req, res, companyId);
    else if (permissionArray.includes("staffHR"))
      result = await rfidService.rfidListCompanyEasyvend(req, res, companyId);
    else result = { success: false, message: "Permission access denied" };

    return res.status(result.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
