const {
  dbQuery,
  searchRecentOrder,
  rfidBalanceUpdate,
  searchRfidUser,
} = require("../../utils/dbLive");

const payfastInquireService = {
  payfastInquire: async (paymentId, requestInfo, requestBody) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { rfidInquiry, rfidData } = requestBody;
        let orderId = requestBody.orderId;

        console.log("Incoming Order Id: " + orderId);

        let companyUserId = 0;

        if (rfidInquiry) {
          const rfid = await searchRfidUser(rfidData);
          companyUserId = rfid.companyUserId;
        }

        if (orderId === "") {
          const recentOrder = await searchRecentOrder(paymentId);
          orderId = recentOrder.orderId.toString();
        } else if (orderId === undefined) {
          const recentOrder = await searchRecentOrder(paymentId);
          orderId = recentOrder.orderId.toString();
        }
        console.log("Payment Id: " + paymentId);

        //DB status check to approved or rejected
        const query = `SELECT *
                      FROM orders
                      WHERE orderId = ${orderId}`;

        const orderTable = await dbQuery(query);
        console.log(orderTable[0]);

        let result = {
          success: true,
        };
        if (orderTable[0].transactionStatus === "approved") {
          result.transactionStatus = true;
          if (rfidInquiry === true)
            await rfidBalanceUpdate(orderTable[0].price, companyUserId); // Add balance on company users
        } else if (orderTable[0].transactionStatus === "rejected") {
          result.transactionStatus = false;
        }

        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  },
};

module.exports = payfastInquireService;
