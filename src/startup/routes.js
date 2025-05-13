const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const machineSignup = require("../routes/authentication/machineSignup");
const signup = require("../routes/authentication/signup");
const login = require("../routes/authentication/login");
const updatePassword = require("../routes/authentication/updatePassword");
const registerUser = require("../routes/authentication/registerUser");

const transaction = require("../routes/transaction/transaction");
const inquireTransaction = require("../routes/inquireTransaction/inquireTransaction");
const payfastInquireTransaction = require("../routes/inquireTransaction/inquirePayfast");
const transactionComplete = require("../routes/transaction/transactionComplete");

//PayFast
const getPayfast = require("../routes/payfast/payfast");

//payfast payment confirmation
const payfastConfirmation = require("../routes/payfastConfirmation/payfastConfirmation");

//Raast payment confirmation
const raastConfirmation = require("../routes/payfastConfirmation/raastConfirmation");

const rechargeRfid = require("../routes/transaction/rechargeRfid");

const easypaisaTransactionConfirmation = require("../routes/transactionConfirmation/epTransactionConfirmation");
const paymobTransactionConfirmation = require("../routes/transactionConfirmation/paymobTransactionConfirmation");
const urlQR = require("../routes/urlQR/urlQR");

const companies = require("../routes/dashboard/filters/companies");
const machines = require("../routes/dashboard/filters/machines");
const filters = require("../routes/dashboard/filters/filters");

const orders = require("../routes/dashboard/orders/order");
const sales = require("../routes/dashboard/sales/sale");
const saleDetail = require("../routes/dashboard/sales/saleDetail");

const widgets = require("../routes/dashboard/widget/widget");

const monthlyRevenueGraph = require("../routes/dashboard/graphs/monthlyRevenue");
const successfulOrdersGraph = require("../routes/dashboard/graphs/successfulOrders");
const weeklySalesGraph = require("../routes/dashboard/graphs/weeklySales");

const createRfidData = require("../routes/dashboard/companies/employeeData/createRfidData");
const getRfidData = require("../routes/dashboard/companies/employeeData/getRfidData");
const updateRfidData = require("../routes/dashboard/companies/employeeData/updateRfidData");
const deleteRfidData = require("../routes/dashboard/companies/employeeData/deleteRfidData");

const create = require("../routes/machineRegistration/crud/create");
const read = require("../routes/machineRegistration/crud/read");
const update = require("../routes/machineRegistration/crud/update");
const deleted = require("../routes/machineRegistration/crud/delete");

const createCompany = require("../routes/machineRegistration/company/create");
const readCompany = require("../routes/machineRegistration/company/read");
const updateCompany = require("../routes/machineRegistration/company/update");
const deleteCompany = require("../routes/machineRegistration/company/delete");

const createMachine = require("../routes/machineRegistration/machine/create");
const readMachine = require("../routes/machineRegistration/machine/read");
const updateMachine = require("../routes/machineRegistration/machine/update");
const deleteMachine = require("../routes/machineRegistration/machine/delete");

const createMachineEnv = require("../routes/machineRegistration/machine/machineEnv");
const readMachineType = require("../routes/machineRegistration/machineType/machineType");

const createAdminUserRole = require("../routes/machineRegistration/adminUserRoles/create");
const readAdminUserRole = require("../routes/machineRegistration/adminUserRoles/read");
const updateAdminUserRole = require("../routes/machineRegistration/adminUserRoles/update");
const deleteAdminUserRole = require("../routes/machineRegistration/adminUserRoles/delete");

const createPaymentMode = require("../routes/machineRegistration/paymentModes/create");
const readPaymentMode = require("../routes/machineRegistration/paymentModes/read");
const updatePaymentMode = require("../routes/machineRegistration/paymentModes/update");
const deletePaymentMode = require("../routes/machineRegistration/paymentModes/delete");

