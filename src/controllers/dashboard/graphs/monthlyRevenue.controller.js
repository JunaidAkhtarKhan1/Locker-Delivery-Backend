const monthlyRevenueGraphService = require("../../../services/dashboard/graphs/monthlyRevenue.services");

exports.monthlyRevenueGraph = async (req, res) => {
  try {
    const { permissionArray, companyId } = req.user;
    let result = {};

    if (permissionArray.includes("admin")) {
      const companyId = req.query.companyId;
      result = await monthlyRevenueGraphService.adminMonthlyRevenueGraph(
        req,
        res,
        companyId
      );
    } else if (permissionArray.includes("partner")) {
      const companyId = req.query.companyId;
      result = await monthlyRevenueGraphService.partnerMonthlyRevenueGraph(
        req,
        res,
        companyId
      );
    } else if (permissionArray.includes("staffAdmin"))
      result = await monthlyRevenueGraphService.companyMonthlyRevenueGraph(
        req,
        res,
        companyId
      );
    else if (permissionArray.includes("staffFinance"))
      result = await monthlyRevenueGraphService.companyMonthlyRevenueGraph(
        req,
        res,
        companyId
      );
    else if (permissionArray.includes("staffHR"))
      result = await monthlyRevenueGraphService.companyMonthlyRevenueGraph(
        req,
        res,
        companyId
      );

    return res.status(result.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
