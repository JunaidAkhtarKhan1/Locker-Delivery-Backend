const { encrypt, decrypt } = require("../../utils/functions");
const axios = require("axios");
const bcrypt = require("bcrypt");
const QRCode = require("qrcode");

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
  rfidBalanceDeduct,
  generateCreditOrder,
  rfidBalanceUpdate,
  generateCreditOrderQR,
  dbQuery,
} = require("../../utils/dbLive");
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

const rechargeService = {
  easypaisaMobileAccount: async (paymentId, requestInfo, requestBody) => {
    return new Promise(async (resolve, reject) => {
      const dateNow = new Date(Date.now() + 18000000)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      const { easypaisaMerchantCredentials, epmaStoreId } = requestInfo;

      const { price, mobileNumber, rfidData } = requestBody;

      const { companyUserId } = await searchRfidUser(rfidData);

      // Get UserId by searching existing user or creating a new one
      let userId;
      const users = await userSearch(mobileNumber);
      if (users === undefined) {
        userId = await createUser(mobileNumber);
      } else {
        userId = users.userId;
      }
      console.log("User Id: " + userId);

      // Generate a new credit order
      const orderId = await generateCreditOrder(
        price,
        "pending",
        dateNow,
        paymentId,
        userId,
        companyUserId,
        "credit"
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
        transactionType: process.env.EPMATAG,
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

        await apiLog(
          "apiResponse",
          JSON.stringify(apiResponse?.responseDesc),
          orderId
        );

        if (apiResponse?.responseCode === "0000") {
          console.log("EP Transaction Accepted");
          await rfidBalanceUpdate(price, companyUserId); // Add balance on company users
          await orderStatusUpdate(orderId, "approved", transactionId); // DB Status Update
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
  easypaisaQRCode: async (paymentId, requestInfo, requestBody) => {
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
      const { price, rfidData } = requestBody;

      const { companyUserId } = await searchRfidUser(rfidData);

      // Generate a new credit order
      const orderId = await generateCreditOrderQR(
        price,
        "pending",
        dateNow,
        paymentId,
        companyUserId,
        "credit"
      );
      console.log("Order Id: " + orderId);

      const orderRefNum = orderId.toString();
      const amount = price.toString();

      const request = {
        storeId: epqrStoreId,
        paymentMethod: process.env.EPQRTAG,
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
        "Content-Type": "application/json",
      };

      console.log("EP QR API Request: ", body);

      await apiLog("apiRequest", JSON.stringify(body.request), orderId);

      try {
        const response = await axios.post(url, body, { headers });
        const apiResponse = response?.data;

        console.log("EP QR API Response: ", apiResponse);

        await apiLog(
          "apiResponse",
          JSON.stringify(apiResponse?.response?.responseDesc),
          orderId
        ); //Log Response

        if (apiResponse?.response?.responseCode === "0000") {
          console.log("EP QR Transaction Accepted");
          await QROrderStatusUpdate(orderId, "generated"); // DB Status Update
          apiResponse.orderId = orderId;
          apiResponse.success = true;
          resolve(apiResponse);
        } else {
          console.log("EP QR Transaction Rejected");
          await QROrderStatusUpdate(orderId, "failed"); // DB Status Update
          apiResponse.orderId = orderId;
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

      const { price, mobileNumber, rfidData } = requestBody;

      const { companyUserId } = await searchRfidUser(rfidData);

      // Generate a new credit order
      const orderId = await generateCreditOrderQR(
        price,
        "pending",
        dateNow,
        paymentId,
        companyUserId,
        "credit"
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
  raastQR: async (paymentId, requestInfo, requestBody) => {
    return new Promise(async (resolve, reject) => {
      const dateNow = new Date(Date.now() + 18000000)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      const { pfMerchantId, pfSecuredKey } = requestInfo;

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
      const { price, rfidData } = requestBody;

      const { companyUserId } = await searchRfidUser(rfidData);

      // Generate a new credit order
      const orderId = await generateCreditOrderQR(
        price,
        "pending",
        dateNow,
        paymentId,
        companyUserId,
        "credit"
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
};

module.exports = rechargeService;
