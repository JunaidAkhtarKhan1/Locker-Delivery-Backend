const { connection } = require("../../config/config");
const machineId = process.env.MACHINEID;
const azure = require("azure-storage");
require("dotenv").config();
const multer = require("multer");

const dbConditionalQuery = async (query, condition) => {
  console.log(query);
  console.log(condition);

  return new Promise((resolve, reject) => {
    connection.query(query, condition, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const configureMulter = () => {
  const storage = multer.memoryStorage();
  return multer({
    storage: storage,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB file size limit
    },
    fileFilter: (req, file, cb) => {
      const allowedMimes = ["image/jpeg", "image/png", "image/gif"];
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(
          new Error("Invalid file type. Only JPEG, PNG and GIF are allowed."),
          false
        );
      }
    },
  }).single("file");
};

// Initialize blob service utility
const initializeBlobService = () => {
  const azureBlobName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
  const azureBlobAccessKey = process.env.AZURE_STORAGE_ACCOUNT_ACCESS_KEY;
  return azure.createBlobService(azureBlobName, azureBlobAccessKey);
};

// Generate unique blob name utility
const generateUniqueBlobName = (originalName) => {
  return `${Date.now()}-${originalName}`;
};

// Generate blob URL utility
const generateBlobUrl = (blobName) => {
  const azureBlobName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
  const containerName = process.env.CONTAINERNAME;
  return `https://${azureBlobName}.blob.core.windows.net/${containerName}/${blobName}`;
};

// Promise wrapper for multer upload
const handleMulterUpload = (req, res, upload) => {
  return new Promise((resolve, reject) => {
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        reject({
          success: false,
          message: `Multer upload error: ${err.message}`,
        });
      } else if (err) {
        reject({ success: false, message: err.message });
      } else {
        resolve({ success: true });
      }
    });
  });
};

// Generic Pagination Function
const paginate = async (
  tableName,
  page,
  limit,
  search = null,
  startDate = null,
  endDate = null
) => {
  const offset = (page - 1) * limit;

  // Base queries
  let countQuery = `SELECT COUNT(*) AS totalRecords FROM ??`;
  let dataQuery = `SELECT * FROM ??`;
  const queryParams = [tableName];
  const whereClauses = [];

  // Add Search Functionality
  if (search) {
    const colomns = await dbConditionalQuery(`SHOW COLUMNS FROM ??`, [
      tableName,
    ]);
    const searchClauses = colomns.map((column) => `\`${column.Field}\` LIKE ?`);
    const searchParams = colomns.map(() => `%${search}%`);

    whereClauses.push(`(${searchClauses.join(" OR ")})`);
    queryParams.push(...searchParams);
  }

  // Add Date Filter
  if (startDate && endDate) {
    whereClauses.push("timestamp BETWEEN ? AND ?");
    queryParams.push(startDate, endDate);
  }

  // Append WHERE clause if conditions exist
  if (whereClauses.length > 0) {
    const whereClause = " WHERE " + whereClauses.join(" AND ");
    countQuery += whereClause;
    dataQuery += whereClause;
  }

  // Add LIMIT and OFFSET
  dataQuery += ` LIMIT ? OFFSET ?`;
  queryParams.push(limit, offset);

  // Execute Queries
  const countResult = await dbConditionalQuery(
    countQuery,
    queryParams.slice(0, -2)
  ); // Exclude LIMIT and OFFSET for count query

  console.log(countResult);

  const totalRecords = countResult[0].totalRecords;
  const totalPages = Math.ceil(totalRecords / limit);

  const dataResult = await dbConditionalQuery(dataQuery, queryParams);

  // Pagination Object
  const pagination = {
    page,
    limit,
    totalRecords,
    totalPages,
  };

  return { data: dataResult, pagination };
};
const paginateOneJoinWhere = async (
  tableName,
  page,
  limit,
  search = null,
  startDate = null,
  endDate = null,
  joinName,
  joinIdName,
  sortId,
  companyId
) => {
  const offset = (page - 1) * limit;

  // Base queries
  let countQuery = `SELECT COUNT(*) AS totalRecords FROM ?? LEFT JOIN ?? USING (??)`;
  let dataQuery = `SELECT * FROM ?? LEFT JOIN ?? USING (??)`;

  const queryParams = [tableName, joinName, joinIdName];
  const countParams = [...queryParams]; // Separate count params

  const whereClauses = [];
  const whereValues = [];

  // WHERE conditions
  if (companyId) {
    whereClauses.push("companyId = ?");
    whereValues.push(companyId);
  }

  if (search) {
    const columns = await dbConditionalQuery(`SHOW COLUMNS FROM ??`, [
      tableName,
    ]);
    const searchClauses = columns.map((column) => `\`${column.Field}\` LIKE ?`);
    const searchValues = columns.map(() => `%${search}%`);
    whereClauses.push(`(${searchClauses.join(" OR ")})`);
    whereValues.push(...searchValues);
  }

  if (startDate && endDate) {
    whereClauses.push("timestamp BETWEEN ? AND ?");
    whereValues.push(startDate, endDate);
  }

  // Add WHERE clause
  if (whereClauses.length > 0) {
    const whereClause = " WHERE " + whereClauses.join(" AND ");
    countQuery += whereClause;
    dataQuery += whereClause;
  }

  // Add ORDER BY, LIMIT, OFFSET
  dataQuery += " ORDER BY ?? DESC LIMIT ? OFFSET ?";
  const dataParams = [...queryParams, ...whereValues, sortId, limit, offset];
  const finalCountParams = [...countParams, ...whereValues];

  // Execute Queries
  const countResult = await dbConditionalQuery(countQuery, finalCountParams);
  const totalRecords = countResult[0].totalRecords;
  const totalPages = Math.ceil(totalRecords / limit);

  const dataResult = await dbConditionalQuery(dataQuery, dataParams);

  return {
    data: dataResult,
    pagination: {
      page,
      limit,
      totalRecords,
      totalPages,
    },
  };
};

