const deletePaymentService = require("../../services/payments/deletePayment.services");
// const { validateDeviceId } = require("../model/postDeviceInfo.model");

exports.deletePayment = async (req, res) => {
    try {
        const result = await deletePaymentService.deletePayment(req, res);
        return res.status(result.success ? 200 : 400).send(result);
    }
    catch (error) {
        res.status(500).send({ success: false, message: error });
    }
};
