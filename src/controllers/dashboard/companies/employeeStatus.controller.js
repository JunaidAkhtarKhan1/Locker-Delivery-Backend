const employeeStatusService = require("../../../services/dashboard/companies/employeeStatus.services");

exports.employeeActivation = async (req, res) => {
    try {
        const { permissionArray, companyId } = req.user;
        console.log("Company Id: ", companyId);

        if (permissionArray.includes('admin')) {
            const companyId = req.query.companyId;
            result = await employeeStatusService.employeeStatus(req, res, companyId);
        }
        else if (permissionArray.includes('staffAdmin'))
            result = await employeeStatusService.employeeStatusCompany(req, res, companyId);
        else if (permissionArray.includes('staffFinance'))
            result = await employeeStatusService.employeeStatusCompany(req, res, companyId);
        else if (permissionArray.includes('staffHR'))
            result = await employeeStatusService.employeeStatusCompany(req, res, companyId);
        else
            result = { success: false, message: "Permission access denied" }

        return res.status(result.success ? 200 : 400).send(result);
    }
    catch (error) {
        res.status(500).send({ success: false, message: error });
    }
};