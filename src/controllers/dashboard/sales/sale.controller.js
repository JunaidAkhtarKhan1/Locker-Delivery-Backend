const saleService = require("../../../services/dashboard/sales/sales.services");

exports.saleList = async (req, res) => {
  try {
    const { permissionArray, companyId } = req.user;
    console.log(companyId);

    if (permissionArray.includes("admin")) {
      const companyId = req.query.companyId;
      result = await saleService.adminSaleList(req, res, companyId);
    } else if (permissionArray.includes("partner")) {
      const companyId = req.body.companyId;
      result = await saleService.partnerSaleList(req, res, companyId);
    } else if (permissionArray.includes("staffAdmin"))
      result = await saleService.companySaleList(req, res, companyId);
    else if (permissionArray.includes("staffFinance"))
      result = await saleService.companySaleList(req, res, companyId);
    else if (permissionArray.includes("staffHR"))
      result = await saleService.companySaleList(req, res, companyId);

    return res.status(result.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