const paginateOneJoin = async (
  tableName,
  page,
  limit,
  search = null,
  startDate = null,
  endDate = null,
  joinName,
  joinIdName,
  sortId
) => {
  const offset = (page - 1) * limit;

  // Base queries
  let countQuery = `SELECT COUNT(*) AS totalRecords FROM ??`;
  let dataQuery = `SELECT * FROM ?? LEFT JOIN ?? USING (??) ORDER by ?? DESC`;
  const queryParams = [tableName, joinName, joinIdName, sortId];
  const whereClauses = [];

  // Add Search Functionality
  if (search) {
    const colomns = await dbConditionalQuery(`SHOW COLUMNS FROM ??`, [
      tableName,
    ]);
    const searchClauses = colomns.map((column) => `\`${column.Field}\` LIKE ?`);
    const searchParams = colomns.map(() => `%${search}%`);

    whereClauses.push(`(${searchClauses.join(" OR ")})`);
    queryParams.push(...searchParams);
  }

  // Add Date Filter
  if (startDate && endDate) {
    whereClauses.push("timestamp BETWEEN ? AND ?");
    queryParams.push(startDate, endDate);
  }

  // Append WHERE clause if conditions exist
  if (whereClauses.length > 0) {
    const whereClause = " WHERE " + whereClauses.join(" AND ");
    countQuery += whereClause;
    dataQuery += whereClause;
  }

  // Add LIMIT and OFFSET
  dataQuery += ` LIMIT ? OFFSET ?`;
  queryParams.push(limit, offset);

  // Execute Queries
  const countResult = await dbConditionalQuery(
    countQuery,
    queryParams.slice(0, -2)
  ); // Exclude LIMIT and OFFSET for count query

  console.log(countResult);

  const totalRecords = countResult[0].totalRecords;
  const totalPages = Math.ceil(totalRecords / limit);

  const dataResult = await dbConditionalQuery(dataQuery, queryParams);

  // Pagination Object
  const pagination = {
    page,
    limit,
    totalRecords,
    totalPages,
  };

  return { data: dataResult, pagination };
};

