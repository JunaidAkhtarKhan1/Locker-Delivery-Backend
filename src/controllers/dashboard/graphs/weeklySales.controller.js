const weeklySalesGraphService = require("../../../services/dashboard/graphs/weeklySales.services");

exports.weeklySalesGraph = async (req, res) => {
  try {
    const { permissionArray, companyId } = req.user;
    let result = {};

    if (permissionArray.includes("admin")) {
      const companyId = req.query.companyId;
      result = await weeklySalesGraphService.adminWeeklySalesGraph(
        req,
        res,
        companyId
      );
    } else if (permissionArray.includes("partner")) {
      const companyId = req.query.companyId;
      result = await weeklySalesGraphService.partnerWeeklySalesGraph(
        req,
        res,
        companyId
      );
    } else if (permissionArray.includes("staffAdmin"))
      result = await weeklySalesGraphService.companyWeeklySalesGraph(
        req,
        res,
        companyId
      );
    else if (permissionArray.includes("staffFinance"))
      result = await weeklySalesGraphService.companyWeeklySalesGraph(
        req,
        res,
        companyId
      );
    else if (permissionArray.includes("staffHR"))
      result = await weeklySalesGraphService.companyWeeklySalesGraph(
        req,
        res,
        companyId
      );

    return res.status(result.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
