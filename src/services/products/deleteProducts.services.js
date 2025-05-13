const { dbQuery } = require("../../utils/dbFunctions");

const deleteProductsService = {
  deleteProducts: async (req, res, companyId) => {
    const { productId } = req.body;

    if (productId === undefined) {
      return {
        success: false,
        message: "Please provide productId",
      };
    }

    const query = `DELETE
            FROM products
            WHERE productId = ${productId}`;

    const result = await dbQuery(query);

    return {
      success: true,
      message: "Products is deleted successfully",
      result,
    };
  },
};

module.exports = deleteProductsService;