const paginatetwoJoinWhere = async (
  tableName,
  page,
  limit,
  search = null,
  startDate = null,
  endDate = null,
  joinName,
  joinIdName,
  joinName2,
  joinIdName2,
  companyId
) => {
  const offset = (page - 1) * limit;

  // Base queries
  let countQuery = `SELECT COUNT(*) AS totalRecords FROM ?? JOIN ?? USING (??) JOIN ?? USING (??)`;
  let dataQuery = `SELECT * FROM ?? JOIN ?? USING (??) JOIN ?? USING (??)`;
  const queryParams = [
    tableName,
    joinName,
    joinIdName,
    joinName2,
    joinIdName2,
    // companyId,
  ];
  const whereClauses = [];
  const whereValues = [];

  if (companyId) {
    whereClauses.push(`${joinName2}.companyId = ?`);
    queryParams.push(companyId);
  }

  // Add Search Functionality
  if (search) {
    const colomns = await dbConditionalQuery(`SHOW COLUMNS FROM ??`, [
      tableName,
    ]);
    const searchClauses = colomns.map((column) => `\`${column.Field}\` LIKE ?`);
    const searchParams = colomns.map(() => `%${search}%`);

    whereClauses.push(`(${searchClauses.join(" OR ")})`);
    queryParams.push(...searchParams);
  }

  // Add Date Filter
  if (startDate && endDate) {
    whereClauses.push("timestamp BETWEEN ? AND ?");
    queryParams.push(startDate, endDate);
  }

  // Append WHERE clause if conditions exist
  if (whereClauses.length > 0) {
    const whereClause = " WHERE " + whereClauses.join(" AND ");
    countQuery += whereClause;
    dataQuery += whereClause;
  }

  // Add LIMIT and OFFSET
  dataQuery += ` LIMIT ? OFFSET ?`;
  queryParams.push(limit, offset);

  // Execute Queries
  const countResult = await dbConditionalQuery(
    countQuery,
    queryParams.slice(0, -2)
  ); // Exclude LIMIT and OFFSET for count query

  console.log(countResult);

  const totalRecords = countResult[0].totalRecords;
  const totalPages = Math.ceil(totalRecords / limit);

  const dataResult = await dbConditionalQuery(dataQuery, queryParams);

  // Pagination Object
  const pagination = {
    page,
    limit,
    totalRecords,
    totalPages,
  };

  return { data: dataResult, pagination };
};

