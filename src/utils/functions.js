const fs = require("fs");
const crypto = require("crypto");

const encrypt = async (dataToEncrypt) => {
  const privateKey = fs.readFileSync("private.pem", "utf8");
  let signer = crypto.createSign("RSA-SHA256");
  signer.update(dataToEncrypt);
  const encryptedData = signer.sign(privateKey, "base64");
  return encryptedData;
};

const decrypt = async (encryptedData, sign) => {
  const easypaisaPublicKey = fs.readFileSync(
    "easypaisa_public_key.pem",
    "utf8"
  );
  let verifier = crypto.createVerify("RSA-SHA256");
  verifier.update(encryptedData);
  const decryptedData = verifier.verify(easypaisaPublicKey, sign, "base64");
  console.log(decryptedData);

  return decryptedData;
};

const calculatePercentageChange = async (previousValue, currentValue) => {
  // Check for division by zero
  if (previousValue === 0 || currentValue === 0) {
    return { monthlyPercentage: "0%", color: "secondary" };
  }
  const difference = currentValue - previousValue;
  const percentageChange = (difference / Math.abs(previousValue)) * 100;

  // Format the result as a string with a sign
  const formattedResult =
    percentageChange > 0
      ? `+${percentageChange.toFixed(0)}%`
      : `${percentageChange.toFixed(0)}%`;

  // Determine the color based on the sign
  const color = percentageChange > 0 ? "success" : "error";

  return { monthlyPercentage: formattedResult, color: color };
};

const getLastMonthDate = async () => {
  const today = new Date(Date.now() + 18000000);
  const lastMonth = new Date(today);
  lastMonth.setMonth(today.getMonth() - 1);

  // const startMonthDate = lastMonth.toISOString().slice(0, 8).replace("T", " ");

  // Get the last day of the previous month
  const lastDayOfLastMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    0
  ).getDate(Date.now() + 18000000);

  // Adjust the date to the last day of the previous month
  lastMonth.setDate(
    Math.min(today.getDate(Date.now() + 18000000), lastDayOfLastMonth)
  );

  const startMonthDate = lastMonth.toISOString().slice(0, 8).replace("T", " ");
  const dateToday = lastMonth.toISOString().slice(0, 10).replace("T", " ");

  return { startMonthDate, dateToday };
};

const generateRandomPassword = async (length) => {
  length = length || 10;

  // Creating a buffer to store the random bytes
  const buffer = crypto.randomBytes(length);

  // Converting the buffer to a string using base64 encoding
  // This results in a password that contains letters, digits, and special characters
  const password = buffer
    .toString("base64")
    // Remove any non-alphanumeric characters from the base64 encoded string
    .replace(/[^a-zA-Z0-9]/g, "")
    // Make sure the password is exactly length characters long
    .slice(0, length);

  return password;
};

// Define the cleanUsername function
const cleanUsername = (companyName) => {
  // Convert company name to lowercase
  let cleanedCompanyName = companyName.toLowerCase();

  // Remove symbols and spaces using regex
  cleanedCompanyName = cleanedCompanyName.replace(/[^\w]/gi, "");

  return cleanedCompanyName;
};

module.exports = {
  encrypt,
  decrypt,
  calculatePercentageChange,
  getLastMonthDate,
  generateRandomPassword,
  cleanUsername,
};
