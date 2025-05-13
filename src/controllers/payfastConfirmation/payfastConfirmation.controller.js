const payfastTransactionService = require("../../services/payfastConfirmation/payfastConfirmation.services");

exports.payfastPaymentConfirmation = async (req, res) => {
  try {
    const result = await payfastTransactionService.payfastPaymentConfirmation(
      req,
      res
    );
    return res.status(result.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
