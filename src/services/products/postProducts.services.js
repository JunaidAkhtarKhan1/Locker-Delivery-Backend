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

const blobUploadService = {
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

  async uploadToBlob(file, productName) {
    if (!file || !productName) {
      throw new Error("File and product name are required");
    }

    const blobName = generateUniqueBlobName(file.originalname);

    return new Promise((resolve, reject) => {
      blobService.createBlockBlobFromText(
        containerName,
        blobName,
        file.buffer,
        { contentType: file.mimetype },
        async (err, result) => {
          if (err) {
            console.error("Error uploading to blob:", err);
            reject(err);
            return;
          }

          const imageUrl = generateBlobUrl(blobName);

          try {
            // Save to database
            const query = `
              INSERT INTO products(
                productUrl,
                productName  )
              VALUES(
                "${imageUrl}",
               "${productName}")`;
            const sqlResult = await dbQuery(query);

            resolve({
              success: true,
              message: "File uploaded and product saved successfully",
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
              message: "Error saving to database",
              error: dbError.message,
            });
          }
        }
      );
    });
  },
};

module.exports = blobUploadService;
