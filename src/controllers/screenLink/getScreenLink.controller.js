const screenLinkService = require("../../services/screenLink/getScreenLink.services");

exports.getScreenLink = async (req, res) => {
  try {
    const { permissionArray, companyId } = req.user;
    // console.log(companyId);

    let result = {};

    // const companyId = req.query.companyId;
    result = await screenLinkService.getScreenLink(req, res, companyId);
    // if (permissionArray.includes("admin")) {
    // } else result = { success: false, message: "Permission access denied" };

    return res.status(result.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
