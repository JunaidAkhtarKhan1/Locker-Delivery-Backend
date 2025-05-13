const { dbQuery } = require("../../utils/dbFunctions");

const deleteUserService = {
  deleteUser: async (req, res, companyId) => {
    const adminUserId = req.body.id;
    console.log(adminUserId);

    if (adminUserId === undefined) {
      return {
        success: false,
        message: "Please provide adminUserId",
      };
    }

    const query = `DELETE
            FROM adminusers
            WHERE adminUserId = ${adminUserId}`;

    const result = await dbQuery(query);

    return {
      success: true,
      message: "adminUser is deleted successfully",
      result,
    };
  },
};

module.exports = deleteUserService;
