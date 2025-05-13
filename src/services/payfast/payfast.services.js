const { dbQuery } = require("../../utils/dbLive");
const axios = require("axios");

async function getAccessToken(merchant_id, secured_key) {
  const tokenApiUrl = process.env.PAYFASTTOKENLINK;
  const urlPostParams = new URLSearchParams({
    MERCHANT_ID: merchant_id,
    SECURED_KEY: secured_key,
  });

  try {
    const response = await axios.post(tokenApiUrl, urlPostParams);
    return response.data.ACCESS_TOKEN || "";
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw error;
  }
}

const getPayfastService = {
  getPayfast: async (req, res) => {
    try {
      const orderHash = req.body.orderHash;

      if (orderHash) {
        const query = `SELECT orderId, mobileNumber, price, productId, pfMerchantId, pfSecuredKey, pfStoreId
            FROM payfasturl
            JOIN orders using (orderId)
            JOIN paymentmodes USING (paymentId)
            JOIN merchants USING (merchantId)
            WHERE orderHash = '${orderHash}'`;

        const result = await dbQuery(query);
        console.log(result);
        if (result.length === 0) return { success: false };

        const {
          orderId,
          mobileNumber,
          price,
          productId,
          pfMerchantId,
          pfSecuredKey,
          pfStoreId,
        } = result[0];
        const token = await getAccessToken(
          parseInt(pfMerchantId),
          pfSecuredKey
        );
        return {
          success: true,
          orderId,
          mobileNumber,
          price,
          productId,
          token,
          merchantId: pfMerchantId,
          storeId: pfStoreId,
        };
      }
    } catch (error) {
      console.error("Error in showing result data :", error);
      throw error;
    }
  },
};

module.exports = getPayfastService;
