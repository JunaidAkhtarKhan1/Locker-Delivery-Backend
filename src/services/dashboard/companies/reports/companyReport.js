const { start } = require('pm2');
const { dbQuery } = require('../../../../utils/dbFunctions');

const companyReportService = {
    companyReport: async (req, res, companyId) => {

        let startDate = req.body.startDate;
        let endDate = req.body.endDate;
        let machineId = req.body.machineId;

        if (startDate === undefined) {
            const startMonthDate = new Date(Date.now() + 18000000)
                .toISOString()
                .slice(0, 8)
                .replace("T", " ");

            const dateToday = new Date(Date.now() + 18000000)
                .toISOString()
                .slice(0, 10)
                .replace("T", " ");

            startDate = startMonthDate + '01';
            endDate = dateToday;
        }

        let query =
            `SELECT orderId,
                companyName,
                machineName,
                paymentName,
                price,
                transactionStatus,
                userMobileNumber,
                transactionType,
                timestamp
            FROM orders
            INNER JOIN paymentmodes USING (paymentId)
            INNER JOIN paymentmethods USING (paymentMethodId)
            INNER JOIN machines USING (machineId)
            INNER JOIN companies USING (companyId)
            LEFT JOIN users USING (userId)
            WHERE companyId = ${companyId} AND
                transactionStatus IN ('approved', 'complete') AND
                (timestamp >= '${startDate} 00:00:00' AND 
                timestamp <= '${endDate} 23:59:59')
            ORDER BY orderId`;

        console.log(query);

        const result = await dbQuery(query);

        return {
            success: true,
            result,
            message: "Company Reports"

        }
    },
    companyPaymentReport: async (req, res, companyId) => {

        let startDate = req.body.startDate;
        let endDate = req.body.endDate;
        let machineId = req.body.machineId;

        if (startDate === undefined) {
            const startMonthDate = new Date(Date.now() + 18000000)
                .toISOString()
                .slice(0, 8)
                .replace("T", " ");

            const dateToday = new Date(Date.now() + 18000000)
                .toISOString()
                .slice(0, 10)
                .replace("T", " ");

            startDate = startMonthDate + '01';
            endDate = dateToday;
        }

        let query =
            `SELECT CAST(orders.timestamp AS DATE) AS date,
                COUNT(orders.orderId) AS dailyOrders,
                SUM(rfidorders.deductCompanyBalance) AS dailyCompanyAmount
            FROM orders
            INNER JOIN paymentmodes USING (paymentId)
            INNER JOIN paymentmethods USING (paymentMethodId)
            INNER JOIN machines USING (machineId)
            INNER JOIN companies c USING (companyId)
            LEFT JOIN rfidorders USING (orderId)
            WHERE c.companyId = ${companyId} AND
                transactionStatus IN ('approved', 'complete') AND
                paymentName = 'rfid' AND
                transactionType IN ('debit-both', 'debit-company','debit-recharge') AND
                (timestamp >= '${startDate} 00:00:00' AND 
                timestamp <= '${endDate} 23:59:59')
            GROUP BY CAST(orders.timestamp AS DATE)`;

        const result = await dbQuery(query);

        let totalOrders = 0;
        let totalCompanyAmount = 0;

        for (const element of result) {
            totalOrders += element.dailyOrders;
            totalCompanyAmount += element.dailyCompanyAmount;
        }

        return {
            success: true,
            totalOrders,
            totalCompanyAmount,
            result,
            message: "Company Reports"

        }
    },
    companyRfidReport: async (req, res) => {

        let startDate = req.body.startDate;
        let endDate = req.body.endDate;
        let companyId = req.body.companyId;
        let machineId = req.body.machineId;

        if (startDate === undefined) {
            const startMonthDate = new Date(Date.now() + 18000000)
                .toISOString()
                .slice(0, 8)
                .replace("T", " ");

            const dateToday = new Date(Date.now() + 18000000)
                .toISOString()
                .slice(0, 10)
                .replace("T", " ");

            startDate = startMonthDate + '01';
            endDate = dateToday;
        }

        let query =
            `SELECT orderId,
                companyName,
                machineName,
                paymentName,
                price,
                transactionStatus,
                transactionType,
                deductRechargeBalance,
                deductCompanyBalance,
                timestamp
            FROM orders
            INNER JOIN paymentmodes USING (paymentId)
            INNER JOIN paymentmethods USING (paymentMethodId)
            INNER JOIN machines USING (machineId)
            INNER JOIN companies c USING (companyId)
            LEFT JOIN rfidorders USING (orderId)
            WHERE c.companyId = ${companyId} AND
                transactionStatus IN ('approved', 'complete') AND
                paymentName = 'rfid' AND
                transactionType IN ('debit-both', 'debit-company','debit-recharge') AND
                (timestamp >= '${startDate} 00:00:00' AND 
                timestamp <= '${endDate} 23:59:59')
            ORDER BY orderId`;

        const result = await dbQuery(query);
        let totalCompanyAmount = 0;
        let totalRechargeAmount = 0;

        for (const element of result) {
            const type = typeof (element.deductCompanyBalance);
            if (type === 'number') {
                totalCompanyAmount += element.deductCompanyBalance;
                totalRechargeAmount += element.deductRechargeBalance;
            }
        }

        return {
            success: true,
            totalOrders: result.length,
            totalCompanyAmount,
            totalRechargeAmount,
            result,
            message: "Company Reports"

        }
    },
    staffReportDownload: async (req, res, companyId) => {

        let startDate = req.body.startDate;
        let endDate = req.body.endDate;
        let machineId = req.body.machineId;

        if (startDate === undefined) {
            const startMonthDate = new Date(Date.now() + 18000000)
                .toISOString()
                .slice(0, 8)
                .replace("T", " ");

            const dateToday = new Date(Date.now() + 18000000)
                .toISOString()
                .slice(0, 10)
                .replace("T", " ");

            startDate = startMonthDate + '01';
            endDate = dateToday;
        }

        let query =
            `SELECT CAST(orders.timestamp AS DATE) AS date,
                COUNT(orders.orderId) AS dailyOrders,
                SUM(rfidorders.deductCompanyBalance) AS dailyCompanyAmount
            FROM orders
            INNER JOIN paymentmodes USING (paymentId)
            INNER JOIN paymentmethods USING (paymentMethodId)
            INNER JOIN machines USING (machineId)
            INNER JOIN companies c USING (companyId)
            LEFT JOIN rfidorders USING (orderId)
            WHERE c.companyId = ${companyId} AND
                transactionStatus IN ('approved', 'complete') AND
                paymentName = 'rfid' AND
                transactionType IN ('debit-both', 'debit-company','debit-recharge') AND
                (timestamp >= '${startDate} 00:00:00' AND 
                timestamp <= '${endDate} 23:59:59')
            GROUP BY CAST(orders.timestamp AS DATE)`;

        const result = await dbQuery(query);

        let totalOrders = 0;
        let totalCompanyAmount = 0;

        for (const element of result) {
            totalOrders += element.dailyOrders;
            totalCompanyAmount += element.dailyCompanyAmount;
        }

        return {
            success: true,
            totalOrders,
            totalCompanyAmount,
            result,
            message: "Company Reports"

        }
    },
};

module.exports = companyReportService;
