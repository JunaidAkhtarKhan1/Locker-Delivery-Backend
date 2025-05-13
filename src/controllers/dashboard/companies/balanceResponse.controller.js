const balanceResponseService = require("../../../services/dashboard/companies/balanceResponse.services");

exports.balanceResponseCompany = async (req, res) => {
    try {
        const { permissionArray, companyId, email } = req.user;
        console.log("Company Id: ", companyId);

        if (permissionArray.includes('staffAdmin'))
            result = await balanceResponseService.balanceResponseCompany(req, res, companyId, email);
        else
            result = { success: false, message: "Permission access denied" }

        return res.status(result.success ? 200 : 400).send(result);
    }
    catch (error) {
        res.status(500).send({ success: false, message: error });
    }
};