const { dbQuery } = require("../../utils/dbLive");

const urlQRService = {
    urlQR: async (req, res) => {
        return new Promise(async (resolve, reject) => {
            const orderHash = req.params.id;

            let obj = {
            };

            if (orderHash) {

                const query =
                    `SELECT *
                    FROM iframes
                    WHERE orderHash = '${orderHash}'`;

                const urlDB = await dbQuery(query);
                console.log(urlDB);

                console.log(urlDB.length);

                if (urlDB.length) {
                    console.log("true");
                    obj.success = true;
                    obj.url = urlDB[0]?.url;
                }
                else obj.success = false;

            }

            resolve(obj);
        });
    },
};

module.exports = urlQRService;
