const { dbQuery } = require("../../utils/dbFunctions");

const androidPollingService = {
  androidPolling: async (req, res) => {
    const { FunCode, MachineID } = req.body;

    const timestamp = new Date(Date.now() + 18000000)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    if (FunCode === "1000") {
      const {
        TradeNo,
        SlotNo,
        Status,
        Quantity,
        Stock,
        Capacity,
        ProductID,
        Name,
        Price,
        SPrice,
        Type,
        Introduction,
        ModifyType,
        LockGoodsCount,
      } = req.body;

      const query = `SELECT * FROM androidpolling
                      WHERE funCode='${FunCode}'
                      AND machineId='${MachineID}' 
                      AND slotNo='${SlotNo}'
                      AND productId='${ProductID}'
                      ORDER BY androidPollingId DESC
                      LIMIT 1;`;

      const result = await dbQuery(query);

      if (result.length > 0) {
        const androidPollingId = result[0].androidPollingId;
        const queryUpdate = `UPDATE androidpolling
                              SET timestamp='${timestamp}',
                                funCode='${FunCode}',
                                machineId='${MachineID}',
                                tradeNo='${TradeNo}',
                                slotNo='${SlotNo}',
                                status='${Status}',
                                quantity='${Quantity}',
                                stock='${Stock}',
                                capacity='${Capacity}',
                                productId='${ProductID}',
                                name='${Name}',
                                price='${Price}',
                                sPrice='${SPrice}',
                                type='${Type}',
                                introduction='${Introduction}',
                                modifyType='${ModifyType}',
                                lockGoodsCount='${LockGoodsCount}'
                              WHERE androidPollingId=${androidPollingId}`;
        const resultUpdate = await dbQuery(queryUpdate);
        console.log("FunCode 1000 Updated");
      } else {
        const queryPoll = `INSERT INTO androidpolling(
                         timestamp,
                         funCode,
                         machineId,
                         tradeNo,
                         slotNo,
                         status,
                         quantity,
                         stock,
                         capacity,
                         productId,
                         name,
                         price,
                         sPrice,
                         type,
                         introduction,
                         modifyType,
                         lockGoodsCount
                         )
                        VALUES (
                        '${timestamp}',
                        '${FunCode}',
                        '${MachineID}',
                        '${TradeNo}',
                        '${SlotNo}',
                        '${Status}',
                        '${Quantity}',
                        '${Stock}',
                        '${Capacity}',
                        '${ProductID}',
                        '${Name}',
                        '${Price}',
                        '${SPrice}',
                        '${Type}',
                        '${Introduction}',
                        '${ModifyType}',
                        '${LockGoodsCount}'
                        )`;
        const resultPoll = await dbQuery(queryPoll);
        console.log("FunCode 1000 Inserted");
      }

      const response = {
        Status: "0",
        SlotNo,
        TradeNo,
        Err: "success",
        ImageUrl: "",
        ImageDetailUrl: "",
      };
      console.log(response);
      return response;
    }

    //We need to check if function code is 4000 and machineId matched with db recent value.
    if (FunCode === "4000") {
      const query = `SELECT * FROM orders
                      JOIN paymentmodes USING (paymentId)
                      JOIN machines USING (machineId)
                      WHERE machineSerialId = '${MachineID}'
                      ORDER BY orderId desc
                    LIMIT 1;`;

      const resultRead = await dbQuery(query);
      const result = resultRead[0];
      console.log(result);

      if (result?.transactionStatus === "approved") {
        const queryPoll = `INSERT INTO androidpolling(
                            timestamp,
                            funCode,
                            machineId
                            )
                          VALUES (
                          '${timestamp}',
                          '${FunCode}',
                          '${MachineID}'
                          )`;

        const resultPoll = await dbQuery(queryPoll);
        // console.log(result);
        const { orderId, productId, price } = result;

        const updateQuery = `UPDATE orders
                            SET transactionStatus = 'dispensed'
                            WHERE orderId=${orderId}`;

        const updateResult = await dbQuery(updateQuery);

        const tradeNo = "00000" + orderId.toString();
        console.log(tradeNo);

        //if the payment is successful
        const response = {
          Status: "0",
          MsgType: "0",
          TradeNo: tradeNo,
          SlotNo: productId,
          ProductID: productId,
          Err: "Succeeded",
        };

        console.log(response);
        return response;
      }
      if (result?.transactionStatus === "rejected") {
        const { orderId, productId, price } = result;

        const tradeNo = "00000" + orderId.toString();

        //if the payment is successful
        const response = {
          Status: "1",
          MsgType: "0",
          TradeNo: tradeNo,
          SlotNo: productId,
          ProductID: productId,
          Price: price,
          Err: "Failed",
        };

        console.log(response);
        return response;
      }
      return {
        Status: "1",
        MsgType: "0",
        Err: "Failed",
      };
    }

    if (FunCode === "5000") {
      const {
        PayType,
        TradeNo,
        SlotNo,
        Status,
        Time,
        Amount,
        ProductID,
        Name,
        Type,
        Quantity,
      } = req.body;

      const orderId = parseInt(TradeNo.substring(5));
      console.log(orderId);

      const queryPolling = `INSERT INTO androidpolling(
        timestamp,
        funCode,
        machineId,
        payType,
        tradeNo,
        slotNo,
        status,
        time,
        amount,
        quantity,
        productId,
        name,
        type
        )
       VALUES ('${timestamp}',
       '${FunCode}',
       '${MachineID}',
       '${PayType}',
       '${TradeNo}',
       '${SlotNo}',
       '${Status}',
       '${Time}',
       '${Amount}',
       '${Quantity}',
       '${ProductID}',
       '${Name}',
       '${Type}'
       )`;

      const resultPolling = await dbQuery(queryPolling);

      //if the payment is successful
      if (Status === "0") {
        const updateQuery = `UPDATE orders
                            SET transactionStatus = 'complete'
                            WHERE orderId=${orderId}`;

        const updateResult = await dbQuery(updateQuery);
        console.log(updateResult);
      }

      //if the payment is failed
      else if (Status === "1") {
        const updateQuery = `UPDATE orders
                            SET transactionStatus = 'failed'
                            WHERE orderId=${orderId}`;

        const updateResult = await dbQuery(updateQuery);
        console.log(updateResult);
      }

      return {
        Status: "0",
        TradeNo,
        SlotNo,
        Err: "Succeeded",
      };
    }

    return {
      success: false,
      message: "cannot parse body of the request",
      req: req.body,
    };
  },
};

module.exports = androidPollingService;
