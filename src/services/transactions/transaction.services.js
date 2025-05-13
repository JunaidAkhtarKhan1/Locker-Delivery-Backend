const QRCode = require("qrcode");
const bcrypt = require("bcrypt");
const axios = require("axios");
const { encrypt, decrypt } = require("../../utils/functions");

const {
  createUser,
  userSearch,
  createProduct,
  productSearch,
  generateOrder,
  orderStatusUpdate,
  userBalanceUpdate,
  apiLog,
  generateOrderQR,
  QROrderStatusUpdate,
  searchRfidUser,
  searchRfidUserCompany,
  rfidBalanceDeduct,
  generateOrderRFID,
  dbQuery,
  rfidFlag,
  rfidOrderStatusUpdate,
  rfidBalanceDeductBoth,
  generateDetailOrderRFID,
  generateOrderAndroid,
  updateOrder,
  getOrders,
  updateOrderQR,
  // getPaymentInfo,
} = require("../../utils/dbLive");
const { logger } = require("@azure/storage-blob");
async function getToken(pfMerchantId, pfSecuredKey) {
  try {
    const tokenResponse = await axios.post(
      `${process.env.RAASTLINK}api/token`,
      {
        merchant_id: pfMerchantId,
        secured_key: pfSecuredKey,
      },
      {
        headers: {
          "X-Request-ID": "64eb95dc-8832-4411-8c44-bab257f82187",
          "Content-Type": "application/json",
        },
      }
    );

    // Extract token from response
    const token = tokenResponse.data?.data?.token;
    return token;
  } catch (error) {
    console.error("Error getting token:", error.message);
    throw error;
  }
}

