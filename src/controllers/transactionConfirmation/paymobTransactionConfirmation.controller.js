const transactionConfirmationService = require("../../services/transactionConfirmation/paymobTransactionConfirmation.services");

exports.paymobTransactionConfirmation = async (req, res) => {
    try {
        const result = await transactionConfirmationService.paymobTransactionConfirmation(req, res);
        return res.status(result.success ? 200 : 400).send(result);
    }
    catch (error) {
        res.status(500).send({ success: false, message: error });
    }
};