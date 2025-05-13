const companyReportService = require("../../../../services/dashboard/companies/reports/companyReport");

exports.companyReport = async (req, res) => {
    try {
        const { permissionArray, companyId } = req.user;
        console.log("Company Id: ", companyId);

        if (permissionArray.includes('admin')) {
            const companyId = req.query.companyId;
            result = await employeeStatusService.employeeStatus(req, res, companyId);
        }
        else if (permissionArray.includes('partner'))
            result = await companyReportService.companyRfidReport(req, res);
        else if (permissionArray.includes('staffAdmin'))
            result = await companyReportService.companyPaymentReport(req, res, companyId);
        else if (permissionArray.includes('staffFinance'))
            result = await companyReportService.companyReport(req, res, companyId);
        else
            result = { success: false, message: "Permission access denied" }

        return res.status(result.success ? 200 : 400).send(result);
    }
    catch (error) {
        res.status(500).send({ success: false, message: error });
    }
};