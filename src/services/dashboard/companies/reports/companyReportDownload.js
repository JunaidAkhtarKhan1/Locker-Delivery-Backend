const { dbQuery } = require("../../../../utils/dbFunctions");
const fs = require("fs");
var pdf = require("pdf-creator-node");

const companyReportService = {
  staffReportDownload: async (req, res, companyId) => {
    let startDate = req.body.startDate;
    let endDate = req.body.endDate;

    const companyResult = await dbQuery(`SELECT *
        FROM companies
        INNER JOIN machines USING (companyId)
        WHERE companyId=${companyId};`);

    const { companyName } = companyResult[0];
    const totalMachines = companyResult.length;

    if (startDate === undefined) {
      const startMonthDate = new Date(Date.now() + 18000000)
        .toISOString()
        .slice(0, 8)
        .replace("T", " ");

      const dateToday = new Date(Date.now() + 18000000)
        .toISOString()
        .slice(0, 10)
        .replace("T", " ");

      startDate = startMonthDate + "01";
      endDate = dateToday;
    }

    let query = `SELECT CAST(orders.timestamp AS DATE) AS date,
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
                transactionType IN ('debit-both', 'debit-company') AND
                (timestamp >= '${startDate} 00:00:00' AND 
                timestamp <= '${endDate} 23:59:59')
            GROUP BY CAST(orders.timestamp AS DATE)`;

    const result = await dbQuery(query);

    // const result = [
    //     {
    //         date: new Date("2023-07-01"),
    //         dailyOrders: 7,
    //         dailyCompanyAmount: 85
    //     },
    //     {
    //         date: new Date("2023-07-02"),
    //         dailyOrders: 3,
    //         dailyCompanyAmount: 40
    //     },
    //     {
    //         date: new Date("2023-07-03"),
    //         dailyOrders: 5,
    //         dailyCompanyAmount: 130
    //     },
    //     {
    //         date: new Date("2023-07-04"),
    //         dailyOrders: 2,
    //         dailyCompanyAmount: 70
    //     },
    //     {
    //         date: new Date("2023-07-05"),
    //         dailyOrders: 1,
    //         dailyCompanyAmount: 20
    //     },
    //     {
    //         date: new Date("2023-07-06"),
    //         dailyOrders: 7,
    //         dailyCompanyAmount: 85
    //     },
    //     {
    //         date: new Date("2023-07-07"),
    //         dailyOrders: 3,
    //         dailyCompanyAmount: 40
    //     },
    //     {
    //         date: new Date("2023-07-08"),
    //         dailyOrders: 5,
    //         dailyCompanyAmount: 130
    //     },
    //     {
    //         date: new Date("2023-07-09"),
    //         dailyOrders: 2,
    //         dailyCompanyAmount: 70
    //     },
    //     {
    //         date: new Date("2023-07-10"),
    //         dailyOrders: 1,
    //         dailyCompanyAmount: 20
    //     },
    //     {
    //         date: new Date("2023-07-11"),
    //         dailyOrders: 7,
    //         dailyCompanyAmount: 85
    //     },
    //     {
    //         date: new Date("2023-07-12"),
    //         dailyOrders: 3,
    //         dailyCompanyAmount: 40
    //     },
    //     {
    //         date: new Date("2023-07-13"),
    //         dailyOrders: 5,
    //         dailyCompanyAmount: 130
    //     },
    //     {
    //         date: new Date("2023-07-14"),
    //         dailyOrders: 2,
    //         dailyCompanyAmount: 70
    //     },
    //     {
    //         date: new Date("2023-07-15"),
    //         dailyOrders: 1,
    //         dailyCompanyAmount: 20
    //     },
    //     {
    //         date: new Date("2023-07-16"),
    //         dailyOrders: 7,
    //         dailyCompanyAmount: 85
    //     },
    //     {
    //         date: new Date("2023-07-17"),
    //         dailyOrders: 3,
    //         dailyCompanyAmount: 40
    //     },
    //     {
    //         date: new Date("2023-07-18"),
    //         dailyOrders: 5,
    //         dailyCompanyAmount: 130
    //     },
    //     {
    //         date: new Date("2023-07-19"),
    //         dailyOrders: 2,
    //         dailyCompanyAmount: 70
    //     },
    //     {
    //         date: new Date("2023-07-20"),
    //         dailyOrders: 1,
    //         dailyCompanyAmount: 20
    //     }
    // ]

    let totalOrders = 0;
    let totalCompanyAmount = 0;
    let serialNumber = 0;

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    for (const element of result) {
      // Format the date as "MMM DD, YYYY"
      const month = monthNames[element.date.getMonth()];
      const formattedDate = `${month} ${element.date.getDate()}, ${element.date.getFullYear()}`;
      element.newDate = formattedDate;
      serialNumber += 1;
      element.serialNumber = serialNumber;
      totalOrders += element.dailyOrders;
      totalCompanyAmount += element.dailyCompanyAmount;
    }

    console.log(result);

    var html = fs.readFileSync("index.html", "utf8");

    // Define the data to be passed to the template
    const data = {
      name: "John Doe",
      age: 30,
      occupation: "Developer",
    };

    // var options = {
    //     format: "A4",
    //     orientation: "portrait",
    //     border: "20mm", // Add space to the page border
    //     header: {
    //         height: "40mm", // Adjust the header height
    //         contents: `
    //         <div style="text-align: center;">
    //           <h3>Header Content</h3>
    //           <p>Add your header content here</p>
    //         </div>
    //       `,
    //     },
    //     footer: {
    //         height: "25mm", // Adjust the footer height
    //         contents: `
    //         <div style="text-align: center;">
    //           <p>Add your footer content here</p>
    //           <p>Page {{page}} of {{pages}}</p>
    //         </div>
    //       `,
    //     },
    // };
    var options = {
      format: "A4",
      orientation: "portrait",
      border: "10mm",
      header: {
        height: "10mm",
        // contents: '<div style="text-align: center;">Author: Junaid Akhtar</div>'
      },
      footer: {
        height: "10mm",
        // contents: {
        //     first: 'Cover page',
        //     2: 'Second page', // Any page number is working. 1-based index
        //     default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
        //     last: 'Last Page'
        // }
      },
    };

    var document = {
      html: html,
      data: {
        result,
        companyName,
        totalMachines,
        totalCompanyAmount,
        totalOrders,
      },
      path: "report.pdf",
      type: "",
    };

    try {
      const pdfBuffer = await pdf.create(document, options);
      console.log(pdfBuffer);

      return {
        success: true,
        pdfBuffer,
      };
    } catch (error) {
      console.log(error);
    }
    return {
      success: true,
      companyName,
      totalMachines,
      totalOrders,
      totalCompanyAmount,
      result,
      message: "Company Reports",
    };
  },
};

module.exports = companyReportService;
