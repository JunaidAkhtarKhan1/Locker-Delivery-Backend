const {
  searchRecentOrder,
  orderStatusComplete,
  userBalanceComplete,
} = require("../../utils/dbLive");

const transactionCompleteService = {
  transactionComplete: async (paymentId, requestInfo, requestBody) => {
    return new Promise(async (resolve, reject) => {
      try {
        //Get the last order by machineId
        const { orderId, userId, price, transactionStatus } =
          await searchRecentOrder(paymentId);
        //Update the order status to 'complete' by orderId
        await orderStatusComplete(orderId, "complete");
        //User update balance by userId
        // if (transactionStatus === 'approved') await userBalanceComplete(userId, price);
        console.log("Transaction Complete");
        const result = {
          success: true,
          paymentId,
          requestBody,
        };
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  },
};

module.exports = transactionCompleteService;
