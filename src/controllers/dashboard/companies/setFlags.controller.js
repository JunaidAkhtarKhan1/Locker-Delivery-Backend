const setFlagService = require("../../../services/dashboard/companies/setFlags.services");

exports.setFlags = async (req, res) => {
    try {
        const { permissionArray, companyId } = req.user;
        console.log("Company Id: ", companyId);

        if (permissionArray.includes('staffAdmin'))
            result = await setFlagService.setFlags(req, res, companyId);
        else if (permissionArray.includes('staffFinance'))
            result = await setFlagService.setFlags(req, res, companyId);
        else
            result = { success: false, message: "Permission access denied" }

        return res.status(result.success ? 200 : 400).send(result);
    }
    catch (error) {
        res.status(500).send({ success: false, message: error });
    }
};