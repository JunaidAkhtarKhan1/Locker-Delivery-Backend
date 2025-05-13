const displayFlagService = require("../../../services/dashboard/companies/displayFlags.services");

exports.displayFlags = async (req, res) => {
    try {
        const { permissionArray, companyId } = req.user;
        console.log("Company Id: ", companyId);

        if (permissionArray.includes('staffAdmin'))
            result = await displayFlagService.displayFlags(req, res, companyId);
        else if (permissionArray.includes('staffFinance'))
            result = await displayFlagService.displayFlags(req, res, companyId);
        else
            result = { success: false, message: "Permission access denied" }

        return res.status(result.success ? 200 : 400).send(result);
    }
    catch (error) {
        res.status(500).send({ success: false, message: error });
    }
};