const rfidService = require("../../../../services/dashboard/companies/employeeData/createRfidData.services");

exports.createRfidData = async (req, res) => {
  try {
    const { permissionArray } = req.user;
    // console.log(companyId);

    if (permissionArray.includes("admin")) {
      const companyId = req.body.companyId;
      console.log("test", companyId);

      result = await rfidService.rfidList(req, res, companyId);
    } else if (permissionArray.includes("staffAdmin"))
      result = await rfidService.rfidListCompany(req, res, companyId);
    else if (permissionArray.includes("staffHR"))
      result = await rfidService.rfidListCompany(req, res, companyId);
    else result = { success: false, message: "Permission access denied" };

    return res.status(result.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
