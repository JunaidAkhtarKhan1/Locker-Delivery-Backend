const urlQRService = require("../../services/urlQR/urlQR.services");

exports.urlQR = async (req, res) => {
    try {
        const result = await urlQRService.urlQR(req, res);
        return res.status(result.success ? 200 : 400).redirect(result.url);
    }
    catch (error) {
        res.status(500).send({ success: false, message: error });
    }
};
