const {
  dbQuery,
  apiLog,
  searchRecentOrder,
  orderStatusUpdateInquire,
  createUser,
  userSearch,
  userBalanceUpdateInquire,
  apiLogSearch,
  apiLogUpdate,
  searchOrder,
  rfidBalanceUpdate,
  searchRfidUser,
} = require("../../utils/dbLive");

const inquireService = {
  easypaisaInquireTransaction: async (paymentId, requestInfo, requestBody) => {
    return new Promise(async (resolve, reject) => {
      try {
        const requestLib = require("request");

        const {
          companyName,
          machineName,
          bankName,
          paymentName,
          paymentDefaultName,
          easypaisaMerchantCredentials,
          epmaStoreId,
          epqrStoreId,
          epqrTransactionPointNo,
          epAccountNo,
        } = requestInfo;
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

        const options = {
          method: "POST",
          url: "https://easypay.easypaisa.com.pk/easypay-service/rest/v4/inquire-transaction",
          headers: {
            Credentials: easypaisaMerchantCredentials,
          },
          body: {
            orderId,
            storeId: epmaStoreId,
            accountNum: epAccountNo,
          },
          json: true,
          rfidInquiry,
          companyUserId,
        };

        console.log("EP Inquire API Request: ");
        console.log(options.body);
        console.log("Check OrderId: ", orderId);

        const logger = await apiLogSearch(
          "apiInquireRequest",
          JSON.stringify(options.body),
          orderId
        ); // Search Log Request
        if (logger === undefined)
          await apiLog(
            "apiInquireRequest",
            JSON.stringify(options.body),
            orderId
          );
        // Log Request
        else await apiLogUpdate(logger.logId, JSON.stringify(options.body)); // Update log Request

        // Retry the entire request execution block
        const retries = 3;
        for (let i = 0; i < retries; i++) {
          try {
            const result = await new Promise((resolve, reject) => {
              requestLib(options, async (error, response, apiResponse) => {
                try {
                  if (error) {
                    reject(error);
                    return;
                  }

                  apiResponse.orderId = options.body.orderId;
                  const { rfidInquiry } = options;
                  console.log("EP Inquire API Response: ", apiResponse);

                  const logger = await apiLogSearch(
                    "apiInquireResponse",
                    apiResponse?.responseDesc,
                    apiResponse.orderId
                  ); // Search Log Response

                  if (logger === undefined) {
                    await apiLog(
                      "apiInquireResponse",
                      apiResponse?.responseDesc,
                      apiResponse.orderId
                    );
                  } else {
                    await apiLogUpdate(logger.logId, apiResponse?.responseDesc); // Update log Response
                  }

                  if (
                    apiResponse?.responseCode === "0000" &&
                    apiResponse?.transactionStatus === "PAID"
                  ) {
                    const transactionId = "";
                    let userId;
                    const users = await userSearch(apiResponse?.msisdn);
                    if (users === undefined)
                      userId = await createUser(apiResponse?.msisdn);
                    else userId = users.userId;
                    console.log("User Id: " + userId);

                    const { transactionStatus } = await searchOrder(
                      apiResponse.orderId
                    );
                    console.log("Old Transaction Status: " + transactionStatus);
                    if (
                      transactionStatus != "approved" &&
                      transactionStatus != "complete" &&
                      rfidInquiry === false
                    )
                      await userBalanceUpdateInquire(apiResponse);
                    // User Status Update
                    else if (
                      transactionStatus != "approved" &&
                      transactionStatus != "complete" &&
                      rfidInquiry === true
                    )
                      await rfidBalanceUpdate(
                        apiResponse.transactionAmount,
                        companyUserId
                      ); // Add balance on company users

                    await orderStatusUpdateInquire(
                      apiResponse.orderId,
                      "approved",
                      transactionId,
                      userId
                    ); // DB Order Status Update
                    console.log("EP Transaction Accepted");
                    apiResponse.success = true;
                    resolve(apiResponse);
                  } else {
                    console.log("EP Transaction Rejected");
                    apiResponse.success = true;
                    resolve(apiResponse);
                  }
                } catch (innerError) {
                  reject(innerError);
                }
              });
            });

            console.log("Final result: ", result);
            resolve(result);

            break; // Exit loop if successful
          } catch (outerError) {
            console.error(`Attempt ${i + 1} failed with error:`, outerError);
            if (i === retries - 1) throw outerError; // Throw after last retry
          }
        }
      } catch (error) {
        reject(error);
      }
    });
  },
  paymobInquireTransaction: async (paymentId, requestInfo, requestBody) => {
    return new Promise(async (resolve, reject) => {
      try {
        const {
          companyName,
          machineName,
          bankName,
          paymentName,
          paymentDefaultName,
        } = requestInfo;
        let orderId = requestBody.orderId;

        console.log("Incoming Order Id: " + orderId);
        if (orderId === "") {
          const recentOrder = await searchRecentOrder(paymentId);
          orderId = recentOrder.orderId.toString();
        } else if (orderId === undefined) {
          const recentOrder = await searchRecentOrder(paymentId);
          orderId = recentOrder.orderId.toString();
        }
        console.log("Order Id: " + orderId);
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
        } else if (orderTable[0].transactionStatus === "rejected") {
          result.transactionStatus = false;
        }

        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  },
  payfastInquireTransaction: async (paymentId, requestInfo, requestBody) => {
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
    // return new Promise(async (resolve, reject) => {
    //   try {
    //     const {
    //       companyName,
    //       machineName,
    //       bankName,
    //       paymentName,
    //       paymentDefaultName,
    //     } = requestInfo;
    //     let orderId = requestBody.orderId;

    //     console.log("Incoming Order Id: " + orderId);
    //     if (orderId === "") {
    //       const recentOrder = await searchRecentOrder(paymentId);
    //       orderId = recentOrder.orderId.toString();
    //     } else if (orderId === undefined) {
    //       const recentOrder = await searchRecentOrder(paymentId);
    //       orderId = recentOrder.orderId.toString();
    //     }
    //     console.log("Order Id: " + orderId);
    //     console.log("Payment Id: " + paymentId);

    //     //DB status check to approved or rejected
    //     const query = `SELECT *
    //                 FROM orders
    //                 WHERE orderId = ${orderId}`;

    //     const orderTable = await dbQuery(query);
    //     console.log(orderTable[0]);

    //     let result = {
    //       success: true,
    //     };
    //     if (orderTable[0].transactionStatus === "approved") {
    //       result.transactionStatus = true;
    //     } else if (orderTable[0].transactionStatus === "rejected") {
    //       result.transactionStatus = false;
    //     }

    //     resolve(result);
    //   } catch (error) {
    //     reject(error);
    //   }
    // });
  },
};

module.exports = inquireService;
