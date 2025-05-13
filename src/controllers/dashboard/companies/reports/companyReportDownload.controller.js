const companyReportService = require("../../../../services/dashboard/companies/reports/companyReportDownload");

exports.companyReportDownload = async (req, res) => {
    try {
        let result;
        let companyId = 1;
        result = await companyReportService.staffReportDownload(req, res, companyId);

        // const { permissionArray, companyId } = req.user;
        // console.log("Company Id: ", companyId);

        // if (permissionArray.includes('admin')) {
        //     const companyId = req.query.companyId;
        //     result = await employeeStatusService.staffReportDownload(req, res, companyId);
        // }
        // else if (permissionArray.includes('partner'))
        //     result = await companyReportService.staffReportDownload(req, res);
        // else if (permissionArray.includes('staffAdmin'))
        //     result = await companyReportService.staffReportDownload(req, res, companyId);
        // else if (permissionArray.includes('staffFinance'))
        //     result = await companyReportService.staffReportDownload(req, res, companyId);
        // else
        //     result = { success: false, message: "Permission access denied" }

        // console.log(result);

        // return res.status(result.success ? 200 : 400).send(result);

        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');

        return res.status(result.success ? 200 : 400).download(result.pdfBuffer.filename);

    }
    catch (error) {
        res.status(500).send({ success: false, message: error });
    }
};