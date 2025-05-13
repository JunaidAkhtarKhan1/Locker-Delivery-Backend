const cashSaleService = require("../../services/cashSale/cashSale.services");

exports.postCashSale = async (req, res) => {
  try {
    const { permissionArray, companyId } = req.user;
    // console.log(companyId);

    let result = {};

    // const companyId = req.query.companyId;
    result = await cashSaleService.postCashSale(req, res, companyId);
    // if (permissionArray.includes("admin")) {
    // } else result = { success: false, message: "Permission access denied" };

    return res.status(result.success ? 200 : 400).send(result);
  } catch (error) {
    res.status(500).send({ success: false, message: error });
  }
};
