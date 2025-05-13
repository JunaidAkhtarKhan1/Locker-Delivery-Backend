const fs = require("fs");
const crypto = require("crypto");

const dataToEncrypt = "Testing Request";

const publicKey = Buffer.from(
    fs.readFileSync("public.pem", { encoding: "utf-8" })
);

let encryptedData = crypto.publicEncrypt(
    {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
    },
    // We convert the data string to a buffer using `Buffer.from`
    Buffer.from(dataToEncrypt)
);

encryptedData = encryptedData.toString("base64");

console.log(encryptedData);