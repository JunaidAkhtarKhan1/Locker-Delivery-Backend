const widgetService = require("../../../services/dashboard/widgets/widget.services");

exports.widgets = async (req, res) => {
  try {
    const { permissionArray, companyId } = req.user;
    let result = {};

    if (permissionArray.includes("admin")) {
      const companyId = req.query.companyId;
      result = await widgetService.adminWidgetList(req, res, companyId);
    } else if (permissionArray.includes("partner")) {
      const companyId = req.query.companyId;
      result = await widgetService.partnerWidgetList(req, res, companyId);
    } else if (permissionArray.includes("staffAdmin"))
      result = await widgetService.companyWidgetList(req, res, companyId);
    else if (permissionArray.includes("staffFinance"))
      result = await widgetService.companyWidgetList(req, res, companyId);
    else if (permissionArray.includes("staffHR"))
      result = await widgetService.companyWidgetList(req, res, companyId);

    return res.status(result.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
