const rfidService = require("../../../../services/dashboard/companies/employeeData/updateRfidData.services");

exports.updateRfidData = async (req, res) => {
    try {
        const { permissionArray, companyId } = req.user;

        if (permissionArray.includes('admin')) {
            const companyId = req.query.companyId;
            result = await rfidService.rfidList(req, res, companyId);
        }
        else if (permissionArray.includes('staffAdmin'))
            result = await rfidService.rfidListCompany(req, res, companyId);
        else if (permissionArray.includes('staffHR'))
            result = await rfidService.rfidListCompany(req, res, companyId);
        else
            result = { success: false, message: "Permission access denied" }

        return res.status(result.success ? 200 : 400).send(result);
    }
    catch (error) {
        res.status(500).send({ success: false, message: error });
    }
};