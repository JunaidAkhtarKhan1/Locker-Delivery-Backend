const { dbQuery } = require("../../../utils/dbFunctions");

const postMerchantService = {
  postMerchants: async (req, res) => {
    let query;
    const {
      merchantName,
      easypaisaMerchantCredentials,
      epmaStoreId,
      epqrStoreId,
      epqrTransactionPointNo,
      epAccountNo,
      pfMerchantId,
      pfSecuredKey,
      bankId,
      pfStoreId,
    } = req.body;
    if (merchantName === undefined)
      return {
        success: false,
        message: "please provide merchantName",
      };

    query = `INSERT INTO merchants(
                merchantName,
                easypaisaMerchantCredentials,
                epmaStoreId,
                epqrStoreId,
                epqrTransactionPointNo,
                epAccountNo,
                pfMerchantId,
                pfSecuredKey,
                bankId,
                pfStoreId
            )
            VALUES (
                '${merchantName}',
                '${easypaisaMerchantCredentials}',
                '${epmaStoreId}',
                '${epqrStoreId}',
                '${epqrTransactionPointNo}',
                '${epAccountNo}',
                '${pfMerchantId}',
                '${pfSecuredKey}',
                '${bankId}',
                '${pfStoreId}'

            )`;

    const result = await dbQuery(query);

    return {
      success: true,
      message: "New Merchant added",
      result,
    };
  },
};

module.exports = postMerchantService;
