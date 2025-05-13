const machineService = require("../../../services/dashboard/filters/machines.services");

exports.machines = async (req, res) => {
    try {
        const result = await machineService.machines(req, res);
        return res.status(result.success ? 200 : 400).send(result);
    }
    catch (error) {
        res.status(500).send({ success: false, message: error });
    }
};
