const updatePaymentModeService = require("../../../services/machineRegistration/paymentModes/update.services");

exports.updatePaymentMode = async (req, res) => {
    try {
        const { permissionArray, companyId } = req.user;

        let result = {};

        if (permissionArray.includes('admin')) {
            result = await updatePaymentModeService.updatePaymentMode(req, res);
        }
        // if (permissionArray.includes('admin')) {
        //     const companyId = req.query.companyId;
        //     result = await updatePaymentModeService.updatePaymentMode(req, res, companyId);
        // }
        else
            result = { success: false, message: "Permission access denied" }

        return res.status(result.success ? 200 : 400).send(result);
    }
    catch (error) {
        res.status(500).send({ success: false, message: error });
    }
};