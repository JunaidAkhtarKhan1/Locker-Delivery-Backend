const machineSignupService = require("../../services/authentication/machineSignup.services");

exports.machineSignup = async (req, res) => {
    try {
        const result = await machineSignupService.machineSignup(req, res);
        return res.status(result.success ? 200 : 400).send(result);
    }
    catch (error) {
        res.status(500).send({ success: false, message: error });
    }
};