const paginatetwoJoin = async (
  tableName,
  page,
  limit,
  search = null,
  startDate = null,
  endDate = null,
  joinName,
  joinIdName,
  joinName2,
  joinIdName2
) => {
  const offset = (page - 1) * limit;

  // Base queries
  let countQuery = `SELECT COUNT(*) AS totalRecords FROM ??`;
  let dataQuery = `SELECT * FROM ?? JOIN ?? USING (??) JOIN ?? USING (??)`;
  const queryParams = [tableName, joinName, joinIdName, joinName2, joinIdName2];
  const whereClauses = [];

  // Add Search Functionality
  if (search) {
    const colomns = await dbConditionalQuery(`SHOW COLUMNS FROM ??`, [
      tableName,
    ]);
    const searchClauses = colomns.map((column) => `\`${column.Field}\` LIKE ?`);
    const searchParams = colomns.map(() => `%${search}%`);

    whereClauses.push(`(${searchClauses.join(" OR ")})`);
    queryParams.push(...searchParams);
  }

  // Add Date Filter
  if (startDate && endDate) {
    whereClauses.push("timestamp BETWEEN ? AND ?");
    queryParams.push(startDate, endDate);
  }

  // Append WHERE clause if conditions exist
  if (whereClauses.length > 0) {
    const whereClause = " WHERE " + whereClauses.join(" AND ");
    countQuery += whereClause;
    dataQuery += whereClause;
  }

  // Add LIMIT and OFFSET
  dataQuery += ` LIMIT ? OFFSET ?`;
  queryParams.push(limit, offset);

  // Execute Queries
  const countResult = await dbConditionalQuery(
    countQuery,
    queryParams.slice(0, -2)
  ); // Exclude LIMIT and OFFSET for count query

  console.log(countResult);

  const totalRecords = countResult[0].totalRecords;
  const totalPages = Math.ceil(totalRecords / limit);

  const dataResult = await dbConditionalQuery(dataQuery, queryParams);

  // Pagination Object
  const pagination = {
    page,
    limit,
    totalRecords,
    totalPages,
  };

  return { data: dataResult, pagination };
};
const paginatefourJoin = async (
  tableName,
  page,
  limit,
  search = null,
  startDate = null,
  endDate = null,
  joinName,
  joinIdName,
  joinName2,
  joinIdName2,
  joinName3,
  joinIdName3,
  joinName4,
  joinIdName4
) => {
  const offset = (page - 1) * limit;

  // Base queries
  let countQuery = `SELECT COUNT(*) AS totalRecords FROM ??`;
  let dataQuery = `SELECT * FROM ?? JOIN ?? USING (??)  JOIN ?? USING (??) JOIN ?? USING (??)JOIN ?? USING (??)`;
  const queryParams = [
    tableName,
    joinName,
    joinIdName,
    joinName2,
    joinIdName2,
    joinName3,
    joinIdName3,
    joinName4,
    joinIdName4,
  ];
  const whereClauses = [];

  // Add Search Functionality
  if (search) {
    const colomns = await dbConditionalQuery(`SHOW COLUMNS FROM ??`, [
      tableName,
    ]);
    const searchClauses = colomns.map((column) => `\`${column.Field}\` LIKE ?`);
    const searchParams = colomns.map(() => `%${search}%`);

    whereClauses.push(`(${searchClauses.join(" OR ")})`);
    queryParams.push(...searchParams);
  }

  // Add Date Filter
  if (startDate && endDate) {
    whereClauses.push("timestamp BETWEEN ? AND ?");
    queryParams.push(startDate, endDate);
  }

  // Append WHERE clause if conditions exist
  if (whereClauses.length > 0) {
    const whereClause = " WHERE " + whereClauses.join(" AND ");
    countQuery += whereClause;
    dataQuery += whereClause;
  }

  // Add LIMIT and OFFSET
  dataQuery += ` LIMIT ? OFFSET ?`;
  queryParams.push(limit, offset);

  // Execute Queries
  const countResult = await dbConditionalQuery(
    countQuery,
    queryParams.slice(0, -2)
  ); // Exclude LIMIT and OFFSET for count query

  console.log(countResult);

  const totalRecords = countResult[0].totalRecords;
  const totalPages = Math.ceil(totalRecords / limit);

  const dataResult = await dbConditionalQuery(dataQuery, queryParams);

  // Pagination Object
  const pagination = {
    page,
    limit,
    totalRecords,
    totalPages,
  };

  return { data: dataResult, pagination };
};
const paginatefiveJoin = async (
  tableName,
  page,
  limit,
  search = null,
  startDate = null,
  endDate = null,
  joinName,
  joinIdName,
  joinName2,
  joinIdName2,
  joinName3,
  joinIdName3,
  joinName4,
  joinIdName4,
  joinName5,
  joinIdName5,
  sortId
) => {
  const offset = (page - 1) * limit;

  // Base queries
  let countQuery = `SELECT COUNT(*) AS totalRecords FROM ??`;
  let dataQuery = `SELECT * FROM ?? LEFT JOIN ?? USING (??) LEFT JOIN ?? USING (??) LEFT JOIN ?? USING (??) LEFT JOIN ?? USING (??) LEFT JOIN ?? USING (??) ORDER by ?? DESC`;
  const queryParams = [
    tableName,
    joinName,
    joinIdName,
    joinName2,
    joinIdName2,
    joinName3,
    joinIdName3,
    joinName4,
    joinIdName4,
    joinName5,
    joinIdName5,
    sortId,
  ];
  const whereClauses = [];

  // Add Search Functionality
  if (search) {
    const colomns = await dbConditionalQuery(`SHOW COLUMNS FROM ??`, [
      tableName,
    ]);
    const searchClauses = colomns.map((column) => `\`${column.Field}\` LIKE ?`);
    const searchParams = colomns.map(() => `%${search}%`);

    whereClauses.push(`(${searchClauses.join(" OR ")})`);
    queryParams.push(...searchParams);
  }

  // Add Date Filter
  if (startDate && endDate) {
    whereClauses.push("timestamp BETWEEN ? AND ?");
    queryParams.push(startDate, endDate);
  }

  // Append WHERE clause if conditions exist
  if (whereClauses.length > 0) {
    const whereClause = " WHERE " + whereClauses.join(" AND ");
    countQuery += whereClause;
    dataQuery += whereClause;
  }

  // Add LIMIT and OFFSET
  dataQuery += ` LIMIT ? OFFSET ?`;
  queryParams.push(limit, offset);

  // Execute Queries
  const countResult = await dbConditionalQuery(
    countQuery,
    queryParams.slice(0, -2)
  ); // Exclude LIMIT and OFFSET for count query

  console.log(countResult);

  const totalRecords = countResult[0].totalRecords;
  const totalPages = Math.ceil(totalRecords / limit);

  const dataResult = await dbConditionalQuery(dataQuery, queryParams);

  // Pagination Object
  const pagination = {
    page,
    limit,
    totalRecords,
    totalPages,
  };

  return { data: dataResult, pagination };
};
const dbGenerate = async (body) => {
  return new Promise((resolve, reject) => {
    const dateNow = new Date(Date.now() + 18000000)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const query = `INSERT INTO 
            transaction_history (
                machineId,
                productId,
                transactionId,
                paymentMethod,
                userMobileNumber,
                price,
                transactionStatus,
                timestamp
                )
            VALUES (
                '${machineId}',
                '${body.productId}',
                '0',
                '${body.transactionType}',
                '${body.mobileAccountNo}',
                '${body.transactionAmount}',
                'pending',
                '${dateNow}'
      )`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows.insertId);
    });
  });
};

