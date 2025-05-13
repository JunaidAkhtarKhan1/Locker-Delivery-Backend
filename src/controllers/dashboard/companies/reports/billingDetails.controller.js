const billingDetails = require("../../../../services/dashboard/companies/reports/billingDetails");

exports.billingDetails = async (req, res) => {
  try {
    const { permissionArray, companyId } = req.user;
    console.log("Company Id: ", companyId);

    if (permissionArray.includes("admin")) {
      const companyId = req.query.companyId;
      result = await billingDetails.billingDetailsAdmin(req, res, companyId);
    } else if (permissionArray.includes("partner"))
      result = await billingDetails.billingDetailsPartner(req, res);
    else if (permissionArray.includes("staffAdmin"))
      result = await billingDetails.billingDetailsCompany(req, res, companyId);
    else if (permissionArray.includes("staffFinance"))
      result = await billingDetails.billingDetailsCompany(req, res, companyId);
    else if (permissionArray.includes("staffHR"))
      result = await billingDetails.billingDetailsCompany(req, res, companyId);
    else result = { success: false, message: "Permission access denied" };

    return res.status(result.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