const readAdminRoles = require("../routes/machineRegistration/displayInfo/displayAdminRoles");
const readAdminUsers = require("../routes/machineRegistration/displayInfo/displayAdminUsers");
const readBanks = require("../routes/machineRegistration/displayInfo/displayBanks");
const getPaymentMethods = require("../routes/machineRegistration/displayInfo/displayPaymentMethods");

const employeeActivation = require("../routes/dashboard/companies/employeeStatus");
const balanceRequestCompany = require("../routes/dashboard/companies/balanceRequest");
const displayBalanceRequest = require("../routes/dashboard/companies/displayRequest");
const displayRequestBalanceEmployees = require("../routes/dashboard/companies/displayRequestEmployees");
const balanceResponseCompany = require("../routes/dashboard/companies/balanceResponse");
const displayFlags = require("../routes/dashboard/companies/displayFlags");
const setFlags = require("../routes/dashboard/companies/setFlags");

const billingReport = require("../routes/dashboard/companies/reports/billingReport");
const billingDetails = require("../routes/dashboard/companies/reports/billingDetails");
const employeeBillings = require("../routes/dashboard/companies/reports/employeeBills");

const companyReport = require("../routes/dashboard/companies/reports/companyReport");
const companyReportDownload = require("../routes/dashboard/companies/reports/companyReportDownload");

const generateOrders = require("../routes/dashboard/orders/generateOrders");

const getAllUser = require("../routes/userManagement/getUser");
const postAllUser = require("../routes/userManagement/postUser");
const updateAllUser = require("../routes/userManagement/updateUser");
const deleteAllUser = require("../routes/userManagement/deleteUser");

// const test = require("../routes/test/test");

const getAllTest = require("../routes/test/getTest");
const postAllTest = require("../routes/test/postTest");
const updateAllTest = require("../routes/test/updateTest");
const deleteAllTest = require("../routes/test/deleteTest");

const test2 = require("../routes/test2");

//---------------------------------------Machine API's--------------------------------------------//

const machineConfiguration = require("../routes/machineConfiguration/machineConfiguration");
const updateColumnDetails = require("../routes/machineConfiguration/updateColumnDetails");
const getAllColumnDetails = require("../routes/machineConfiguration/getColumnDetails");
const updateCartStatus = require("../routes/dashboard/orders/updateCartStatus");

//---------------------------------------New API's--------------------------------------------//

const getAllProducts = require("../routes/products/getProducts");
const postAllProducts = require("../routes/products/postProducts");
const updateAllProducts = require("../routes/products/updateProducts");
const deleteAllProducts = require("../routes/products/deleteProducts");

const getAllBanks = require("../routes/machineRegistration/banks/getBanks");
const postAllBanks = require("../routes/machineRegistration/banks/postBanks");
const updateAllBanks = require("../routes/machineRegistration/banks/updateBanks");
const deleteAllBanks = require("../routes/machineRegistration/banks/deleteBanks");

const getAllRoles = require("../routes/authentication/rolesManagement/getRoles");
const postAllRoles = require("../routes/authentication/rolesManagement/postRoles");
const updateAllRoles = require("../routes/authentication/rolesManagement/updateRoles");
const deleteAllRoles = require("../routes/authentication/rolesManagement/deleteRoles");

const getAllRights = require("../routes/authentication/rightsManagement/getRights");
// const postAllRights = require("../routes/authentication/rightsManagement/postRights");
const updateAllRightsManagement = require("../routes/authentication/rightsManagement/updateRights");
// const deleteAllRights = require("../routes/authentication/rightsManagement/deleteRights");

const getMerchants = require("../routes/machineRegistration/merchants/getMerchants");
const postMerchants = require("../routes/machineRegistration/merchants/postMerchants");

const getAllPaymentMethods = require("../routes/machineRegistration/paymentMethods/getPaymentMethods");
const postAllPaymentMethods = require("../routes/machineRegistration/paymentMethods/postPaymentMethods");
const updateAllPaymentMethods = require("../routes/machineRegistration/paymentMethods/updatePaymentMethods");
const deleteAllPaymentMethods = require("../routes/machineRegistration/paymentMethods/deletePaymentMethods");