const dbGet = async () => {
  return new Promise(function (resolve, reject) {
    const query = `SELECT *
                  FROM transaction_history
                  ORDER BY orderId DESC
                  LIMIT 1;`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows[0]);
    });
  });
};

const dbUpdate = async (body, status) => {
  const orderId = Number(body.orderId);
  let transactionId = body.transactionId;
  if (!body.transactionId) transactionId = 0;
  return new Promise(function (resolve, reject) {
    const query = `UPDATE transaction_history
            SET transactionStatus = '${status}',
                transactionId = '${transactionId}'
            WHERE orderId = ${orderId}`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const dbUpdateQR = async (body, status) => {
  const orderId = Number(body.orderId);
  let userMobileNumber = body.msisdn;
  if (!body.msisdn) userMobileNumber = "0";
  return new Promise(function (resolve, reject) {
    const query = `UPDATE transaction_history
            SET transactionStatus = '${status}',
                userMobileNumber = '${userMobileNumber}'
            WHERE orderId = ${orderId}`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const dbGetApproved = async (body) => {
  const orderId = Number(body.orderId);
  return new Promise(function (resolve, reject) {
    const query = `SELECT *
                  FROM transaction_history
                  WHERE orderId = ${orderId};`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows[0]);
    });
  });
};

const dbUserSearch = async (body) => {
  return new Promise(function (resolve, reject) {
    const query = `SELECT *
                  FROM user_balance
                  WHERE userMobileNumber = ${body.userMobileNumber};`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows[0]);
    });
  });
};

const dbUserSearchQR = async (body) => {
  return new Promise(function (resolve, reject) {
    const query = `SELECT *
                  FROM user_balance
                  WHERE userMobileNumber = ${body.msisdn};`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows[0]);
    });
  });
};

const insertUserBalance = async (priceSafety) => {
  const dateNow = new Date(Date.now() + 18000000)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  return new Promise((resolve, reject) => {
    const query = `INSERT INTO 
            user_balance (
                paymentMethod,
                userMobileNumber,
                balance,
                timestamp
                )
            VALUES (
                '${priceSafety.paymentMethod}',
                '${priceSafety.userMobileNumber}',
                ${priceSafety.price},
                '${dateNow}'
      )`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const insertUserBalanceQR = async (body) => {
  const dateNow = new Date(Date.now() + 18000000)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  return new Promise((resolve, reject) => {
    const query = `INSERT INTO 
            user_balance (
                paymentMethod,
                userMobileNumber,
                balance,
                timestamp
                )
            VALUES (
                'MA',
                '${body.msisdn}',
                ${body.transactionAmount},
                '${dateNow}'
      )`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const updateUserBalance = async (priceSafety, userInfo) => {
  const dateNow = new Date(Date.now() + 18000000)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  const totalAmount = priceSafety.price + userInfo.balance;
  return new Promise(function (resolve, reject) {
    const query = `UPDATE user_balance
            SET balance = ${totalAmount},
            timestamp = '${dateNow}'
            WHERE userMobileNumber = ${userInfo.userMobileNumber}`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const updateUserBalanceQR = async (body, userInfo) => {
  const dateNow = new Date(Date.now() + 18000000)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  const totalAmount = body.transactionAmount + userInfo.balance;
  return new Promise(function (resolve, reject) {
    const query = `UPDATE user_balance
            SET balance = ${totalAmount},
            timestamp = '${dateNow}'
            WHERE userMobileNumber = ${userInfo.userMobileNumber}`;

    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const dbQuery = async (query) => {
  return new Promise((resolve, reject) => {
    connection.query(query, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const dbUpdateGeneral = async (query, data) => {
  return new Promise((resolve, reject) => {
    connection.query(query, data, async (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const dbQueryMonth = async (query, startDate, endDate) => {
  return new Promise((resolve, reject) => {
    connection.query(query, [startDate, endDate], async (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

module.exports = {
  dbGenerate,
  dbGet,
  dbUpdate,
  dbGetApproved,
  dbUserSearch,
  insertUserBalance,
  updateUserBalance,
  dbUpdateQR,
  dbUserSearchQR,
  insertUserBalanceQR,
  updateUserBalanceQR,
  dbQuery,
  dbUpdateGeneral,
  dbQueryMonth,
  dbConditionalQuery,
  paginate,
  paginatefiveJoin,
  paginateOneJoin,
  paginatetwoJoin,
  paginatefourJoin,
  configureMulter,
  initializeBlobService,
  generateUniqueBlobName,
  generateBlobUrl,
  handleMulterUpload,
  paginateOneJoinWhere,
  paginatetwoJoinWhere,
};
