const getRightsManagementService = require("../../../services/authentication/rightsManagement/getRights.services");

exports.getAllRightsManagement = async (req, res) => {
  try {
    let result = {};
    result = await getRightsManagementService.getRightsManagement(req, res);
    return res.status(result?.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