const displayEmployeeOrders = require("../routes/dashboard/companies/employeeData/employeeOrders");
const androidPayment = require("../routes/androidPayment/androidPayment");
const androidPolling = require("../routes/androidPayment/androidPolling");
const getPolling = require("../routes/androidPayment/getPolling");

const postVmc = require("../routes/vmc/postVmc");
const cashSale = require("../routes/cashSale/cashSale");

module.exports = (app) => {
  app.use(express.json());
  app.use(cors());
  app.use(express.static("pdfs")); // Assuming 'pdfs' is the directory containing the PDF file
  // Parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  //Authentication and Authorization
  app.use("/machineSignup", machineSignup);
  app.use("/signup", signup);
  app.use("/login", login);
  app.use("/updatePassword", updatePassword);
  app.use("/registerUser", registerUser);

  //------------------Vending Machine APIs-------------------//

  //Bank transaction and Inquiry
  app.use("/transaction", transaction);
  app.use("/inquireTransaction", inquireTransaction);
  app.use("/payfastInquire", payfastInquireTransaction);
  app.use("/transactionComplete", transactionComplete);

  //------------------VMC APIS-------------------//
  app.use("/vmcPaymentId", postVmc);

  //RFID Card Recharge
  app.use("/rechargeRfid", rechargeRfid);

  //Bank IPN's (Instant Payment Notifications)
  app.use("/paymobTransactionConfirmation", paymobTransactionConfirmation);
  app.use(
    "/easypaisaTransactionConfirmation",
    easypaisaTransactionConfirmation
  );

  //Paymob URL Redirection
  app.use("/urlQR", urlQR);

  //....................PayFast...........................//

  app.use("/payfast", getPayfast);

  //--------------PayFast Payment Confirmation--------------//

  app.use("/payfastConfirmation", payfastConfirmation);

  //--------------PayFast Payment Confirmation--------------//

  app.use("/raastConfirmation", raastConfirmation);

  //---------------------Dashboard APIs-----------------------//

  //Dashboard Filters
  app.use("/companyFilters", companies);
  app.use("/machineFilters", machines);
  app.use("/filters", filters);

  //---------------------GeneratedOrders APIs-----------------------//

  app.use("/generateOrders", generateOrders);

  //Orders Data
  app.use("/orders", orders);
  app.use("/sales", sales);
  app.use("/saleDetail", saleDetail);

  //Widgets
  app.use("/widgets", widgets);

  app.use("/weeklySalesGraph", weeklySalesGraph);
  app.use("/monthlyRevenueGraph", monthlyRevenueGraph);
  app.use("/successfulOrdersGraph", successfulOrdersGraph);

  //Employee CRUD
  app.use("/createCompanyEmployee", createRfidData);
  app.use("/readCompanyEmployees", getRfidData);
  app.use("/updateCompanyEmployee", updateRfidData);
  app.use("/deleteCompanyEmployee", deleteRfidData);

  //Company CRUD
  app.use("/createCompany", createCompany);
  app.use("/readCompanies", readCompany);
  app.use("/updateCompany", updateCompany);
  app.use("/deleteCompany", deleteCompany);

  //Machine CRUD
  app.use("/createMachine", createMachine);
  app.use("/readMachines", readMachine);
  app.use("/updateMachine", updateMachine);
  app.use("/deleteMachine", deleteMachine);

  //machineEnv
  app.use("/createEnvMachine", createMachineEnv);

  //machineType
  app.use("/readMachineType", readMachineType);

  //AdminUserRoles CRUD
  app.use("/createAdminUserRole", createAdminUserRole);
  app.use("/readAdminUserRoles", readAdminUserRole);
  app.use("/updateAdminUserRole", updateAdminUserRole);
  app.use("/deleteAdminUserRole", deleteAdminUserRole);

  //PaymentModes CRUD - Generated for everyMachine
  app.use("/createPaymentMode", createPaymentMode);
  app.use("/readPaymentModes", readPaymentMode);
  app.use("/updatePaymentMode", updatePaymentMode);
  app.use("/deletePaymentMode", deletePaymentMode);

  //Display Data API's
  app.use("/displayAdminRoles", readAdminRoles);
  app.use("/displayAdminUsers", readAdminUsers);
  app.use("/displayBanks", readBanks);
  app.use("/displayPaymentMethods", getPaymentMethods);

  //Company Balance
  app.use("/employeeStatus", employeeActivation);
  app.use("/companyBalanceRequest", balanceRequestCompany);
  app.use("/displayCompanyBalanceRequest", displayBalanceRequest);
  app.use("/requestedBalanceEmployeeList", displayRequestBalanceEmployees);
  app.use("/companyBalanceResponse", balanceResponseCompany);
  app.use("/displayCompanyFlags", displayFlags);
  app.use("/setCompanyFlags", setFlags);

  app.use("/billingDetails", billingDetails);
  app.use("/billingReport", billingReport);
  app.use("/companyReport", companyReport);
  app.use("/companyReportDownload", companyReportDownload);

  //------------------------User CRUD API--------------------------//

  app.use("/getUser", getAllUser);
  app.use("/postUser", postAllUser);
  app.use("/updateUser", updateAllUser);
  app.use("/deleteUser", deleteAllUser);
  //------------------------Test API--------------------------//
  app.use("/getTest", getAllTest);
  app.use("/postTest", postAllTest);
  app.use("/updateTest", updateAllTest);
  app.use("/deleteTest", deleteAllTest);

  //------------------------Products API--------------------------//
  app.use("/getProducts", getAllProducts);
  app.use("/postProducts", postAllProducts);
  app.use("/updateProducts", updateAllProducts);
  app.use("/deleteProducts", deleteAllProducts);

  //------------------------Machine API--------------------------//

  app.use("/machineConfiguration", machineConfiguration);
  app.use("/updateColumnDetails", updateColumnDetails);
  app.use("/getColumnDetails", getAllColumnDetails);
  app.use("/updateCartStatus", updateCartStatus);

  // ap../ //CRUD
  app.use("/create", create);
  app.use("/read", read);
  app.use("/update", update);
  app.use("/delete", deleted);

  //-------------------------New APIs--------------------------------//

  //Bank CRUD
  app.use("/getBanks", getAllBanks);
  app.use("/postBanks", postAllBanks);
  app.use("/updateBanks", updateAllBanks);
  app.use("/deleteBanks", deleteAllBanks);

  //Role Management CRUD
  app.use("/getRoles", getAllRoles);
  app.use("/postRoles", postAllRoles);
  app.use("/updateRoles", updateAllRoles);
  app.use("/deleteRoles", deleteAllRoles);

  //Rights Management CRUD
  app.use("/getRights", getAllRights);
  // app.use("/postRights", postAllRights);
  app.use("/updateRights", updateAllRightsManagement);
  // app.use("/deleteRights", deleteAllRights);

  //Merchants
  app.use("/getMerchants", getMerchants);
  app.use("/postMerchants", postMerchants);

  //CashSale
  app.use("/getCashSale", cashSale);

  //PaymentMethods CRUD
  app.use("/getPaymentMethods", getAllPaymentMethods);
  app.use("/postPaymentMethods", postAllPaymentMethods);
  app.use("/updatePaymentMethods", updateAllPaymentMethods);
  app.use("/deletePaymentMethods", deleteAllPaymentMethods);

  //DisplayEmployeeOrders
  app.use("/displayEmployeeOrders", displayEmployeeOrders);

  //DisplayEmployeeBills
  app.use("/employeeBills", employeeBillings);

  //android Payment
  app.use("/androidPayment", androidPayment);

  //android Polling
  app.use("/androidPolling", androidPolling);

  //get Polling
  app.use("/getPolling", getPolling);
};
