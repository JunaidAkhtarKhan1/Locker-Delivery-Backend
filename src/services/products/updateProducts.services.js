const multer = require("multer");
const {
  dbQuery,
  initializeBlobService,
  generateUniqueBlobName,
  generateBlobUrl,
} = require("../../utils/dbFunctions");

const containerName = process.env.CONTAINERNAME;
// const blobService = initializeBlobService();
const upload = multer({ storage: multer.memoryStorage() });

const blobUpdateService = {
  handleFileUpload(req, res) {
    return new Promise((resolve, reject) => {
      upload.single("file")(req, res, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  },

  async uploadToBlob(file, productName, productId) {
    if (!productId) {
      throw new Error("Product ID is required");
    }

    try {
      // First check if product exists
      const checkQuery = `SELECT * FROM products WHERE productId = "${productId}"`;
      const product = await dbQuery(checkQuery);

      if (!product || product.length === 0) {
        throw new Error("Product not found");
      }

      const blobName = generateUniqueBlobName(file.originalname);

      return new Promise((resolve, reject) => {
        blobService.createBlockBlobFromText(
          containerName,
          blobName,
          file.buffer,
          { contentType: file.mimetype },
          async (err) => {
            if (err) {
              console.error("Error uploading to blob:", err);
              reject(err);
              return;
            }

            const imageUrl = generateBlobUrl(blobName);
            try {
              // Save to database
              const updateQuery = `
                UPDATE products 
                SET productUrl = "${imageUrl}",
                    productName = "${productName}"
                WHERE productId = "${productId}"`;

              const sqlResult = await dbQuery(updateQuery);

              resolve({
                success: true,
                message: "Product updated successfully",
                productId,
                productName,
                imageUrl,
                sqlResult,
                fileName: file.originalname,
                fileSize: file.size,
              });
            } catch (dbError) {
              console.error("Database error:", dbError);
              reject({
                success: false,
                message: "Error updating database",
                error: dbError.message,
              });
            }
          }
        );
      });
    } catch (error) {
      throw {
        success: false,
        message: error.message,
        error: error,
      };
    }
  },
};

module.exports = blobUpdateService;
