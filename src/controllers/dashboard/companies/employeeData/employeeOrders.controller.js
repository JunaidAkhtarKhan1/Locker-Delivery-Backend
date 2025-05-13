const employeeOrdersService = require("../../../../services/dashboard/companies/employeeData/employeeOrders.services");

exports.displayEmployeeOrders = async (req, res) => {
  try {
    const { permissionArray, companyId } = req.user;
    console.log(companyId);

    if (permissionArray.includes("admin")) {
      const companyId = req.query.companyId;
      result = await employeeOrdersService.employeeOrders(req, res, companyId);
    } else if (permissionArray.includes("partner")) {
      const companyId = req.body.companyId;
      result = { success: false, message: "permission access denied" };
    } else if (permissionArray.includes("staffAdmin"))
      result = await employeeOrdersService.staffEmployeeOrders(
        req,
        res,
        companyId
      );
    else if (permissionArray.includes("staffFinance"))
      result = await employeeOrdersService.staffEmployeeOrders(
        req,
        res,
        companyId
      );
    else if (permissionArray.includes("staffHR"))
      result = await employeeOrdersService.staffEmployeeOrders(
        req,
        res,
        companyId
      );

    return res.status(result.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
