const { connection } = require("../../config/config");

const dbQuery = async (query) => {
  return new Promise((resolve, reject) => {
    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const getPaymentInfo = async (paymentId) => {
  //Get All machine details with bank info
  return new Promise(function (resolve, reject) {
    const query = `SELECT paymentId,
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
                            pfMerchantId,
                            pfSecuredKey
                        FROM paymentmodes
                        LEFT JOIN banks USING (bankId)
                        INNER JOIN paymentmethods USING (paymentMethodId)
                        INNER JOIN machines USING (machineId)
                        INNER JOIN companies USING (companyId)
                        INNER JOIN merchants USING (merchantId)
                        WHERE paymentId=${paymentId};`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows[0]);
    });
  });
};

const getPaymentDetails = async (paymentId) => {
  //Get All machine details with bank info
  return new Promise(function (resolve, reject) {
    const query = `SELECT paymentId,
                            companyName,        
                            machineName,
                            bankName,
                            paymentName,
                            paymentDefaultName
                        FROM paymentmodes
                        LEFT JOIN banks USING (bankId)
                        INNER JOIN paymentmethods USING (paymentMethodId)
                        INNER JOIN machines USING (machineId)
                        INNER JOIN companies USING (companyId)
                        WHERE paymentId=${paymentId};`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows[0]);
    });
  });
};

const createUser = async (mobileNumber) => {
  //Create user from phone number
  return new Promise(function (resolve, reject) {
    const query = `INSERT INTO users(
                        userMobileNumber,
                        conflictBalance
                        )
                    VALUES(
                        '${mobileNumber}',
                        0
                    );`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows.insertId);
    });
  });
};

const userSearch = async (mobileNumber) => {
  //Search for user phone number
  return new Promise(function (resolve, reject) {
    const query = `SELECT *
                    FROM users
                    WHERE userMobileNumber = ${mobileNumber};`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows[0]);
    });
  });
};

const createProduct = async (productId) => {
  //Create user from phone number
  return new Promise(function (resolve, reject) {
    const query = `INSERT INTO products(
                            productId
                        )
                    VALUES(
                        '${productId}'
                    );`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows.insertId);
    });
  });
};

const productSearch = async (productId) => {
  //Search for user phone number
  return new Promise(function (resolve, reject) {
    const query = `SELECT *
                    FROM products
                    WHERE productId = ${productId};`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows[0]);
    });
  });
};

