const filterService = require("../../../services/dashboard/filters/filters.services");

exports.filters = async (req, res) => {
    try {
        const result = await filterService.filters(req, res);
        return res.status(result.success ? 200 : 400).send(result);
    }
    catch (error) {
        res.status(500).send({ success: false, message: error });
    }
};
