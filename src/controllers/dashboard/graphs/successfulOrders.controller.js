const successfulOrdersGraphService = require("../../../services/dashboard/graphs/successfulOrders.services");

exports.successfulOrdersGraph = async (req, res) => {
  try {
    const { permissionArray, companyId } = req.user;
    let result = {};

    if (permissionArray.includes("admin")) {
      const companyId = req.query.companyId;
      result = await successfulOrdersGraphService.adminSuccessfulOrdersGraph(
        req,
        res,
        companyId
      );
    } else if (permissionArray.includes("partner")) {
      const companyId = req.query.companyId;
      result = await successfulOrdersGraphService.partnerSuccessfulOrdersGraph(
        req,
        res,
        companyId
      );
    } else if (permissionArray.includes("staffAdmin"))
      result = await successfulOrdersGraphService.companySuccessfulOrdersGraph(
        req,
        res,
        companyId
      );
    else if (permissionArray.includes("staffFinance"))
      result = await successfulOrdersGraphService.companySuccessfulOrdersGraph(
        req,
        res,
        companyId
      );
    else if (permissionArray.includes("staffHR"))
      result = await successfulOrdersGraphService.companySuccessfulOrdersGraph(
        req,
        res,
        companyId
      );

    return res.status(result.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