const generateOrder = async (
  price,
  transactionStatus,
  timestamp,
  productId,
  paymentId,
  userId
) => {
  //Create order for Mobile Account
  return new Promise(function (resolve, reject) {
    const query = `INSERT INTO orders(
                            price,
                            transactionStatus,
                            timestamp,
                            productId,
                            paymentId,
                            userId
                        )
                        VALUES(
                            ${price},
                            '${transactionStatus}',
                            '${timestamp}',
                            '${productId}',
                            ${paymentId},
                            ${userId}
                        );`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows.insertId);
    });
  });
};
const getOrders = async (orderId) => {
  //Get All machine details with bank info
  return new Promise(function (resolve, reject) {
    const query = `SELECT price
                        FROM orders
                        WHERE orderId = ${orderId}`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows[0].price);
    });
  });
};
const updateOrder = async (orderId, transactionStatus, paymentId) => {
  //Update order status
  return new Promise(function (resolve, reject) {
    const query = `UPDATE orders
                        SET transactionStatus = '${transactionStatus}',
                            paymentId = '${paymentId}'
                        WHERE orderId = ${orderId}`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};
const updateOrderQR = async (orderId, transactionStatus, paymentId) => {
  //Update order status
  return new Promise(function (resolve, reject) {
    const query = `UPDATE orders
                        SET transactionStatus = '${transactionStatus}',
                            paymentId = '${paymentId}'
                        WHERE orderId = ${orderId}`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};
const generateOrderAndroid = async (
  price,
  transactionStatus,
  timestamp,
  productId,
  paymentId
) => {
  //Create order for Mobile Account
  return new Promise(function (resolve, reject) {
    const query = `INSERT INTO orders(
                            price,
                            transactionStatus,
                            timestamp,
                            productId,
                            paymentId
                        )
                        VALUES(
                            ${price},
                            '${transactionStatus}',
                            '${timestamp}',
                            '${productId}',
                            ${paymentId}
                        );`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows.insertId);
    });
  });
};

const orderStatusUpdate = async (orderId, transactionStatus, transactionId) => {
  //Update order status
  return new Promise(function (resolve, reject) {
    const query = `UPDATE orders
                        SET transactionStatus = '${transactionStatus}',
                            transactionId = '${transactionId}'
                        WHERE orderId = ${orderId}`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const userBalanceUpdate = async (result) => {
  //Update user balance
  return new Promise(function (resolve, reject) {
    const { transactionAmount, mobileAccountNo } = result;
    const query = `UPDATE users
                        SET conflictBalance = conflictBalance + ${transactionAmount}
                        WHERE userMobileNumber = ${mobileAccountNo}`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const apiLog = async (logType, logMessage, orderId) => {
  //Log the Information
  return new Promise(function (resolve, reject) {
    const query = `INSERT INTO logs(
                        logType,
                        logMessage,
                        orderId
                        )
                        VALUES(
                            '${logType}',
                            '${logMessage}',
                            ${orderId}
                        );`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows.insertId);
    });
  });
};

const generateOrderQR = async (
  price,
  transactionStatus,
  timestamp,
  productId,
  paymentId
) => {
  //Create orders for QR
  return new Promise(function (resolve, reject) {
    const query = `INSERT INTO orders(
                            price,
                            transactionStatus,
                            timestamp,
                            productId,
                            paymentId
                        )
                        VALUES(
                            ${price},
                            '${transactionStatus}',
                            '${timestamp}',
                            '${productId}',
                            ${paymentId}
                        );`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows.insertId);
    });
  });
};

const QROrderStatusUpdate = async (orderId, transactionStatus) => {
  //QR order status update
  return new Promise(function (resolve, reject) {
    const query = `UPDATE orders
                        SET transactionStatus = '${transactionStatus}'
                        WHERE orderId = ${orderId}`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const rfidOrderStatusUpdate = async (
  orderId,
  transactionStatus,
  transactionType,
  paymentId
) => {
  //QR order status update
  return new Promise(function (resolve, reject) {
    const query = `UPDATE orders
                        SET transactionStatus = '${transactionStatus}',
                            transactionType = '${transactionType}',
                            paymentId = ${paymentId}
                        WHERE orderId = ${orderId}`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const searchRecentOrder = async (paymentId) => {
  //order search by paymentId
  return new Promise(function (resolve, reject) {
    const query = `SELECT *
                        FROM orders
                        WHERE paymentId=${paymentId}
                        ORDER BY timestamp DESC
                        LIMIT 1`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows[0]);
    });
  });
};

const orderStatusUpdateInquire = async (
  orderId,
  transactionStatus,
  transactionId,
  userId
) => {
  //Update order status
  return new Promise(function (resolve, reject) {
    const query = `UPDATE orders
                        SET transactionStatus = '${transactionStatus}',
                            transactionId = '${transactionId}',
                            userId = ${userId}
                        WHERE orderId = ${orderId}`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const userBalanceUpdateInquire = async (result) => {
  //Update user balance
  return new Promise(function (resolve, reject) {
    const { transactionAmount, msisdn } = result;
    const query = `UPDATE users
                        SET conflictBalance = conflictBalance + ${transactionAmount}
                        WHERE userMobileNumber = ${msisdn}`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const apiLogSearch = async (logType, logMessage, orderId) => {
  //Log the Information
  return new Promise(function (resolve, reject) {
    const query = `SELECT * 
                        FROM logs
                        WHERE orderId=${orderId} AND logType='${logType}';`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows[0]);
    });
  });
};

const apiLogUpdate = async (logId, logMessage) => {
  //Update order status
  return new Promise(function (resolve, reject) {
    const query = `UPDATE logs
                        SET logMessage = '${logMessage}'
                        WHERE logId=${logId}`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const searchOrder = async (orderId) => {
  //order search by orderId
  return new Promise(function (resolve, reject) {
    const query = `SELECT *
                        FROM orders
                        WHERE orderId=${orderId}`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows[0]);
    });
  });
};

const lastOrderSearch = async (machineId) => {
  //recent order search by machineId
  return new Promise(function (resolve, reject) {
    const query = `SELECT * 
                        FROM orders
                        WHERE orderId = (SELECT orderId
                        FROM orders
                        INNER JOIN paymentmodes USING (paymentId)
                        WHERE machineId = ${machineId}
                        ORDER BY orderId DESC
                        LIMIT 1)`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows[0]);
    });
  });
};

const orderStatusComplete = async (orderId, transactionStatus) => {
  //Update order status when process completed
  return new Promise(function (resolve, reject) {
    const query = `UPDATE orders
                        SET transactionStatus = '${transactionStatus}'
                        WHERE orderId = ${orderId}`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const userBalanceComplete = async (userId, price) => {
  //Update user balance when process complete
  return new Promise(function (resolve, reject) {
    const query = `UPDATE users
                        SET conflictBalance = conflictBalance - ${price}
                        WHERE userId = ${userId}`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const searchRfidUser = async (rfidData) => {
  //order search by paymentId
  return new Promise(function (resolve, reject) {
    const query = `SELECT * 
                        FROM companyusers
                        WHERE rfid = '${rfidData}';`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows[0]);
    });
  });
};

const searchRfidUserCompany = async (rfidData, companyId) => {
  //order search by paymentId
  return new Promise(function (resolve, reject) {
    const query = `SELECT * 
                        FROM companyusers
                        WHERE rfid = '${rfidData}' AND companyId= ${companyId};`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows[0]);
    });
  });
};

const rfidBalanceDeduct = async (companyUserId, price) => {
  return new Promise(function (resolve, reject) {
    const query = `UPDATE companyusers
                        SET balance = balance - ${price}
                        WHERE companyUserId = ${companyUserId}`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const rfidBalanceDeductBoth = async (
  companyUserId,
  deductRechargeBalance,
  deductCompanyBalance
) => {
  return new Promise(function (resolve, reject) {
    const query = `UPDATE companyusers
                        SET balance = balance - ${deductRechargeBalance},
                            companyBalance = companyBalance - ${deductCompanyBalance}
                        WHERE companyUserId = ${companyUserId}`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const generateCreditOrder = async (
  price,
  transactionStatus,
  timestamp,
  paymentId,
  userId,
  companyUserId,
  transactionType
) => {
  //Create credit order for Mobile Account
  return new Promise(function (resolve, reject) {
    const query = `INSERT INTO orders(
                            price,
                            transactionStatus,
                            timestamp,
                            paymentId,
                            userId,
                            companyUserId,
                            transactionType
                        )
                        VALUES(
                            ${price},
                            '${transactionStatus}',
                            '${timestamp}',
                            ${paymentId},
                            ${userId},
                            ${companyUserId},
                            '${transactionType}'
                        );`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows.insertId);
    });
  });
};

const rfidBalanceUpdate = async (transactionAmount, companyUserId) => {
  return new Promise(function (resolve, reject) {
    const query = `UPDATE companyusers
                        SET balance = balance + ${transactionAmount}
                        WHERE companyUserId = ${companyUserId}`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const generateCreditOrderQR = async (
  price,
  transactionStatus,
  timestamp,
  paymentId,
  companyUserId,
  transactionType
) => {
  //Create credit order for Mobile Account
  return new Promise(function (resolve, reject) {
    const query = `INSERT INTO orders(
                            price,
                            transactionStatus,
                            timestamp,
                            paymentId,
                            companyUserId,
                            transactionType
                        )
                        VALUES(
                            ${price},
                            '${transactionStatus}',
                            '${timestamp}',
                            ${paymentId},
                            ${companyUserId},
                            '${transactionType}'
                        );`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows.insertId);
    });
  });
};

const generateOrderRFID = async (
  price,
  transactionStatus,
  timestamp,
  productId,
  paymentId,
  companyUserId,
  transactionType
) => {
  //Create orders for QR
  return new Promise(function (resolve, reject) {
    const query = `INSERT INTO orders(
                            price,
                            transactionStatus,
                            timestamp,
                            productId,
                            paymentId,
                            companyUserId,
                            transactionType
                        )
                        VALUES(
                            ${price},
                            '${transactionStatus}',
                            '${timestamp}',
                            '${productId}',
                            ${paymentId},
                            ${companyUserId},
                            '${transactionType}'
                        );`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows.insertId);
    });
  });
};
const updateOrderRFID = async (orderId, transactionStatus, paymentId) => {
  //Update order status
  return new Promise(function (resolve, reject) {
    const query = `UPDATE orders
                        SET transactionStatus = '${transactionStatus}',
                            paymentId = '${paymentId}'
                        WHERE orderId = ${orderId}`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};
const generateDetailOrderRFID = async (
  orderId,
  companyId,
  deductRechargeBalance,
  deductCompanyBalance
) => {
  //Create orders for QR
  return new Promise(function (resolve, reject) {
    const query = `INSERT INTO rfidorders(
                            orderId,
                            companyId,
                            deductRechargeBalance,
                            deductCompanyBalance
                        )
                        VALUES(
                            ${orderId},
                            ${companyId},
                            ${deductRechargeBalance},
                            ${deductCompanyBalance}
                        );`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const rfidFlag = async (companyId) => {
  //order search by paymentId
  return new Promise(function (resolve, reject) {
    const query = `SELECT * 
                        FROM companyflags
                        WHERE companyId= ${companyId};`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows[0]);
    });
  });
};

module.exports = {
  dbQuery,
  generateOrderRFID,
  getPaymentInfo,
  getOrders,
  createUser,
  userSearch,
  createProduct,
  productSearch,
  generateOrder,
  updateOrder,
  orderStatusUpdate,
  userBalanceUpdate,
  apiLog,
  generateOrderQR,
  updateOrderQR,
  QROrderStatusUpdate,
  searchRecentOrder,
  orderStatusUpdateInquire,
  userBalanceUpdateInquire,
  apiLogSearch,
  apiLogUpdate,
  searchOrder,
  lastOrderSearch,
  orderStatusComplete,
  userBalanceComplete,
  searchRfidUser,
  searchRfidUserCompany,
  rfidBalanceDeduct,
  generateCreditOrder,
  rfidBalanceUpdate,
  generateCreditOrderQR,
  searchRfidUserCompany,
  rfidFlag,
  rfidOrderStatusUpdate,
  rfidBalanceDeductBoth,
  generateDetailOrderRFID,
  getPaymentDetails,
  generateOrderAndroid,
  updateOrderRFID,
};
