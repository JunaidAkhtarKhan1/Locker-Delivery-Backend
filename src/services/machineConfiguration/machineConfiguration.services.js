const { dbQuery } = require("../../utils/dbFunctions");

const machineConfigurationService = {
  machineConfiguration: async (req, res) => {
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
      // Filter machineDetails to only include those with status: true
      // const filteredDetails = machineDetails.filter(
      //   (element) => element.status === true
      // );

      // If no entries to insert, return a message
      // if (filteredDetails.length === 0) {
      //   return {
      //     success: true,
      //     message: "No entries with status: true to insert.",
      //   };
      // }
      const insertPromises = machineDetails.map(async (element) => {
        const { columnId, status } = element;
        // console.log(element);

        // Validate columnId and status
        if (columnId === undefined) {
          throw new Error("Please provide ColumnId");
        }
        if (status === undefined) {
          throw new Error("Please provide status");
        }
        const getQuery = `SELECT status FROM columnprice WHERE columnId = ${columnId} AND machineId = ${machineId}`;
        const getColumnPrice = await dbQuery(getQuery);
        // console.log(getColumnPrice[0].status);
        if (getColumnPrice.length > 0) {
          if (getColumnPrice[0].status != status) {
            // console.log("Updated");
            const updateStatus = `UPDATE columnprice SET status = ${status} WHERE columnId = ${columnId} AND machineId = ${machineId};`;
            return await dbQuery(updateStatus);
          }

          // console.log("Already Exist");
        } else {
          // Prepare the SQL query

          const query = `INSERT INTO columnprice(
            machineId,
            columnId,
            status
            )
            VALUES (
              ${machineId},
              ${columnId},
              ${status}
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

module.exports = machineConfigurationService;
