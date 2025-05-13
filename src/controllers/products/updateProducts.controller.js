const blobUpdateService = require("../../services/products/updateProducts.services");

exports.uploadFile = async (req, res) => {
  try {
    const { permissionArray } = req.user;

    // Check permissions
    if (
      !permissionArray.includes("admin") &&
      !permissionArray.includes("superAdmin") &&
      !permissionArray.includes("partner")
    ) {
      return res.status(403).json({
        success: false,
        message: "Permission access denied",
      });
    }

    // Handle file upload
    await blobUpdateService.handleFileUpload(req, res);

    // Validate request
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    if (!req.body.productName) {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }

    if (!req.body.productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Upload to blob storage and update database
    const result = await blobUpdateService.uploadToBlob(
      req.file,
      req.body.productName,
      req.body.productId
    );

    res.status(200).json(result);
  } catch (error) {
    console.error("Upload controller error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
