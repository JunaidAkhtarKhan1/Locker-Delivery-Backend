
const transactionConfirmationService = {
    easypaisaTransactionConfirmation: async (req, res) => {
        return new Promise(function (resolve, reject) {
            console.log(req.query);
            console.log(req.body);
            console.log(res.body);
            resolve(req.body);
        });
    },
};

module.exports = transactionConfirmationService;
