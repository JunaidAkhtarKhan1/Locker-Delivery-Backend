const blobUploadService = require("../../services/products/postProducts.services");

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
    await blobUploadService.handleFileUpload(req, res);

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

    // Upload to blob storage
    const result = await blobUploadService.uploadToBlob(
      req.file,
      req.body.productName
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
