const getPaymentService = require("../../services/payments/getPayment.services");

exports.getPayment = async (req, res) => {
    try {
        const result = await getPaymentService.getPayment(req, res);
        return res.status(result.success ? 200 : 400).send(result);
    }
    catch (error) {
        res.status(500).send({ success: false, message: error });
    }
};
