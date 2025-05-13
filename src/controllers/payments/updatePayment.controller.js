const updatePaymentService = require("../../services/payments/updatePayment.services");

exports.updatePayment = async (req, res) => {
    try {
        const result = await updatePaymentService.updatePayment(req, res);
        return res.status(result.success ? 200 : 400).send(result);
    }
    catch (error) {
        res.status(500).send({ success: false, message: error });
    }
};
