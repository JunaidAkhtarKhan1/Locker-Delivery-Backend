const saleDetailService = require("../../../services/dashboard/sales/saleDetail.services");

exports.saleDetail = async (req, res) => {
  try {
    const { permissionArray, companyId } = req.user;
    console.log(companyId);

    if (permissionArray.includes("admin")) {
      const companyId = req.query.companyId;
      result = await saleDetailService.adminSaleDetail(req, res, companyId);
    } else if (permissionArray.includes("partner")) {
      const companyId = req.query.companyId;
      result = await saleDetailService.partnerSaleDetail(req, res, companyId);
    } else if (permissionArray.includes("staffAdmin"))
      result = await saleDetailService.companySaleDetail(req, res, companyId);
    else if (permissionArray.includes("staffFinance"))
      result = await saleDetailService.companySaleDetail(req, res, companyId);
    else if (permissionArray.includes("staffHR"))
      result = await saleDetailService.companySaleDetail(req, res, companyId);

    return res.status(result.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
