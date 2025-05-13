const { dbQuery } = require("../../utils/dbFunctions");

const updateColumnDetailsService = {
  updateColumnDetails: async (req, res) => {
    const machineId = req.query.machineId;
    const machineDetails = req.body.machineDetails;

    // Validate machineId
    if (!machineId) {
      return {
        success: false,
        message: "Please provide machineId",
      };
    }

    // Validate machineDetails
    if (!Array.isArray(machineDetails) || machineDetails.length === 0) {
      return {
        success: false,
        message: "Please provide machineDetails as an array",
      };
    }

    try {
      const insertPromises = machineDetails.map(async (element) => {
        const { columnId, status, productId, price } = element;
        // console.log(element);

        // Validate columnId and status
        if (columnId === undefined) {
          throw new Error("Please provide ColumnId");
        }
        if (status === undefined) {
          throw new Error("Please provide status");
        }
        if (productId === undefined) {
          throw new Error("Please provide productId");
        }
        if (price === undefined) {
          throw new Error("Please provide price");
        }
        const getQuery = `SELECT status, productId , price FROM columnprice WHERE columnId = ${columnId} AND machineId = ${machineId}`;
        const getColumnPrice = await dbQuery(getQuery);
        // console.log(getColumnPrice[0].status);
        if (getColumnPrice.length > 0) {
          if (getColumnPrice[0].status != status) {
            // console.log("Updated");
            const updateStatus = `UPDATE columnprice SET status = ${status} WHERE columnId = ${columnId} AND machineId = ${machineId}`;
            return await dbQuery(updateStatus);
          }

          // if (getColumnPrice[0].productId != productId) {
          //   // console.log("Updated Product");
          //   const updateProductId = `UPDATE columnprice SET productId = ${productId} WHERE columnId = ${columnId} AND machineId = ${machineId}`;
          //   return await dbQuery(updateProductId);
          // }

          // if (getColumnPrice[0].price != price) {
          //   // console.log("Updated Price");
          //   const updatePrice = `UPDATE columnprice SET price = ${price} WHERE columnId = ${columnId} AND machineId = ${machineId}`;
          //   return await dbQuery(updatePrice);
          // }
          // console.log("Already Exist");
        } else {
          // Prepare the SQL query
          const query = `INSERT INTO columnprice(
            machineId,
            columnId,
            status,
            productId,
            price
            )
            VALUES (
              ${machineId},
              ${columnId},
              ${status},
              ${productId},
              ${price}
              
              )`;
          // Execute the query
          return await dbQuery(query);
        }
      });

      // Wait for all insert operations to complete
      const results = await Promise.all(insertPromises);

      // Send success status
      return {
        success: true,
        message: "Machine configuration updated successfully",
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
  updateColumnDetailsAdmin: async (req, res) => {
    const machineId = req.query.machineId;
    const machineDetails = req.body.machineDetails;

    // Validate machineId
    if (!machineId) {
      return {
        success: false,
        message: "Please provide machineId",
      };
    }

    // Validate machineDetails
    if (!Array.isArray(machineDetails) || machineDetails.length === 0) {
      return {
        success: false,
        message: "Please provide machineDetails as an array",
      };
    }

    console.log(machineDetails);
    // let result;
    try {
      const insertPromises = machineDetails.map(async (element) => {
        const { columnId, status, productId, price } = element;
        let queryStatus = false;

        // Validate columnId and status
        if (columnId === undefined) {
          throw new Error("Please provide ColumnId");
        }
        if (productId === undefined) {
          throw new Error("Please provide productId");
        }
        if (price === undefined) {
          throw new Error("Please provide price");
        }
        const getQuery = `SELECT status, productId , price FROM columnprice WHERE columnId = ${columnId} AND machineId = ${machineId}`;
        const getColumnPrice = await dbQuery(getQuery);
        if (getColumnPrice.length > 0) {
          let updateLockerStatus = `UPDATE columnprice SET `;

          if (getColumnPrice[0].status != status && status != undefined) {
            updateLockerStatus = updateLockerStatus.concat(
              `status = ${status}`
            );
            queryStatus = true;
          }

          if (getColumnPrice[0].productId != productId) {
            if (queryStatus)
              updateLockerStatus = updateLockerStatus.concat(
                `, productId = ${productId} `
              );
            else
              updateLockerStatus = updateLockerStatus.concat(
                `productId = ${productId} `
              );
            queryStatus = true;
          }

          if (getColumnPrice[0].price != price) {
            if (queryStatus)
              updateLockerStatus = updateLockerStatus.concat(
                `, price = ${price} `
              );
            else
              updateLockerStatus = updateLockerStatus.concat(
                `price = ${price} `
              );
            queryStatus = true;
          }

          updateLockerStatus = updateLockerStatus.concat(
            `WHERE columnId = ${columnId} AND machineId = ${machineId}`
          );
          if (queryStatus) return await dbQuery(updateLockerStatus);
        } else {
          // Prepare the SQL query
          const query = `INSERT INTO columnprice(
            machineId,
            columnId,
            status,
            productId,
            price
            )
            VALUES (
              ${machineId},
              ${columnId},
              ${status},
              ${productId},
              ${price}
              
              )`;
          // Execute the query
          return await dbQuery(query);
        }
      });

      // Wait for all insert operations to complete
      const results = await Promise.all(insertPromises);

      // Send success status
      return {
        success: true,
        message: "Machine configuration updated successfully",
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

module.exports = updateColumnDetailsService;
