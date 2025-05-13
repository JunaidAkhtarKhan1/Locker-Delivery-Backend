const transactionCompleteService = require("../../services/transactions/transactionComplete.services");

exports.transactionComplete = async (req, res) => {
    try {
        const paymentId = req.query.paymentId;
        const requestBody = req.body;
        let result = await transactionCompleteService.transactionComplete(paymentId, requestBody);

        return res.status(result.success ? 200 : 400).send(result);
    }
    catch (error) {
        res.status(500).send({ success: false, message: error });
    }
};