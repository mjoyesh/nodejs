const puppeteer = require("puppeteer")
const serviceAccount = require("../firebase/uploadFileServiceAccountKey.json")
const firebase = require("firebase-admin")
const fs = require("fs-extra")

const generatePDF = async (req: any, res: any) => {
  try {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        credential: firebase.credential.cert(serviceAccount),
      })
    }
    const bucketName = process.env.UPLOAD_FILE_FIREBASE_BUCKET
    const bucket = firebase.storage().bucket(bucketName)
    const filePath = req.query.filePath
    const jsonFile = bucket.file(filePath)
    const jsonBuffer = await jsonFile.download()
    const jsonData = JSON.parse(jsonBuffer.toString())

    const browser = await puppeteer.launch()
    const page = await browser.newPage()

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
          <p>${jsonData.address.addressLine1}, ${
      jsonData.address.addressLine2
    }, ${jsonData.address.State}</p>
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
                .map(
                  (bet: any) => `
                  <tr>
                    <td>${bet.month}</td>
                  <td>${bet.totalBets}</td>
                  <td>${bet.wins}</td>
                  <td>${bet.loss}</td>
                  <td>${bet.totalBetAmount}</td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>
        </body>
        </html>
      `

    await page.setContent(htmlContent)

    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true })

    await browser.close()

    const pdfFileName = `pdfs/${jsonData.name}-${Date.now()}.pdf`
    const tempFilePath = `temp/${pdfFileName}`
    await fs.ensureFile(tempFilePath);
    await fs.writeFile(tempFilePath, pdfBuffer);
    await bucket.upload(tempFilePath, { destination: pdfFileName });
    await fs.remove(tempFilePath);

    const fileUrl = await bucket.file(pdfFileName).getSignedUrl({
      action: "read",
      expires: "03-17-2025",
    })

    res.json({ url: fileUrl[0] })
  } catch (error: any) {
    console.error("Error:", error)
    res.status(500).send("Internal Server Error")
  }
}

module.exports = { generatePDF }
