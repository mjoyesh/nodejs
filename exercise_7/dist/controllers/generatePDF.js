"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer = require("puppeteer");
const serviceAccount = require("../firebase/uploadFileServiceAccountKey.json");
const firebase = require("firebase-admin");
const fs = require("fs-extra");
const generatePDF = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!firebase.apps.length) {
            firebase.initializeApp({
                credential: firebase.credential.cert(serviceAccount),
            });
        }
        const bucketName = process.env.UPLOAD_FILE_FIREBASE_BUCKET;
        const bucket = firebase.storage().bucket(bucketName);
        const filePath = req.query.filePath;
        const jsonFile = bucket.file(filePath);
        const jsonBuffer = yield jsonFile.download();
        const jsonData = JSON.parse(jsonBuffer.toString());
        const browser = yield puppeteer.launch();
        const page = yield browser.newPage();
        const htmlContent = `
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { text-align: center; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>${jsonData.name}</h1>
          <p>${jsonData.address.addressLine1}, ${jsonData.address.addressLine2}, ${jsonData.address.State}</p>
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Total Bets</th>
                <th>Wins</th>
                <th>Loss</th>
                <th>Total Bet Amount</th>
              </tr>
            </thead>
            <tbody>
              ${jsonData.bets
            .map((bet) => `
                  <tr>
                    <td>${bet.month}</td>
                  <td>${bet.totalBets}</td>
                  <td>${bet.wins}</td>
                  <td>${bet.loss}</td>
                  <td>${bet.totalBetAmount}</td>
                </tr>`)
            .join("")}
            </tbody>
          </table>
        </body>
        </html>
      `;
        yield page.setContent(htmlContent);
        const pdfBuffer = yield page.pdf({ format: "A4", printBackground: true });
        yield browser.close();
        const pdfFileName = `pdfs/${jsonData.name}-${Date.now()}.pdf`;
        const tempFilePath = `temp/${pdfFileName}`;
        yield fs.ensureFile(tempFilePath);
        yield fs.writeFile(tempFilePath, pdfBuffer);
        yield bucket.upload(tempFilePath, { destination: pdfFileName });
        yield fs.remove(tempFilePath);
        const fileUrl = yield bucket.file(pdfFileName).getSignedUrl({
            action: "read",
            expires: "03-17-2025",
        });
        res.json({ url: fileUrl[0] });
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});
module.exports = { generatePDF };
//# sourceMappingURL=generatePDF.js.map