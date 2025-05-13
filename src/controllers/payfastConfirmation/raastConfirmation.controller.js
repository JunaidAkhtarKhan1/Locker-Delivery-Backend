const raastTransactionService = require("../../services/payfastConfirmation/raastConfirmation.services");

exports.raastPaymentConfirmation = async (req, res) => {
  try {
    const result = await raastTransactionService.raastPaymentConfirmation(
      req,
      res
    );
    return res.status(result.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
