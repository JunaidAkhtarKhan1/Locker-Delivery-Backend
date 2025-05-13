// const sql = require('mssql');
const io = require("socket.io-client");
const socket = io("http://localhost:3000");

const getPaymentService = {
  getPayment: async (req, res) => {
    let message = "C,1";
    socket.emit("new message", message);
    return {
      success: true,
      message,
    };
  },
};

module.exports = getPaymentService;

// PORT=2000
// MACHINEID='ix-ho'
// HOST='localhost'
// USER='ix'
// PASSWORD='40842585'
// DATABASE='vending_machine'
