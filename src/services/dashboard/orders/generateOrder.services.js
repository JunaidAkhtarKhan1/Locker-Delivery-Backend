const { dbQuery } = require("../../../utils/dbFunctions");

const generateOrderService = {
  generateOrders: async (req, res, companyId) => {
    try {
      const columnPriceIds = req.body.columnPriceIds; // Expecting an array of IDs in the request body

      // Validate the input
      if (!Array.isArray(columnPriceIds) || columnPriceIds.length === 0) {
        return {
          success: false,
          message: "Invalid input. Please provide an array of columnPriceIds.",
        };
      }

      // Create a string of placeholders for the query
      const query = `SELECT * FROM columnprice WHERE columnPriceId IN (${columnPriceIds})`;

      // Execute the query with the array of IDs
      const result = await dbQuery(query, columnPriceIds);
      const totalPrice = result.reduce((sum, item) => sum + item.price, 0);

      const currentDate = new Date();
      const formattedDate = currentDate
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      const transactionStatus = "pending";
      // Insert the order into the orders table
      const insertQuery = `INSERT INTO orders (price, transactionStatus, timestamp) 
      VALUES (${totalPrice},"${transactionStatus}", "${formattedDate}")`;
      await dbQuery(insertQuery, [
        totalPrice,
        transactionStatus,
        formattedDate,
      ]);
      const orderIdQuery = `SELECT LAST_INSERT_ID() AS orderId`;
      const orderIdResult = await dbQuery(orderIdQuery);
      const orderId = orderIdResult[0].orderId; // Get the generated orderId

      const insertCartQuery = `INSERT INTO shoppingcart (orderId, columnPriceId) VALUES `;
      const values = columnPriceIds
        .map((columnPriceId) => `(${orderId}, ${columnPriceId})`)
        .join(", ");
      const finalInsertQuery = insertCartQuery + values;

      // Execute the single insert query
      await dbQuery(finalInsertQuery);
      // Return the response with total price, timestamp, and transaction status
      return {
        success: true,
        data: {
          result,
          totalPrice,
          orderDate: formattedDate, // Include the formatted order date in the response
          transactionStatus, // Include the transaction status in the response
          orderId, // Include the generated orderId in the response
        },
      };
    } catch (error) {
      console.error("Error generating orders:", error);
      return {
        success: false,
        message: "An error occurred while generating orders.",
      };
    }
  },
};

module.exports = generateOrderService;
