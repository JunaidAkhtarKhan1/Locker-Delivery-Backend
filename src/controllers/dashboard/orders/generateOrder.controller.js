const generateOrdersService = require("../../../services/dashboard/orders/generateOrder.services");

exports.generateOrders = async (req, res) => {
  try {
    const { permissionArray, companyId } = req.user;
    // console.log(companyId);

    let result = {};

    if (permissionArray.includes("superAdmin")) {
      const companyId = req.query.companyId;
      result = await generateOrdersService.generateOrders(req, res, companyId);
    } else if (permissionArray.includes("admin")) {
      const companyId = req.query.companyId;
      result = await generateOrdersService.generateOrders(req, res, companyId);
    } else if (permissionArray.includes("staffAdmin")) {
      result = await generateOrdersService.generateOrders(req, res, companyId);
    } else result = { success: false, message: "Permission access denied" };

    return res.status(result.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
