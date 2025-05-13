const {
    orderStatusUpdate
} = require("../../utils/dbLive");

const transactionConfirmationService = {
    paymobTransactionConfirmation: async (req, res) => {
        return new Promise(async (resolve, reject) => {
            console.log(req?.query);
            console.log(req?.body);

            const {
                id,
                success,
                amount_cents
            } = req?.body?.obj

            const {
                merchant_order_id
            } = req?.body?.obj?.order

            console.log("Success: " + success);
            console.log("Transaction ID: " + id);
            console.log("Amount: " + amount_cents / 100);
            console.log("Order Id: " + merchant_order_id);

            if (success === true) await orderStatusUpdate(parseInt(merchant_order_id), 'approved', id);
            else if (success === false) await orderStatusUpdate(parseInt(merchant_order_id), 'rejected', id);

            resolve({ success: true, reqBody: req?.body });

        });
    },
};

module.exports = transactionConfirmationService;