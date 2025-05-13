const updateRightsManagement = require("../../../services/authentication/rightsManagement/updateRights.services");

exports.updateAllRightsManagement = async (req, res) => {
  try {
    let result = {};
    result = await updateRightsManagement.updateRightsManagement(req, res);
    return res.status(result?.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
