const createPaymentModeService = require("../../../services/machineRegistration/paymentModes/create.services");

exports.createPaymentMode = async (req, res) => {
    try {
        const { permissionArray, companyId } = req.user;
        // console.log(companyId);

        let result = {};

        if (permissionArray.includes('admin')) {
            result = await createPaymentModeService.createPaymentMode(req, res);
        }
        // if (permissionArray.includes('admin')) {
        //     const companyId = req.query.companyId;
        //     result = await createPaymentModeService.createPaymentMode(req, res, companyId);
        // }
        else
            result = { success: false, message: "Permission access denied" }

        return res.status(result.success ? 200 : 400).send(result);
    }
    catch (error) {
        res.status(500).send({ success: false, message: error });
    }
};