async function getQRCode(token, orderId, price) {
  try {
    const raastWebhook = process.env.RAASTWEBHOOK;
    const qrResponse = await axios.post(
      `${process.env.RAASTLINK}api/qrcode/generate/dynamic`,
      {
        merchant_reference_id: orderId.toString(),
        expiry: 1,
        customer_prompt: "ALL",
        transaction_amount: price,
        notification_webhook: raastWebhook,
      },
      {
        headers: {
          "X-Request-ID": "4f857f1d-0f75-4d7e-9e73-bc1dd3c7e587",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return qrResponse.data;
  } catch (error) {
    console.error("Error getting QR code:", error.message);
    throw error;
  }
}

const transactionService = {
  easypaisaMobileAccountOK: async (paymentId, requestInfo, requestBody) => {
    return new Promise(async (resolve, reject) => {
      const dateNow = new Date(Date.now() + 18000000)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

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
      const { price, mobileNumber, productId } = requestBody;

      // Get UserId by searching existing user or creating a new one
      let userId;
      const users = await userSearch(mobileNumber);
      if (users === undefined) userId = await createUser(mobileNumber);
      else userId = users.userId;
      console.log("User Id: " + userId);

      // Get ProductId by searching existing product or creating a new one
      const products = await productSearch(productId);
      if (products === undefined) await createProduct(productId);
      console.log("Product Id: " + productId);

      // Generate a new order
      const orderId = await generateOrder(
        price,
        "pending",
        dateNow,
        productId,
        paymentId,
        userId
      );
      console.log("Order Id: " + orderId);

      // Create options for Easypaisa Mobile Account API
      const url =
        "https://easypay.easypaisa.com.pk/easypay-service/rest/v4/initiate-ma-transaction";
      const headers = {
        Credentials: easypaisaMerchantCredentials,
      };
      const body = {
        orderId: orderId.toString(),
        storeId: epmaStoreId,
        transactionAmount: price,
        transactionType: paymentDefaultName,
        mobileAccountNo: mobileNumber,
        emailAddress: process.env.NOTIFICATIONEMAIL,
      };
      console.log("EP API Request: ", body);

      // Log Request
      await apiLog("apiRequest", JSON.stringify(body), orderId);

      try {
        const response = await axios.post(url, body, { headers });
        const apiResponse = response?.data;
        const { transactionId } = apiResponse;

        console.log("EP API Response: ", apiResponse);

        await apiLog("apiResponse", JSON.stringify(apiResponse), orderId); // Log Response

        if (apiResponse?.responseCode === "0000") {
          console.log("EP Transaction Accepted");
          await orderStatusUpdate(orderId, "approved", transactionId); // DB Status Update
          await userBalanceUpdate(body); // User Status Update
          apiResponse.success = true;
          resolve(apiResponse);
        } else {
          console.log("EP Transaction Rejected");
          await orderStatusUpdate(orderId, "rejected", transactionId); // DB Status Update
          apiResponse.success = false;
          resolve(apiResponse);
        }
      } catch (error) {
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );
        await apiLog(
          "apiResponse",
          JSON.stringify(error.response?.data || error.message),
          orderId
        );
        reject(new Error(error));
      }
    });
  },
  easypaisaMobileAccount: async (paymentId, requestInfo, requestBody) => {
    return new Promise(async (resolve, reject) => {
      // const dateNow = new Date(Date.now() + 18000000)
      //   .toISOString()
      //   .slice(0, 19)
      //   .replace("T", " ");

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
      const { mobileNumber, productId, orderId } = requestBody;

      // Get UserId by searching existing user or creating a new one
      // let userId;
      // const users = await userSearch(mobileNumber);
      // if (users === undefined) userId = await createUser(mobileNumber);
      // else userId = users.userId;
      // console.log("User Id: " + userId);

      // // Get ProductId by searching existing product or creating a new one
      // const products = await productSearch(productId);
      // if (products === undefined) await createProduct(productId);
      // console.log("Product Id: " + productId);

      // Generate a new order
      const price = await getOrders(orderId);
      console.log(price);

      const updateResult = await updateOrder(orderId, "in progress", paymentId);
      console.log("Order Id: " + orderId);

      // Create options for Easypaisa Mobile Account API
      const url =
        "https://easypay.easypaisa.com.pk/easypay-service/rest/v4/initiate-ma-transaction";
      const headers = {
        Credentials: easypaisaMerchantCredentials,
      };
      const body = {
        orderId: orderId.toString(),
        storeId: epmaStoreId,
        transactionAmount: price,
        transactionType: paymentDefaultName,
        mobileAccountNo: mobileNumber,
        emailAddress: process.env.NOTIFICATIONEMAIL,
      };
      console.log("EP API Request: ", body);

      // Log Request
      await apiLog("apiRequest", JSON.stringify(body), orderId);

      try {
        const response = await axios.post(url, body, { headers });
        const apiResponse = response?.data;
        const { transactionId } = apiResponse;

        console.log("EP API Response: ", apiResponse);

        await apiLog("apiResponse", JSON.stringify(apiResponse), orderId); // Log Response

        if (apiResponse?.responseCode === "0000") {
          console.log("EP Transaction Accepted");
          await orderStatusUpdate(orderId, "approved", transactionId); // DB Status Update
          await userBalanceUpdate(body); // User Status Update
          apiResponse.success = true;
          resolve(apiResponse);
        } else {
          console.log("EP Transaction Rejected");
          await orderStatusUpdate(orderId, "rejected", transactionId); // DB Status Update
          apiResponse.success = false;
          resolve(apiResponse);
        }
      } catch (error) {
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );
        await apiLog(
          "apiResponse",
          JSON.stringify(error.response?.data || error.message),
          orderId
        );
        reject(new Error(error));
      }
    });
  },
  easypaisaQRCodeok: async (paymentId, requestInfo, requestBody) => {
    return new Promise(async (resolve, reject) => {
      const dateNow = new Date(Date.now() + 18000000)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

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

      const { price, productId } = requestBody;

      // Get ProductId by searching existing product or creating a new one
      const products = await productSearch(productId);
      if (products === undefined) await createProduct(productId);
      console.log("Product Id: " + productId);

      // Generate a new order
      const orderId = await generateOrderQR(
        price,
        "pending",
        dateNow,
        productId,
        paymentId
      );
      console.log("Order Id: " + orderId);

      const orderRefNum = orderId.toString();
      const amount = price.toString();
      console.log(orderRefNum);

      const request = {
        storeId: epqrStoreId,
        paymentMethod: paymentDefaultName,
        orderRefNum,
        amount,
        transactionPointNum: epqrTransactionPointNo,
        productNumber: "",
        qrFormatIndicator: "01",
      };

      const signature = await encrypt(JSON.stringify(request));

      const body = {
        request,
        signature,
      };

      const url =
        "https://easypay.easypaisa.com.pk/easypay-service/rest/QRBusinessRestService/v1/generate-qr";
      const headers = {
        Credentials: easypaisaMerchantCredentials,
      };

      console.log("EP QR API Request: ", body);

      // Log Request
      await apiLog("apiRequest", JSON.stringify(body.request), orderId);

      try {
        const response = await axios.post(url, body, { headers });
        const apiResponse = response?.data;

        console.log("EP QR API Response: ", apiResponse);

        await apiLog(
          "apiResponse",
          JSON.stringify(apiResponse.response?.responseDesc),
          orderRefNum
        ); // Log Response

        if (apiResponse?.response?.responseCode === "0000") {
          console.log("EP QR Transaction Accepted");
          await QROrderStatusUpdate(orderRefNum, "generated"); // DB Status Update
          apiResponse.orderId = orderRefNum;
          apiResponse.success = true;
          resolve(apiResponse);
        } else {
          console.log("EP QR Transaction Rejected");
          await QROrderStatusUpdate(orderRefNum, "failed"); // DB Status Update
          apiResponse.orderId = orderRefNum;
          apiResponse.success = false;
          resolve(apiResponse);
        }
      } catch (error) {
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );
        await apiLog(
          "apiResponse",
          JSON.stringify(error.response?.data || error.message),
          orderRefNum
        );
        reject(new Error(error));
      }
    });
  },
  easypaisaQRCode: async (paymentId, requestInfo, requestBody) => {
    return new Promise(async (resolve, reject) => {
      // const dateNow = new Date(Date.now() + 18000000)
      //   .toISOString()
      //   .slice(0, 19)
      //   .replace("T", " ");

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

      const { orderId } = requestBody;

      // Get ProductId by searching existing product or creating a new one
      // const products = await productSearch(productId);
      // if (products === undefined) await createProduct(productId);
      // console.log("Product Id: " + productId);

      // Generate a new order
      const price = await getOrders(orderId);
      console.log(price);

      const UpdateOrderId = await updateOrderQR(
        orderId,
        "in progress",
        paymentId
      );
      console.log("Order Id: " + orderId);

      const orderRefNum = orderId.toString();
      const amount = price.toString();
      console.log(orderRefNum);

      const request = {
        storeId: epqrStoreId,
        paymentMethod: paymentDefaultName,
        orderRefNum,
        amount,
        transactionPointNum: epqrTransactionPointNo,
        productNumber: "",
        qrFormatIndicator: "01",
      };

      const signature = await encrypt(JSON.stringify(request));

      const body = {
        request,
        signature,
      };

      const url =
        "https://easypay.easypaisa.com.pk/easypay-service/rest/QRBusinessRestService/v1/generate-qr";
      const headers = {
        Credentials: easypaisaMerchantCredentials,
      };

      console.log("EP QR API Request: ", body);

      // Log Request
      await apiLog("apiRequest", JSON.stringify(body.request), orderId);

      try {
        const response = await axios.post(url, body, { headers });
        const apiResponse = response?.data;

        console.log("EP QR API Response: ", apiResponse);

        await apiLog(
          "apiResponse",
          JSON.stringify(apiResponse.response?.responseDesc),
          orderRefNum
        ); // Log Response

        if (apiResponse?.response?.responseCode === "0000") {
          console.log("EP QR Transaction Accepted");
          await QROrderStatusUpdate(orderRefNum, "generated"); // DB Status Update
          apiResponse.orderId = orderRefNum;
          apiResponse.success = true;
          resolve(apiResponse);
        } else {
          console.log("EP QR Transaction Rejected");
          await QROrderStatusUpdate(orderRefNum, "failed"); // DB Status Update
          apiResponse.orderId = orderRefNum;
          apiResponse.success = false;
          resolve(apiResponse);
        }
      } catch (error) {
        console.error(
          "Error:",
          error.response ? error.response.data : error.message
        );
        await apiLog(
          "apiResponse",
          JSON.stringify(error.response?.data || error.message),
          orderRefNum
        );
        reject(new Error(error));
      }
    });
  },
  raastQR: async (paymentId, requestInfo, requestBody) => {
    return new Promise(async (resolve, reject) => {
      // const dateNow = new Date(Date.now() + 18000000)
      //   .toISOString()
      //   .slice(0, 19)
      //   .replace("T", " ");

      const { pfMerchantId, pfSecuredKey } = requestInfo;

      const { orderId } = requestBody;

      // Get ProductId by searching existing product or creating a new one
      // const products = await productSearch(productId);
      // if (products === undefined) await createProduct(productId);
      // console.log("Product Id: " + productId);

      // Generate a new order
      const price = await getOrders(orderId);
      console.log(price);

      const UpdateOrderId = await updateOrderQR(
        orderId,
        "in progress",
        paymentId
      );
      console.log("Order Id: " + orderId);

      try {
        const token = await getToken(pfMerchantId, pfSecuredKey);
        const apiResponse = await getQRCode(token, orderId, price);

        await apiLog(
          "apiResponse",
          JSON.stringify(apiResponse?.message),
          orderId
        ); // Log Response

        if (apiResponse?.code === "00") {
          console.log("RAAST QR Transaction Accepted");
          await QROrderStatusUpdate(orderId, "generated"); // DB Status Update
          apiResponse.success = true;
          apiResponse.orderId = orderId;
          resolve(apiResponse);
        } else {
          console.log("RAAST QR Transaction Rejected");
          await QROrderStatusUpdate(orderId, "failed"); // DB Status Update
          apiResponse.success = false;
          apiResponse.orderId = orderId;
          resolve(apiResponse);
        }
      } catch (error) {
        console.error(
          "Error:",
          error.qrResponse ? error.qrResponse.data : error.message
        );
        await apiLog(
          "apiResponse",
          JSON.stringify(error.qrResponse?.data || error.message),
          orderId
        );
        reject(new Error(error));
      }
    });
  },
  ixRfidOk: async (paymentId, requestInfo, requestBody, requestUser) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { basicValidation, rfidData, price, productId } = requestBody;
        const { companyId } = requestUser;
        console.log("Company Id: " + companyId);

        if (basicValidation === true) {
          //Check if data exists in database
          const rfidUser = await searchRfidUserCompany(rfidData, companyId);
          console.log("RIFD User: ");
          console.log(rfidUser);

          const { companyRfid, balanceFlag } = await rfidFlag(companyId);
          console.log(companyRfid);
          console.log(balanceFlag);

          if (rfidUser === undefined) {
            resolve({ success: true, validation: false });
          } else if (rfidUser.companyUserId != 0) {
            const {
              companyUserId,
              employeeId,
              rfid,
              name,
              balance,
              companyBalance,
              isActive,
            } = rfidUser;

            let totalBalance = balance;
            if (companyRfid) totalBalance += companyBalance;

            // if (balanceFlag === 'recharge') console.log('Recharge balance');
            // else if (balanceFlag === 'company') totalBalance += companyBalance;

            if (isActive) {
              resolve({
                success: true,
                validation: true,
                isActive: true,
                companyUserId,
                employeeId,
                rfid,
                name,
                balance: totalBalance,
              });
            } else {
              resolve({
                success: true,
                validation: true,
                isActive: false,
              });
            }
          }
        } else {
          const dateNow = new Date(Date.now() + 18000000)
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");

          console.log("Request Body: ");
          console.log(requestBody);

          //Check if data exists in database & have enough balance
          const rfidUser = await searchRfidUserCompany(rfidData, companyId);
          console.log("RIFD User: ");
          console.log(rfidUser);

          const { companyRfid, balanceFlag } = await rfidFlag(companyId);
          console.log("Company RFID Bit: " + companyRfid);
          console.log("Balance Flag: " + balanceFlag);

          if (rfidUser === undefined) {
            resolve({ success: true, dispense: false });
          } else if (rfidUser.companyUserId != 0) {
            const {
              companyUserId,
              employeeId,
              rfid,
              name,
              balance,
              companyBalance,
            } = rfidUser;
            console.log("Company User ID: " + companyUserId);

            let rBalance = balance;
            let cBalance = companyBalance;

            let transactionType = "debit-recharge";

            //Get ProductId by searching existing product or creating a new one
            const products = await productSearch(productId);
            if (products === undefined) await createProduct(productId);
            console.log("Product Id: " + productId);

            if (companyRfid) {
              const totalBalance = balance + companyBalance;
              const orderId = await generateOrderRFID(
                price,
                "pending",
                dateNow,
                productId,
                paymentId,
                companyUserId,
                transactionType
              );

              if (balanceFlag === "recharge") {
                if (price <= rBalance) {
                  transactionType = "debit-recharge"; //update order status
                  console.log("Order ID: " + orderId);
                  rBalance -= price; //deduct from database - balance coloumn
                } else {
                  const remainingPrice = price - rBalance; //deduct from database - balance = 0
                  rBalance = 0;
                  if (remainingPrice <= cBalance) {
                    cBalance -= remainingPrice; //deduct from database - companyBalance coloumn
                    if (price === remainingPrice)
                      transactionType = "debit-company";
                    else transactionType = "debit-both";
                  } else {
                    transactionType = "debit-both";
                    rBalance = price - remainingPrice;
                    console.log("Insufficient balance in both.");
                    await rfidOrderStatusUpdate(
                      orderId,
                      "rejected",
                      transactionType
                    ); //Update Order Status - Rejected
                    resolve({
                      success: true,
                      dispense: false,
                      transactionStatus: "NOT ENOUGH BALANCE",
                      companyUserId,
                      employeeId,
                      rfid,
                      name,
                      rechargeBalance: rBalance,
                      companyBalance: cBalance,
                      price,
                    });
                    return;
                  }
                }
              } else if (balanceFlag === "company") {
                if (price <= cBalance) {
                  cBalance -= price; //deduct from database - companyBalance coloumn
                  transactionType = "debit-company"; //update order status
                } else {
                  const remainingPrice = price - cBalance; //deduct from database - cBalance = 0
                  cBalance = 0;
                  if (remainingPrice <= rBalance) {
                    rBalance -= remainingPrice; //deduct from database - balance coloumn
                    if (price === remainingPrice)
                      transactionType = "debit-recharge";
                    else transactionType = "debit-both";
                  } else {
                    transactionType = "debit-both";
                    cBalance = price - remainingPrice;
                    console.log("Insufficient balance in both.");
                    await rfidOrderStatusUpdate(
                      orderId,
                      "rejected",
                      transactionType
                    ); //Update Order Status - Rejected
                    resolve({
                      success: true,
                      dispense: false,
                      transactionStatus: "NOT ENOUGH BALANCE",
                      companyUserId,
                      employeeId,
                      rfid,
                      name,
                      rechargeBalance: rBalance,
                      companyBalance: cBalance,
                      price,
                    });
                    return;
                  }
                }
              }

              const deductRechargeBalance = balance - rBalance;
              const deductCompanyBalance = companyBalance - cBalance;

              const balanceUpdate = await rfidBalanceDeductBoth(
                companyUserId,
                deductRechargeBalance,
                deductCompanyBalance
              );
              if (balanceUpdate.changedRows === 1) {
                await generateDetailOrderRFID(
                  orderId,
                  companyId,
                  deductRechargeBalance,
                  deductCompanyBalance
                );
                await rfidOrderStatusUpdate(
                  orderId,
                  "approved",
                  transactionType
                ); //Update Order Status - Approved
                console.log("Order approved");
                resolve({
                  success: true,
                  dispense: true,
                  transactionStatus: "PAID",
                  companyUserId,
                  employeeId,
                  rfid,
                  name,
                  price,
                  rechargeBalance: balance,
                  companyBalance: companyBalance,
                  updatedRechargeBalance: rBalance,
                  updatedCompanyBalance: cBalance,
                  deductRechargeBalance,
                  deductCompanyBalance,
                });
                return;
              }
              // console.log("Recharge Balance: " + balance);
              // console.log("Company Balance: " + companyBalance);
              // console.log("Total Balance: " + totalBalance);
              // console.log("Transaction Type: " + transactionType);
              // console.log("Updated Recharge Balance: " + rBalance);
              // console.log("Updated Company Balance: " + cBalance);
              // console.log("Total Balance: " + (rBalance + cBalance));

              //generate order with proper flag in which balance avaialble - check prioirty
              //deduct balance from avialble source
            } else {
              let transactionType = "debit";
              const orderId = await generateOrderRFID(
                price,
                "pending",
                dateNow,
                productId,
                paymentId,
                companyUserId,
                transactionType
              );
              console.log("Order ID: " + orderId);

              //Verify the balance is greater then price
              if (balance >= price) {
                const balanceUpdate = await rfidBalanceDeduct(
                  companyUserId,
                  price
                );
                if (balanceUpdate.affectedRows === 1) {
                  await rfidOrderStatusUpdate(
                    orderId,
                    "approved",
                    transactionType
                  ); //Update Order Status - Rejected
                  console.log("Order approved");
                  resolve({
                    success: true,
                    dispense: true,
                    transactionStatus: "PAID",
                    companyUserId,
                    employeeId,
                    rfid,
                    name,
                    balance,
                    price,
                    remainingBalance: balance - price,
                  });
                  return;
                }
              } else {
                await rfidOrderStatusUpdate(
                  orderId,
                  "rejected",
                  transactionType
                ); //Update Order Status - Rejected
                console.log("Order rejected");
                resolve({
                  success: true,
                  dispense: false,
                  transactionStatus: "NOT ENOUGH BALANCE",
                  companyUserId,
                  employeeId,
                  rfid,
                  name,
                  balance,
                  price,
                });
                return;
              }
            }
          }
        }
        resolve({ success: true, dispense: false });
      } catch (error) {
        reject(error);
      }
    });
  },
  ixRfid: async (paymentId, requestInfo, requestBody, requestUser) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { basicValidation, rfidData, orderId } = requestBody;
        const { companyId } = requestUser;
        console.log("Company Id: " + companyId);
        const price = await getOrders(orderId);
        console.log("Price: " + price);

        if (basicValidation === true) {
          //Check if data exists in database
          const rfidUser = await searchRfidUserCompany(rfidData, companyId);
          console.log("RIFD User: ");
          console.log(rfidUser);

          const { companyRfid, balanceFlag } = await rfidFlag(companyId);
          console.log(companyRfid);
          console.log(balanceFlag);

          if (rfidUser === undefined) {
            resolve({ success: true, validation: false });
          } else if (rfidUser.companyUserId != 0) {
            const {
              companyUserId,
              employeeId,
              rfid,
              name,
              balance,
              companyBalance,
              isActive,
            } = rfidUser;

            let totalBalance = balance;
            if (companyRfid) totalBalance += companyBalance;

            // if (balanceFlag === 'recharge') console.log('Recharge balance');
            // else if (balanceFlag === 'company') totalBalance += companyBalance;

            if (isActive) {
              resolve({
                success: true,
                validation: true,
                isActive: true,
                companyUserId,
                employeeId,
                rfid,
                name,
                balance: totalBalance,
              });
            } else {
              resolve({
                success: true,
                validation: true,
                isActive: false,
              });
            }
          }
        } else {
          const dateNow = new Date(Date.now() + 18000000)
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");

          console.log("Request Body: ");
          console.log(requestBody);

          //Check if data exists in database & have enough balance
          const rfidUser = await searchRfidUserCompany(rfidData, companyId);
          console.log("RIFD User: ");
          console.log(rfidUser);

          const { companyRfid, balanceFlag } = await rfidFlag(companyId);
          console.log("Company RFID Bit: " + companyRfid);
          console.log("Balance Flag: " + balanceFlag);

          if (rfidUser === undefined) {
            resolve({ success: true, dispense: false });
          } else if (rfidUser.companyUserId != 0) {
            const {
              companyUserId,
              employeeId,
              rfid,
              name,
              balance,
              companyBalance,
            } = rfidUser;
            console.log("Company User ID: " + companyUserId);

            let rBalance = balance;
            let cBalance = companyBalance;

            let transactionType = "debit-recharge";

            //Get ProductId by searching existing product or creating a new one
            // const products = await productSearch(productId);
            // if (products === undefined) await createProduct(productId);
            // console.log("Product Id: " + productId);

            if (companyRfid) {
              const totalBalance = balance + companyBalance;
              console.log("total balance", totalBalance);

              // const updateOrderId = await rfidOrderStatusUpdate(
              //   orderId,
              //   "in progress",
              //   price,
              //   dateNow,
              //   productId,
              //   paymentId,
              //   companyUserId,
              //   transactionType
              // );
              // console.log(updateOrderId);

              if (balanceFlag === "recharge") {
                if (price <= rBalance) {
                  transactionType = "debit-recharge"; //update order status
                  console.log("Order ID: " + orderId);
                  rBalance -= price; //deduct from database - balance coloumn
                } else {
                  const remainingPrice = price - rBalance; //deduct from database - balance = 0
                  rBalance = 0;
                  if (remainingPrice <= cBalance) {
                    cBalance -= remainingPrice; //deduct from database - companyBalance coloumn
                    if (price === remainingPrice)
                      transactionType = "debit-company";
                    else transactionType = "debit-both";
                  } else {
                    transactionType = "debit-both";
                    rBalance = price - remainingPrice;
                    console.log("Insufficient balance in both.");
                    await rfidOrderStatusUpdate(
                      orderId,
                      "rejected",
                      transactionType
                    ); //Update Order Status - Rejected
                    resolve({
                      success: true,
                      dispense: false,
                      transactionStatus: "NOT ENOUGH BALANCE",
                      companyUserId,
                      employeeId,
                      rfid,
                      name,
                      rechargeBalance: rBalance,
                      companyBalance: cBalance,
                      price,
                    });
                    return;
                  }
                }
              } else if (balanceFlag === "company") {
                if (price <= cBalance) {
                  cBalance -= price; //deduct from database - companyBalance coloumn
                  transactionType = "debit-company"; //update order status
                } else {
                  const remainingPrice = price - cBalance; //deduct from database - cBalance = 0
                  cBalance = 0;
                  if (remainingPrice <= rBalance) {
                    rBalance -= remainingPrice; //deduct from database - balance coloumn
                    if (price === remainingPrice)
                      transactionType = "debit-recharge";
                    else transactionType = "debit-both";
                    console.log("test");
                  } else {
                    console.log("test");
                    transactionType = "debit-both";
                    cBalance = price - remainingPrice;
                    console.log("Insufficient balance in both.");
                    await rfidOrderStatusUpdate(
                      orderId,
                      "rejected",
                      transactionType
                    ); //Update Order Status - Rejected
                    resolve({
                      success: true,
                      dispense: false,
                      transactionStatus: "NOT ENOUGH BALANCE",
                      companyUserId,
                      employeeId,
                      rfid,
                      name,
                      rechargeBalance: rBalance,
                      companyBalance: cBalance,
                      price,
                    });
                    return;
                  }
                }
              }

              const deductRechargeBalance = balance - rBalance;
              const deductCompanyBalance = companyBalance - cBalance;

              const balanceUpdate = await rfidBalanceDeductBoth(
                companyUserId,
                deductRechargeBalance,
                deductCompanyBalance
              );
              console.log("Balance Update: ", balanceUpdate);

              if (balanceUpdate.changedRows === 1) {
                await generateDetailOrderRFID(
                  orderId,
                  companyId,
                  deductRechargeBalance,
                  deductCompanyBalance
                );
                await rfidOrderStatusUpdate(
                  orderId,
                  "approved",
                  transactionType,
                  paymentId
                ); //Update Order Status - Approved
                console.log("Order approved");
                resolve({
                  success: true,
                  dispense: true,
                  transactionStatus: "PAID",
                  companyUserId,
                  employeeId,
                  rfid,
                  name,
                  price,
                  rechargeBalance: balance,
                  companyBalance: companyBalance,
                  updatedRechargeBalance: rBalance,
                  updatedCompanyBalance: cBalance,
                  deductRechargeBalance,
                  deductCompanyBalance,
                });
                return;
              }
              // console.log("Recharge Balance: " + balance);
              // console.log("Company Balance: " + companyBalance);
              // console.log("Total Balance: " + totalBalance);
              // console.log("Transaction Type: " + transactionType);
              // console.log("Updated Recharge Balance: " + rBalance);
              // console.log("Updated Company Balance: " + cBalance);
              // console.log("Total Balance: " + (rBalance + cBalance));

              //generate order with proper flag in which balance avaialble - check prioirty
              //deduct balance from avialble source
            } else {
              let transactionType = "debit";
              const orderId = await generateOrderRFID(
                price,
                "pending",
                dateNow,
                productId,
                paymentId,
                companyUserId,
                transactionType
              );
              console.log("Order ID: " + orderId);

              //Verify the balance is greater then price
              if (balance >= price) {
                const balanceUpdate = await rfidBalanceDeduct(
                  companyUserId,
                  price
                );
                if (balanceUpdate.affectedRows === 1) {
                  await rfidOrderStatusUpdate(
                    orderId,
                    "approved",
                    transactionType,
                    paymentId
                  ); //Update Order Status - Rejected
                  console.log("Order approved");
                  resolve({
                    success: true,
                    dispense: true,
                    transactionStatus: "PAID",
                    companyUserId,
                    employeeId,
                    rfid,
                    name,
                    balance,
                    price,
                    remainingBalance: balance - price,
                  });
                  return;
                }
              } else {
                await rfidOrderStatusUpdate(
                  orderId,
                  "rejected",
                  transactionType,
                  paymentId
                ); //Update Order Status - Rejected
                console.log("Order rejected");
                resolve({
                  success: true,
                  dispense: false,
                  transactionStatus: "NOT ENOUGH BALANCE",
                  companyUserId,
                  employeeId,
                  rfid,
                  name,
                  balance,
                  price,
                });
                return;
              }
            }
          }
        }
        resolve({ success: true, dispense: false });
      } catch (error) {
        reject(error);
      }
    });
  },
  rfidOk: async (paymentId, requestInfo, requestBody, requestUser) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { basicValidation, rfidData, price, productId } = requestBody;
        console.log("Company Id: ", 5);

        if (basicValidation === true) {
          //Check if data exists in database
          const rfidUser = await searchRfidUserCompany(rfidData, 5);
          console.log("RIFD User: ");
          console.log(rfidUser);

          const { companyRfid, balanceFlag } = await rfidFlag(5);
          console.log(companyRfid);
          console.log(balanceFlag);

          if (rfidUser === undefined) {
            const dateNow = new Date(Date.now() + 18000000)
              .toISOString()
              .slice(0, 19)
              .replace("T", " ");

            const query = `INSERT INTO companyusers(
              employeeId,
              rfid,
              name,
              dateCreated,
              companyId,
              isActive,
              isDeleted
          )
          VALUES (
              '',
              '${rfidData}',
              '',
              '${dateNow}',
              5,
              1,
              0
          )`;

            const result = await dbQuery(query);
            console.log(result);

            const rfidUser = await searchRfidUserCompany(rfidData, 5);
            const {
              companyUserId,
              employeeId,
              rfid,
              name,
              balance,
              companyBalance,
              isActive,
            } = rfidUser;

            let totalBalance = balance;
            if (companyRfid) totalBalance += companyBalance;

            // if (balanceFlag === 'recharge') console.log('Recharge balance');
            // else if (balanceFlag === 'company') totalBalance += companyBalance;

            if (isActive) {
              resolve({
                success: true,
                validation: true,
                isActive: true,
                companyUserId,
                employeeId,
                rfid,
                name,
                balance: totalBalance,
              });
            } else {
              resolve({
                success: true,
                validation: true,
                isActive: false,
              });
            }

            //Register User
            //Insert query to companyUser

            resolve({ success: true, validation: false });
          } else if (rfidUser.companyUserId != 0) {
            const {
              companyUserId,
              employeeId,
              rfid,
              name,
              balance,
              companyBalance,
              isActive,
            } = rfidUser;

            let totalBalance = balance;
            if (companyRfid) totalBalance += companyBalance;

            // if (balanceFlag === 'recharge') console.log('Recharge balance');
            // else if (balanceFlag === 'company') totalBalance += companyBalance;

            if (isActive) {
              resolve({
                success: true,
                validation: true,
                isActive: true,
                companyUserId,
                employeeId,
                rfid,
                name,
                balance: totalBalance,
              });
            } else {
              resolve({
                success: true,
                validation: true,
                isActive: false,
              });
            }
          }
        } else {
          const dateNow = new Date(Date.now() + 18000000)
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");

          console.log("Request Body: ");
          console.log(requestBody);

          //Check if data exists in database & have enough balance
          const rfidUser = await searchRfidUserCompany(rfidData, 5);
          console.log("RIFD User: ");
          console.log(rfidUser);

          const { companyRfid, balanceFlag } = await rfidFlag(5);
          console.log("Company RFID Bit: " + companyRfid);
          console.log("Balance Flag: " + balanceFlag);

          if (rfidUser === undefined) {
            resolve({ success: true, dispense: false });
          } else if (rfidUser.companyUserId != 0) {
            const {
              companyUserId,
              employeeId,
              rfid,
              name,
              balance,
              companyBalance,
            } = rfidUser;
            console.log("Company User ID: " + companyUserId);

            let rBalance = balance;
            let cBalance = companyBalance;

            let transactionType = "debit-recharge";

            //Get ProductId by searching existing product or creating a new one
            const products = await productSearch(productId);
            if (products === undefined) await createProduct(productId);
            console.log("Product Id: " + productId);

            if (companyRfid) {
              const totalBalance = balance + companyBalance;
              const orderId = await generateOrderRFID(
                price,
                "pending",
                dateNow,
                productId,
                paymentId,
                companyUserId,
                transactionType
              );

              if (balanceFlag === "recharge") {
                if (price <= rBalance) {
                  transactionType = "debit-recharge"; //update order status
                  console.log("Order ID: " + orderId);
                  rBalance -= price; //deduct from database - balance coloumn
                } else {
                  const remainingPrice = price - rBalance; //deduct from database - balance = 0
                  rBalance = 0;
                  if (remainingPrice <= cBalance) {
                    cBalance -= remainingPrice; //deduct from database - companyBalance coloumn
                    if (price === remainingPrice)
                      transactionType = "debit-company";
                    else transactionType = "debit-both";
                  } else {
                    transactionType = "debit-both";
                    rBalance = price - remainingPrice;
                    console.log("Insufficient balance in both.");
                    await rfidOrderStatusUpdate(
                      orderId,
                      "rejected",
                      transactionType
                    ); //Update Order Status - Rejected
                    resolve({
                      success: true,
                      dispense: false,
                      transactionStatus: "NOT ENOUGH BALANCE",
                      companyUserId,
                      employeeId,
                      rfid,
                      name,
                      rechargeBalance: rBalance,
                      companyBalance: cBalance,
                      price,
                    });
                    return;
                  }
                }
              } else if (balanceFlag === "company") {
                if (price <= cBalance) {
                  cBalance -= price; //deduct from database - companyBalance coloumn
                  transactionType = "debit-company"; //update order status
                } else {
                  const remainingPrice = price - cBalance; //deduct from database - cBalance = 0
                  cBalance = 0;
                  if (remainingPrice <= rBalance) {
                    rBalance -= remainingPrice; //deduct from database - balance coloumn
                    if (price === remainingPrice)
                      transactionType = "debit-recharge";
                    else transactionType = "debit-both";
                  } else {
                    transactionType = "debit-both";
                    cBalance = price - remainingPrice;
                    console.log("Insufficient balance in both.");
                    await rfidOrderStatusUpdate(
                      orderId,
                      "rejected",
                      transactionType
                    ); //Update Order Status - Rejected
                    resolve({
                      success: true,
                      dispense: false,
                      transactionStatus: "NOT ENOUGH BALANCE",
                      companyUserId,
                      employeeId,
                      rfid,
                      name,
                      rechargeBalance: rBalance,
                      companyBalance: cBalance,
                      price,
                    });
                    return;
                  }
                }
              }

              const deductRechargeBalance = balance - rBalance;
              const deductCompanyBalance = companyBalance - cBalance;

              const balanceUpdate = await rfidBalanceDeductBoth(
                companyUserId,
                deductRechargeBalance,
                deductCompanyBalance
              );
              if (balanceUpdate.changedRows === 1) {
                await generateDetailOrderRFID(
                  orderId,
                  5,
                  deductRechargeBalance,
                  deductCompanyBalance
                );
                await rfidOrderStatusUpdate(
                  orderId,
                  "approved",
                  transactionType
                ); //Update Order Status - Approved
                console.log("Order approved");
                resolve({
                  success: true,
                  dispense: true,
                  transactionStatus: "PAID",
                  companyUserId,
                  employeeId,
                  rfid,
                  name,
                  price,
                  rechargeBalance: balance,
                  companyBalance: companyBalance,
                  updatedRechargeBalance: rBalance,
                  updatedCompanyBalance: cBalance,
                  deductRechargeBalance,
                  deductCompanyBalance,
                });
                return;
              }
              // console.log("Recharge Balance: " + balance);
              // console.log("Company Balance: " + companyBalance);
              // console.log("Total Balance: " + totalBalance);
              // console.log("Transaction Type: " + transactionType);
              // console.log("Updated Recharge Balance: " + rBalance);
              // console.log("Updated Company Balance: " + cBalance);
              // console.log("Total Balance: " + (rBalance + cBalance));

              //generate order with proper flag in which balance avaialble - check prioirty
              //deduct balance from avialble source
            } else {
              let transactionType = "debit";
              const orderId = await generateOrderRFID(
                price,
                "pending",
                dateNow,
                productId,
                paymentId,
                companyUserId,
                transactionType
              );
              console.log("Order ID: " + orderId);

              //Verify the balance is greater then price
              if (balance >= price) {
                const balanceUpdate = await rfidBalanceDeduct(
                  companyUserId,
                  price
                );
                if (balanceUpdate.affectedRows === 1) {
                  await rfidOrderStatusUpdate(
                    orderId,
                    "approved",
                    transactionType
                  ); //Update Order Status - Rejected
                  console.log("Order approved");
                  resolve({
                    success: true,
                    dispense: true,
                    transactionStatus: "PAID",
                    companyUserId,
                    employeeId,
                    rfid,
                    name,
                    balance,
                    price,
                    remainingBalance: balance - price,
                  });
                  return;
                }
              } else {
                await rfidOrderStatusUpdate(
                  orderId,
                  "rejected",
                  transactionType
                ); //Update Order Status - Rejected
                console.log("Order rejected");
                resolve({
                  success: true,
                  dispense: false,
                  transactionStatus: "NOT ENOUGH BALANCE",
                  companyUserId,
                  employeeId,
                  rfid,
                  name,
                  balance,
                  price,
                });
                return;
              }
            }
          }
        }
        resolve({ success: true, dispense: false });
      } catch (error) {
        reject(error);
      }
    });
  },

  rfid: async (paymentId, requestInfo, requestBody, requestUser) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { basicValidation, rfidData, orderId } = requestBody;
        console.log("Company Id: ", 16);
        const price = await getOrders(orderId);
        console.log("Price: " + price);

        if (basicValidation === true) {
          //Check if data exists in database
          const rfidUser = await searchRfidUserCompany(rfidData, 16);
          console.log("RIFD User: ");
          console.log(rfidUser);

          const { companyRfid, balanceFlag } = await rfidFlag(16);
          console.log(companyRfid);
          console.log(balanceFlag);

          if (rfidUser === undefined) {
            const dateNow = new Date(Date.now() + 18000000)
              .toISOString()
              .slice(0, 19)
              .replace("T", " ");
            console.log("test", rfidUser);

            const query = `INSERT INTO companyusers(
              employeeId,
              rfid,
              name,
              dateCreated,
              companyId,
              isActive,
              isDeleted
          )
          VALUES (
              '',
              '${rfidData}',
              '',
              '${dateNow}',
              16,
              1,
              0
          )`;

            const result = await dbQuery(query);
            console.log(result);

            const rfidUser = await searchRfidUserCompany(rfidData, 16);
            const {
              companyUserId,
              employeeId,
              rfid,
              name,
              balance,
              companyBalance,
              isActive,
            } = rfidUser;
            console.log("testt", rfidUser);

            let totalBalance = balance;
            if (companyRfid) totalBalance += companyBalance;

            // if (balanceFlag === 'recharge') console.log('Recharge balance');
            // else if (balanceFlag === 'company') totalBalance += companyBalance;

            if (isActive) {
              resolve({
                success: true,
                validation: true,
                isActive: true,
                companyUserId,
                employeeId,
                rfid,
                name,
                balance: totalBalance,
              });
            } else {
              resolve({
                success: true,
                validation: true,
                isActive: false,
              });
            }

            //Register User
            //Insert query to companyUser

            resolve({ success: true, validation: false });
          } else if (rfidUser.companyUserId != 0) {
            const {
              companyUserId,
              employeeId,
              rfid,
              name,
              balance,
              companyBalance,
              isActive,
            } = rfidUser;

            let totalBalance = balance;
            if (companyRfid) totalBalance += companyBalance;

            // if (balanceFlag === 'recharge') console.log('Recharge balance');
            // else if (balanceFlag === 'company') totalBalance += companyBalance;

            if (isActive) {
              resolve({
                success: true,
                validation: true,
                isActive: true,
                companyUserId,
                employeeId,
                rfid,
                name,
                balance: totalBalance,
              });
            } else {
              resolve({
                success: true,
                validation: true,
                isActive: false,
              });
            }
          }
        } else {
          const dateNow = new Date(Date.now() + 18000000)
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");

          console.log("Request Body: ");
          console.log(requestBody);

          //Check if data exists in database & have enough balance
          const rfidUser = await searchRfidUserCompany(rfidData, 16);
          console.log("RIFD User: ");
          console.log(rfidUser);

          const { companyRfid, balanceFlag } = await rfidFlag(16);
          console.log("Company RFID Bit: " + companyRfid);
          console.log("Balance Flag: " + balanceFlag);

          if (rfidUser === undefined) {
            resolve({ success: true, dispense: false });
          } else if (rfidUser.companyUserId != 0) {
            const {
              companyUserId,
              employeeId,
              rfid,
              name,
              balance,
              companyBalance,
            } = rfidUser;
            console.log("Company User ID: " + companyUserId);

            let rBalance = balance;
            let cBalance = companyBalance;

            let transactionType = "debit-recharge";

            //Get ProductId by searching existing product or creating a new one
            const products = await productSearch(productId);
            if (products === undefined) await createProduct(productId);
            console.log("Product Id: " + productId);

            if (companyRfid) {
              const totalBalance = balance + companyBalance;
              // const orderId = await generateOrderRFID(
              //   price,
              //   "pending",
              //   dateNow,
              //   productId,
              //   paymentId,
              //   companyUserId,
              //   transactionType
              // );

              if (balanceFlag === "recharge") {
                if (price <= rBalance) {
                  transactionType = "debit-recharge"; //update order status
                  console.log("Order ID: " + orderId);
                  rBalance -= price; //deduct from database - balance coloumn
                } else {
                  const remainingPrice = price - rBalance; //deduct from database - balance = 0
                  rBalance = 0;
                  if (remainingPrice <= cBalance) {
                    cBalance -= remainingPrice; //deduct from database - companyBalance coloumn
                    if (price === remainingPrice)
                      transactionType = "debit-company";
                    else transactionType = "debit-both";
                  } else {
                    transactionType = "debit-both";
                    rBalance = price - remainingPrice;
                    console.log("Insufficient balance in both.");
                    await rfidOrderStatusUpdate(
                      orderId,
                      "rejected",
                      transactionType,
                      paymentId
                    ); //Update Order Status - Rejected
                    resolve({
                      success: true,
                      dispense: false,
                      transactionStatus: "NOT ENOUGH BALANCE",
                      companyUserId,
                      employeeId,
                      rfid,
                      name,
                      rechargeBalance: rBalance,
                      companyBalance: cBalance,
                      price,
                    });
                    return;
                  }
                }
              } else if (balanceFlag === "company") {
                if (price <= cBalance) {
                  cBalance -= price; //deduct from database - companyBalance coloumn
                  transactionType = "debit-company"; //update order status
                } else {
                  const remainingPrice = price - cBalance; //deduct from database - cBalance = 0
                  cBalance = 0;
                  if (remainingPrice <= rBalance) {
                    rBalance -= remainingPrice; //deduct from database - balance coloumn
                    if (price === remainingPrice)
                      transactionType = "debit-recharge";
                    else transactionType = "debit-both";
                  } else {
                    transactionType = "debit-both";
                    cBalance = price - remainingPrice;
                    console.log("Insufficient balance in both.");
                    await rfidOrderStatusUpdate(
                      orderId,
                      "rejected",
                      transactionType,
                      paymentId
                    ); //Update Order Status - Rejected
                    resolve({
                      success: true,
                      dispense: false,
                      transactionStatus: "NOT ENOUGH BALANCE",
                      companyUserId,
                      employeeId,
                      rfid,
                      name,
                      rechargeBalance: rBalance,
                      companyBalance: cBalance,
                      price,
                    });
                    return;
                  }
                }
              }

              const deductRechargeBalance = balance - rBalance;
              const deductCompanyBalance = companyBalance - cBalance;

              const balanceUpdate = await rfidBalanceDeductBoth(
                companyUserId,
                deductRechargeBalance,
                deductCompanyBalance
              );
              console.log("balance Update: ", balanceUpdate);

              if (balanceUpdate.changedRows === 1) {
                await generateDetailOrderRFID(
                  orderId,
                  16,
                  deductRechargeBalance,
                  deductCompanyBalance
                );
                // console.log(orderId);

                await rfidOrderStatusUpdate(
                  orderId,
                  "approved",
                  transactionType,
                  paymentId
                ); //Update Order Status - Approved
                console.log("Order approved");
                resolve({
                  success: true,
                  dispense: true,
                  transactionStatus: "PAID",
                  companyUserId,
                  employeeId,
                  rfid,
                  name,
                  price,
                  rechargeBalance: balance,
                  companyBalance: companyBalance,
                  updatedRechargeBalance: rBalance,
                  updatedCompanyBalance: cBalance,
                  deductRechargeBalance,
                  deductCompanyBalance,
                });
                return;
              }
              // console.log("Recharge Balance: " + balance);
              // console.log("Company Balance: " + companyBalance);
              // console.log("Total Balance: " + totalBalance);
              // console.log("Transaction Type: " + transactionType);
              // console.log("Updated Recharge Balance: " + rBalance);
              // console.log("Updated Company Balance: " + cBalance);
              // console.log("Total Balance: " + (rBalance + cBalance));

              //generate order with proper flag in which balance avaialble - check prioirty
              //deduct balance from avialble source
            } else {
              let transactionType = "debit";
              const orderId = await generateOrderRFID(
                price,
                "pending",
                dateNow,
                productId,
                paymentId,
                companyUserId,
                transactionType
              );
              console.log("Order ID: " + orderId);

              //Verify the balance is greater then price
              if (balance >= price) {
                const balanceUpdate = await rfidBalanceDeduct(
                  companyUserId,
                  price
                );
                if (balanceUpdate.affectedRows === 1) {
                  await rfidOrderStatusUpdate(
                    orderId,
                    "approved",
                    transactionType,
                    paymentId
                  ); //Update Order Status - Rejected
                  console.log("Order approved");
                  resolve({
                    success: true,
                    dispense: true,
                    transactionStatus: "PAID",
                    companyUserId,
                    employeeId,
                    rfid,
                    name,
                    balance,
                    price,
                    remainingBalance: balance - price,
                  });
                  return;
                }
              } else {
                await rfidOrderStatusUpdate(
                  orderId,
                  "rejected",
                  transactionType,
                  paymentId
                ); //Update Order Status - Rejected
                console.log("Order rejected");
                resolve({
                  success: true,
                  dispense: false,
                  transactionStatus: "NOT ENOUGH BALANCE",
                  companyUserId,
                  employeeId,
                  rfid,
                  name,
                  balance,
                  price,
                });
                return;
              }
            }
          }
        }
        resolve({ success: true, dispense: false });
      } catch (error) {
        reject(error);
        console.log(error);
      }
    });
  },
  payfast: async (paymentId, requestInfo, requestBody) => {
    return new Promise(async (resolve, reject) => {
      console.log("payfast");
      // const requestLib = require("request");
      const dateNow = new Date(Date.now() + 18000000)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      const {
        companyName,
        machineName,
        bankName,
        paymentName,
        paymentDefaultName,
      } = requestInfo;

      const { orderId } = requestBody;

      // //Get UserId by searching existing user or creating a new one
      // let userId;
      // const users = await userSearch(mobileNumber);
      // if (users === undefined) userId = await createUser(mobileNumber);
      // else userId = users.userId;
      // console.log("User Id: " + userId);

      // //Get ProductId by searching existing product or creating a new one
      // const products = await productSearch(productId);
      // if (products === undefined) await createProduct(productId);
      // console.log("Product Id: " + productId);

      const price = await getOrders(orderId);
      console.log(price);

      const UpdateOrderId = await updateOrderQR(
        orderId,
        "in progress",
        paymentId
      );

      //Generate a new order
      // const orderId = await generateOrder(
      //   price,
      //   "pending",
      //   dateNow,
      //   productId,
      //   paymentId,
      //   userId
      // );
      console.log("Order Id: " + orderId);

      const salt = await bcrypt.genSalt(5);
      const orderHash = await bcrypt.hash(orderId.toString(), salt);
      const alphanumericHash = orderHash.replace(/[^\w]/g, "");

      console.log("Alphanumeric Bcrypt hash:", alphanumericHash);
      console.log(orderHash);

      const query = `INSERT INTO payfasturl(orderId, orderHash)
                      VALUES (
                          "${orderId}",
                          "${alphanumericHash}"
                      )`;
      const result = await dbQuery(query);
      console.log(result);

      let newRes = {
        url: `https://easyvend.azurewebsites.net/payfast/${alphanumericHash}`,
        success: false,
      };

      QRCode.toDataURL(newRes.url, function (err, qrCode) {
        newRes.qrCode = qrCode;
        newRes.orderId = orderId;
        newRes.success = true;
        resolve(newRes);
      });
    });
  },
  payfastAndroid: async (paymentId, requestInfo, requestBody) => {
    return new Promise(async (resolve, reject) => {
      // const requestLib = require("request");
      try {
        const dateNow = new Date(Date.now() + 18000000)
          .toISOString()
          .slice(0, 19)
          .replace("T", " ");

        // const {
        //   companyName,
        //   machineName,
        //   bankName,
        //   paymentName,
        //   paymentDefaultName,
        // } = requestInfo;

        const { price, productId } = requestBody;

        //Get UserId by searching existing user or creating a new one
        // let userId;
        // const users = await userSearch(mobileNumber);
        // if (users === undefined) userId = await createUser(mobileNumber);
        // else userId = users.userId;
        // console.log("User Id: " + userId);
        const mobileNumber = "03000000000";

        //Get ProductId by searching existing product or creating a new one
        const products = await productSearch(productId);
        if (products === undefined) await createProduct(productId);
        console.log("Product Id: " + productId);

        //Generate a new order
        const orderId = await generateOrderAndroid(
          price,
          "pending",
          dateNow,
          productId,
          paymentId
        );
        console.log("Order Id: " + orderId);

        const salt = await bcrypt.genSalt(5);
        const orderHash = await bcrypt.hash(orderId.toString(), salt);
        const alphanumericHash = orderHash.replace(/[^\w]/g, "");

        console.log("Alphanumeric Bcrypt hash:", alphanumericHash);
        console.log(orderHash);

        const query = `INSERT INTO payfasturl(orderId, orderHash, mobileNumber)
                      VALUES (
                          "${orderId}",
                          "${alphanumericHash}",
                          "${mobileNumber}"
                      )`;
        const result = await dbQuery(query);
        console.log(result);

        let newRes = {
          url: `/payfast/${alphanumericHash}`,
          orderId: orderId,
          success: true,
        };
        resolve(newRes);
      } catch (error) {
        reject({ success: false, error: error.toString() });
      }
      // success: false,

      // QRCode.toDataURL(newRes.url, function (err, qrCode) {
      //   newRes.qrCode = qrCode;
      //   newRes.orderId = orderId;
      //   newRes.success = true;
      // });
    });
  },
  paymob: async (paymentId, requestInfo, requestBody) => {
    return new Promise(async (resolve, reject) => {
      const requestLib = require("request");
      const dateNow = new Date(Date.now() + 18000000)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      const {
        companyName,
        machineName,
        bankName,
        paymentName,
        paymentDefaultName,
      } = requestInfo;

      const { price, mobileNumber, productId } = requestBody;

      //Get UserId by searching existing user or creating a new one
      let userId;
      const users = await userSearch(mobileNumber);
      if (users === undefined) userId = await createUser(mobileNumber);
      else userId = users.userId;
      console.log("User Id: " + userId);

      //Get ProductId by searching existing product or creating a new one
      const products = await productSearch(productId);
      if (products === undefined) await createProduct(productId);
      console.log("Product Id: " + productId);

      //Generate a new order
      const orderId = await generateOrder(
        price,
        "pending",
        dateNow,
        productId,
        paymentId,
        userId
      );
      console.log("Order Id: " + orderId);

      //PayLoad Generate for PayFast
      const payload = {
        CUSTOMER_MOBILE_NO: mobileNumber,
        TXNAMT: price,
        BASKET_ID: productId,
        // STORE_ID: "STORE123",
      };
      //

      const api_key = process.env.APIKEY;

      //Create options for paymob token API
      const options = {
        method: "POST",
        url: "https://pakistan.paymob.com/api/auth/tokens",
        body: {
          api_key,
        },
        json: true,
      };

      //Call paymob token API
      requestLib(options, async (error, response, apiResponse) => {
        if (error) reject(new Error(error));
        console.log("Token API Response: ", apiResponse);

        const token = apiResponse?.token;

        //Create options for paymob order registration API
        const options = {
          method: "POST",
          url: "https://pakistan.paymob.com/api/ecommerce/orders",
          body: {
            auth_token: token,
            merchant_order_id: orderId.toString(),
            delivery_needed: "false",
            amount_cents: price * 100,
            currency: "PKR",
          },
          json: true,
        };

        requestLib(options, async (error, response, myResponse) => {
          if (error) reject(new Error(error));
          console.log("EP API Response: ", myResponse);
          const order_id = myResponse?.id;

          //Create options for paymob key request API
          const options = {
            method: "POST",
            url: "https://pakistan.paymob.com/api/acceptance/payment_keys",
            body: {
              auth_token: token,
              amount_cents: price * 100,
              currency: "PKR",
              expiration: 3600,
              lock_order_when_paid: "false",
              integration_id: 79647,
              order_id,
              billing_data: {
                apartment: "NA",
                email: "junaid.akhtar@integrationxperts.com",
                floor: "NA",
                first_name: "Junaid",
                street: "NA",
                building: "NA",
                phone_number: "+923009202572",
                shipping_method: "NA",
                postal_code: "NA",
                city: "NA",
                country: "NA",
                last_name: "Akhtar",
                state: "NA",
              },
            },
            json: true,
          };

          requestLib(options, async (error, response, newRes) => {
            if (error) reject(new Error(error));
            console.log("EP API Response: ", newRes);
            newRes.success = true;
            const iframeUrl = `https://pakistan.paymob.com/api/acceptance/iframes/102045?payment_token=${newRes?.token}`;
            newRes.iframeUrl = iframeUrl;
            newRes.orderId = orderId;
            //Save iframeUrl to Database

            //Encrypt orderId
            const salt = await bcrypt.genSalt(5);
            const orderHash = await bcrypt.hash(orderId.toString(), salt);
            const alphanumericHash = orderHash.replace(/[^\w]/g, "");

            console.log("Alphanumeric Bcrypt hash:", alphanumericHash);
            console.log(orderHash);

            const query = `INSERT INTO iframes(url, orderId, orderHash)
                            VALUES (
                                "${iframeUrl}",
                                "${orderId}",
                                "${alphanumericHash}"
                            )`;
            const result = await dbQuery(query);
            console.log(result);
            const iframeId = result.insertId;
            newRes.iframeId = iframeId;
            const url = `https://cashlessvendapi.azurewebsites.net/urlQR/${alphanumericHash}`;
            newRes.url = url;

            QRCode.toDataURL(url, function (err, qrCode) {
              newRes.qrCode = qrCode;
              resolve(newRes);
            });
          });
        });
      });
    });
  },
};

module.exports = transactionService;
