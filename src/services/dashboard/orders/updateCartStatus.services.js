const { dbQuery } = require("../../../utils/dbFunctions");

const updateCartStatusService = {
  updateCartStatus: async (req, res) => {
    const orderId = req.body.orderId;
    const products = req.body.products;

    // Validate products
    if (!Array.isArray(products) || products.length === 0) {
      return {
        success: false,
        message: "Please provide products as an array",
      };
    }

    try {
      const insertPromises = products.map(async (element) => {
        const { columnPriceId, dispense } = element;

        // Validate columnPriceId and status
        if (columnPriceId === undefined) {
          throw new Error("Please provide columnPriceId");
        }
        if (dispense === undefined) {
          throw new Error("Please provide dispense");
        }
        const getQuery = `SELECT  columnPriceId , orderId, status FROM shoppingcart WHERE orderId = ${orderId}`;
        const getCartStatus = await dbQuery(getQuery);
        // console.log(getColumnPrice[0].status);
        if (getCartStatus.length > 0) {
          if (getCartStatus[0].dispense != dispense) {
            // console.log("Updated");
            const updateStatus = `UPDATE shoppingcart SET status = '${dispense}' WHERE orderId = ${orderId} AND columnPriceId = ${columnPriceId} `;
            return await dbQuery(updateStatus);
          }
        }
      });
      await Promise.all(insertPromises);

      // get updated dispense statuses
      const getDispenseQuery = `SELECT status FROM shoppingcart WHERE orderId = ${orderId}`;
      const updatedStatuses = await dbQuery(getDispenseQuery);
      // console.log("updated Status", updatedStatuses);

      // Extract all dispense values
      const dispenseValues = updatedStatuses.map((row) => row.status);
      // console.log("dispense ", dispenseValues);

      // Determine transactionStatus
      let transactionStatus;
      // console.log(transactionStatus);

      if (dispenseValues.length === 0) {
        transactionStatus = "unknown"; // Handle edge case where no statuses exist
      } else if (dispenseValues.every((status) => status === "completed")) {
        transactionStatus = "completed";
      } else if (dispenseValues.every((status) => status === "failed")) {
        transactionStatus = "failed";
      } else if (
        dispenseValues.includes("completed") &&
        dispenseValues.includes("failed")
      ) {
        transactionStatus = "partially completed";
      } else {
        transactionStatus = "processing"; // Default fallback for mixed/in-progress states
      }

      // console.log("Final Transaction Status:", transactionStatus);

      // Update orders table
      const updateOrderStatus = `UPDATE orders SET transactionStatus = '${transactionStatus}' WHERE orderId = ${orderId}`;
      const orderStatus = await dbQuery(updateOrderStatus); // Wait for all insert operations to complete
      console.log(updateOrderStatus);

      const results = await Promise.all(insertPromises);

      // Send success status
      return {
        success: true,
        message: "Shopping Cart Status updated successfully",
        results,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message:
          error.message || "An error occurred while processing your request",
      };
    }
  },
};

module.exports = updateCartStatusService;
