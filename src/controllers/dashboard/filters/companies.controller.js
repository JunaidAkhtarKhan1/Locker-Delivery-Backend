const companiesService = require("../../../services/dashboard/filters/companies.services");

exports.companies = async (req, res) => {
    try {
        const result = await companiesService.companies(req, res);
        return res.status(result.success ? 200 : 403).send(result);
    }
    catch (error) {
        res.status(500).send({ success: false, message: error });
    }
};
