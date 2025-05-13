const balanceRequestService = require("../../../services/dashboard/companies/balanceRequest.services");

exports.balanceRequestCompany = async (req, res) => {
    try {
        const { permissionArray, companyId, email } = req.user;
        console.log("Company Id: ", companyId);

        if (permissionArray.includes('staffAdmin'))
            result = await balanceRequestService.balanceRequestCompany(req, res, companyId, email);
        else if (permissionArray.includes('staffFinance'))
            result = await balanceRequestService.balanceRequestCompany(req, res, companyId, email);
        else
            result = { success: false, message: "Permission access denied" }

        return res.status(result.success ? 200 : 400).send(result);
    }
    catch (error) {
        res.status(500).send({ success: false, message: error });
    }
};