require("dotenv").config();
const express = require("express");
const app = express();

const { connection } = require("./config/config");

const port = process.env.PORT;

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL Server!");
});

require("./src/startup/routes")(app);

app.listen(port, () => console.log(`Listening on port ${port}... `));
