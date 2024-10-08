"use strict";
require("dotenv").config();
const CryptoJS = require("crypto-js");

const Cipher = {}; // Initialize Cipher as an empty object
exports.Cipher = Cipher;

let CipherKey = "xxx";

(function (Cipher) {
  /**
   * encrypt
   *
   * This function performs AES-256-CBC encryption.
   *
   * @param data The plaintext data to encrypt.
   * @returns The encrypted data in hex format with IV.
   */
  function encrypt(data) {
    const iv = CryptoJS.lib.WordArray.random(16);
    const key = CryptoJS.enc.Hex.parse(CipherKey);
    const encrypted = CryptoJS.AES.encrypt(data, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
    });
    return (
      encrypted.ciphertext.toString(CryptoJS.enc.Hex) +
      iv.toString(CryptoJS.enc.Hex)
    );
  }
  Cipher.encrypt = encrypt;

  /**
   * decrypt
   *
   * This function performs AES-256-CBC decryption.
   *
   * @param cipher The encrypted data in hex format with IV.
   * @returns The decrypted plaintext data.
   * @throws An error if decryption fails.
   */
  function decrypt(cipher) {
    try {
      const encryptedHex = cipher.slice(0, cipher.length - 32);
      const ivHex = cipher.slice(cipher.length - 32);
      if (!encryptedHex || !ivHex) {
        throw new Error("Invalid cipher text format");
      }
      const iv = CryptoJS.enc.Hex.parse(ivHex);
      const encrypted = CryptoJS.enc.Hex.parse(encryptedHex);
      const key = CryptoJS.enc.Hex.parse(CipherKey);
      const decrypted = CryptoJS.AES.decrypt({ ciphertext: encrypted }, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
      return CryptoJS.enc.Utf8.stringify(decrypted);
    } catch (error) {
      throw new Error("Decryption failed: " + error);
    }
  }
  Cipher.decrypt = decrypt;
})(Cipher);

function generateUrl(env, admissionId, inv_no) {
  return `https://${env}-pay-kairos.siloamhospitals.com/#/payment/v2/${Cipher.encrypt(
    admissionId
  )}/3?title=Admission%20List&prevUrl=%2Fadmission%2Fadmission-list&inv_no=${Cipher.encrypt(
    inv_no
  )}`;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  let env = args[0] || "preproduction";
  const functionName = args[1];
  const admissionid = args[2];
  const inv_no = args[3];

  switch (env.toLowerCase()) {
    case "preproduction":
      env = "preprd";
      CipherKey = process.env.CipherKeyPreproduction;
      break;
    case "production":
      env = "prd";
      CipherKey = process.env.CipherKeyProduction;
      break;
    case "staging":
      env = "uat";
      CipherKey = process.env.CipherKeyStaging;
      break;
    default:
      env = "development";
      CipherKey = process.env.CipherKeyDevelopment;
      break;
  }

  if (functionName === "generateUrl" && admissionid && inv_no) {
    const result = generateUrl(env, admissionid, inv_no);
    console.log(result.toString());
  } else if (functionName === "encrypt") {
    console.log(admissionid);
    console.log(Cipher.encrypt(admissionid.toString()));
  } else if (functionName === "decrypt") {
    console.log(admissionid);
    console.log(Cipher.decrypt(admissionid.toString()));
  } else {
    console.log(
      "Usage 1: node encrypt.js <env> generateUrl <admissionid> <inv_no>"
    );
    console.log("Usage 2: node encrypt.js <env> encrypt <string_to_encrypt>");
    console.log("Usage 3: node encrypt.js <env> decrypt <string_to_encrypt>");
    console.log(Cipher.encrypt(functionName));
  }
}


// // ------------------------------- INVOICE -------------------------------
// const paramsInvoice = {
//   is_from_dms: true, // boolean
//   org_id: 2, // number
//   invoice_no: "OIV2410010001", // string
// };

// const paramsInvoiceJSON = JSON.stringify(paramsInvoice);
// const paramsInvoiceEncrypted = Cipher.encrypt(paramsInvoiceJSON);
// const urlInvoice = encodeURI(
//   "https://dev-pay-kairos.siloamhospitals.com/#/payment-invoice?key=" +
//     paramsInvoiceEncrypted
// );
// console.log(urlInvoice);
// console.log(Cipher.decrypt(paramsInvoiceEncrypted));

// // ------------------------------- TEMPORARY INVOICE -------------------------------
// const paramsInvoiceTemp = {
//   is_from_dms: true, // boolean
//   org_id: 2, // number
//   admission_id: -703021, // number
//   is_temp: true, // boolean
//   cashier_hope_id: -99, // number
// };

// const paramsInvoiceTempJSON = JSON.stringify(paramsInvoiceTemp);
// const paramsInvoiceTempEncrypted = Cipher.encrypt(paramsInvoiceTempJSON);
// const urlInvoiceTemp = encodeURI(
//   "https://dev-pay-kairos.siloamhospitals.com/#/payment-invoice?key=" +
//     paramsInvoiceTempEncrypted
// );
// console.log(urlInvoiceTemp);
// console.log(Cipher.decrypt(paramsInvoiceTempEncrypted));
