const postPaymentService = require("../../services/payments/postPayment.services");
const { encrypt, decrypt } = require("../../utils/functions");
const request = require("request");

exports.maWithoutEncryption = async (req, res) => {
  var internetAvailable = require("internet-available");

  try {
    const internetCheck = await internetAvailable();
    console.log(internetCheck);

    console.log("MA API");
    console.log(req.body);
    // body = {
    //     orderId: '1',
    //     storeId: '21207',
    //     transactionId: '4468820',
    //     transactionDateTime: '24/11/2022 12:21 PM',
    //     responseCode: '0000',
    //     responseDesc: 'SUCCESS'
    // }
    // setTimeout(() => {
    //     return res.status(200).send(body);
    // }, 5000);

    const testCredentials =
      "UmVnYWxJbnNpZ25pYTpmNTAwZjFmMjU2YTkxZDljZTUyNzcyMWNhMGJkNTc5";

    const options = {
      method: "POST",
      url: "https://easypaystg.easypaisa.com.pk/easypay-service/rest/v4/initiate-ma-transaction",
      headers: {
        Credentials: testCredentials,
      },
      body: {
        orderId: "1",
        storeId: "21207",
        transactionAmount: req.body.transactionAmount,
        transactionType: req.body.transactionType,
        mobileAccountNo: req.body.mobileAccountNo,
        emailAddress: req.body.emailAddress,
        // mobileAccountNo: '03481704079',
        // emailAddress: 'muhammad.taimur@telenorbank.pk'
      },
      json: true,
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      console.log(body);
      return res.status(200).send(body);
    });
  } catch (error) {
    console.log("No internet");
    return res.status(500).send("No Internet");
  }
};
