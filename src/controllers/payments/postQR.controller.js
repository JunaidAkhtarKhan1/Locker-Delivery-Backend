// const postPaymentService = require("../../services/payments/postPayment.services");
const { encrypt, decrypt } = require('../../utils/functions');
const requestLib = require('request');

exports.qrWithEncryption = async (req, res) => {
    var internetAvailable = require("internet-available");


    try {
        const internetCheck = await internetAvailable();
        console.log(internetCheck);

        console.log("QR API");
        console.log(req.body);

        const testCredentials = "UmVnYWxJbnNpZ25pYTpmNTAwZjFmMjU2YTkxZDljZTUyNzcyMWNhMGJkNTc5";
        // const request = {
        //     "storeId": "21207",
        //     "paymentMethod": "QR_PAYMENT_METHOD",
        //     "orderRefNum": "1",
        //     "amount": "10",
        //     "transactionPointNum": "",
        //     "productNumber": ""
        // }
        const request = {
            "storeId": "21207",
            "paymentMethod": req.body.transactionType,
            "orderRefNum": "1",
            "amount": req.body.transactionAmount,
            "transactionPointNum": "",
            "productNumber": ""
        }
        const signature = await encrypt(JSON.stringify(request));

        const options = {
            method: 'POST',
            url: 'https://easypaystg.easypaisa.com.pk/easypay-service/rest/QRBusinessRestService/v1/generate-qr',
            headers: {
                Credentials: testCredentials,
            },
            body: {
                request,
                signature
            },
            json: true
        };

        requestLib(options, async (error, response, body) => {
            if (error) throw new Error(error);
            console.log(body);
            return res.status(200).send(body);
        });

    } catch (error) {
        console.log("No internet");
        return res.status(500).send("No Internet");
    }
};