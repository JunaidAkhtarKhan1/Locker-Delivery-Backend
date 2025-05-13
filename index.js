require("dotenv").config();
const express = require("express");
const app = express();

const { connection } = require("./config/config");

const port = process.env.PORT || 3000;

connection.connect((err) => {
  if (err) {
    console.error("MySQL connection error:", err.message);
    return;
  }
  console.log("Connected to MySQL!");
});

require("./src/startup/routes")(app);

app.listen(port, () => console.log(`Listening on port ${port}... `));
