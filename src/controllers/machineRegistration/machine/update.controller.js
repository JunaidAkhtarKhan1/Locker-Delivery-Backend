const updateMachineService = require("../../../services/machineRegistration/machine/update.services");

exports.updateMachine = async (req, res) => {
    try {
        const { permissionArray, companyId } = req.user;

        let result = {};

        if (permissionArray.includes('admin')) {
            result = await updateMachineService.updateMachine(req, res);
        }
        // else if (permissionArray.includes('admin')) {
        //     const companyId = req.query.companyId;
        //     result = await updateMachineService.updateMachine(req, res, companyId);
        // }
        else
            result = { success: false, message: "Permission access denied" }

        return res.status(result.success ? 200 : 400).send(result);
    }
    catch (error) {
        res.status(500).send({ success: false, message: error });
    }
};