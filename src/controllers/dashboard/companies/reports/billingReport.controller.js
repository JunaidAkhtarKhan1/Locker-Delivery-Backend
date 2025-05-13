const billingReportService = require("../../../../services/dashboard/companies/reports/billingReport");

exports.billingReport = async (req, res) => {
  try {
    const { permissionArray, companyId } = req.user;
    console.log("Company Id: ", companyId);

    if (permissionArray.includes("admin")) {
      const companyId = req.body.companyId;
      result = await billingReportService.adminBillingInfo(req, res, companyId);
    } else if (permissionArray.includes("partner")) {
      const companyId = req.body.companyId;
      result = await billingReportService.partnerBillingInfo(
        req,
        res,
        companyId
      );
    } else if (permissionArray.includes("staffAdmin"))
      result = await billingReportService.billingInfo(req, res, companyId);
    else if (permissionArray.includes("staffFinance"))
      result = await billingReportService.billingInfo(req, res, companyId);
    else result = { success: false, message: "Permission access denied" };

    return res.status(result.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
