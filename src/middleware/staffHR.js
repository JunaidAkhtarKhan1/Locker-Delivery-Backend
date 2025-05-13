
module.exports = (req, res, next) => {
    if (req.user.permissionArray.includes('staffHR')) next();
    else return res.status(403).send({
        success: false,
        message: 'Permission access denied'
    });
}