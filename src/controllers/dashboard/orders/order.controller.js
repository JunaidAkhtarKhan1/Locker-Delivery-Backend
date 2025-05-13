const orderService = require("../../../services/dashboard/orders/order.services");

exports.orderList = async (req, res) => {
  try {
    const { permissionArray, companyId } = req.user;
    console.log(companyId);

    if (permissionArray.includes("admin")) {
      const companyId = req.query.companyId;
      result = await orderService.adminOrdersList(req, res, companyId);
    } else if (permissionArray.includes("partner")) {
      const companyId = req.body.companyId;
      result = await orderService.partnerOrderList(req, res, companyId);
    } else if (permissionArray.includes("staffAdmin"))
      result = await orderService.staffOrderList(req, res, companyId);
    else if (permissionArray.includes("staffFinance"))
      result = await orderService.staffOrderList(req, res, companyId);
    else if (permissionArray.includes("staffHR"))
      result = await orderService.staffOrderList(req, res, companyId);

    return res.status(result.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
