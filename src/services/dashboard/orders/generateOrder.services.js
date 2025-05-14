const { dbQuery } = require("../../../utils/dbFunctions");

const generateOrderService = {
  generateOrders: async (req, res, companyId) => {
    try {
      const {
        customerName,
        customerEmail,
        customerMobileNumber,
        machineId,
        barcodeNumbers, // Array of barcode IDs
      } = req.body;

      // Check if the machine has available columns
      const checkMachineQuery = `
        SELECT COUNT(*) AS availableColumns
        FROM machineLockers
        WHERE machineId = ${machineId} AND lockerStatus = 'empty'
      `;

      const checkMachineCount = await dbQuery(checkMachineQuery);
      const totalColumns = checkMachineCount[0]?.availableColumns;

      if (totalColumns < barcodeNumbers.length) {
        return {
          success: false,
          message: "Not enough empty lockers available for the order.",
        };
      }

      //Check if the customer already exists
      const checkCustomerQuery = `
        SELECT customerId
        FROM customers
        WHERE email = '${customerEmail}' OR mobileNumber = '${customerMobileNumber}'
      `;
      const checkCustomerResult = await dbQuery(checkCustomerQuery);
      const existingCustomer = checkCustomerResult[0]?.customerId;

      //if the customer already exists, use the existing customerId
      if (existingCustomer) {
        customerId = existingCustomer;
      } else {
        // If the customer does not exist, create a new customer
        const customerInsertQuery = `
          INSERT INTO customers (name, email, mobileNumber)
          VALUES ('${customerName}', '${customerEmail}', '${customerMobileNumber}')
        `;

        const customerResult = await dbQuery(customerInsertQuery);
        customerId = customerResult?.insertId;
      }

      // Create a random 6 digit OTP and place it in the otp table and get the otpId

      const otp = Math.floor(100000 + Math.random() * 900000);
      const otpInsertQuery = `
        INSERT INTO otps (code, status)
        VALUES (${otp}, 'created')
      `;

      const otpResult = await dbQuery(otpInsertQuery);
      const otpId = otpResult?.insertId;

      const currentDate = new Date();
      const formattedDate = currentDate
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");

      // Create the order using customerId, machineId, and otpId with status "created" and get the orderId
      const orderInsertQuery = `
        INSERT INTO orders (customerId, timestamp, machineId, otpId, status)
        VALUES (${customerId}, '${formattedDate}', ${machineId}, ${otpId}, 'created')
      `;

      const orderResult = await dbQuery(orderInsertQuery);
      const orderId = orderResult?.insertId;

      // Assign the "empty" lockers to the parcels using machineLockers table and get the machineLockerId
      const assignLockersQuery = `
        SELECT machineLockerId
        FROM machineLockers
        WHERE machineId = ${machineId} AND lockerStatus = 'empty'
        LIMIT ${barcodeNumbers.length}
      `;
      const assignLockersResult = await dbQuery(assignLockersQuery);
      const machineLockerIds = assignLockersResult.map(
        (locker) => locker.machineLockerId
      );
      // Update the machineLockers table to set the lockerStatus to "occupied" for the assigned lockers
      const updateLockersQuery = `
        UPDATE machineLockers
        SET lockerStatus = 'occupied'
        WHERE machineLockerId IN (${machineLockerIds.join(", ")})
      `;
      await dbQuery(updateLockersQuery);

      // Create the parcels using orderId and machineLockerId with status "created" and get the parcelId
      const parcelInsertQuery = `
        INSERT INTO parcels (orderId, machineLockerId, barcodeNumber, status)
        VALUES ${barcodeNumbers
          .map(
            (barcodeNumber, index) =>
              `(${orderId}, ${machineLockerIds[index]}, '${barcodeNumber}', 'created')`
          )
          .join(", ")}
      `;

      await dbQuery(parcelInsertQuery);

      return {
        success: true,
        data: {},
      };
    } catch (error) {
      console.error("Error generating orders:", error);
      return {
        success: false,
        message: "An error occurred while generating orders.",
        error: error.message,
      };
    }
  },
};

module.exports = generateOrderService;
