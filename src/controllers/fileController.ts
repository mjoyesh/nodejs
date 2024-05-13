const fileService = require("../services/fileService")
const dotenv = require("dotenv")
const firebase = require("firebase-admin")
const serviceAccount = require("../firebase/uploadFileServiceAccountKey.json")

dotenv.config({ path: "./config.env" })

if (!firebase.apps.length) {
  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
  })
}

const bucketName = process.env.UPLOAD_FILE_FIREBASE_BUCKET
const bucket = firebase.storage().bucket(bucketName)

export async function uploadFile(req: any, res: any) {
  try {
    await fileService.uploadFile({
      userId: req.userId, 
      fileName: req.file.originalname, 
      filePath: req.file.path
    })
    res.status(200).json({
      message: "File uploaded successfully!"
    })
  } catch(err: any) {
    res.status(400).json({
      error: err.message
    })
  }
}

export async function deleteFile(req: any, res: any) {
  try {
    await fileService.deleteFile(req.params.id)
    res.status(200).json({
      message: "File deleted successfully!"
    })
  } catch(err: any) {
    res.status(400).json({
      error: err.message
    })
  }
}

export async function downloadFile(req: any, res: any) {
  try {
    const file = await fileService.getFile(req.params.id)
    const fileStream = bucket.file(`files/${file.fileName}`).createReadStream()
    res.setHeader("Content-Type", "application/octet-stream")
    res.setHeader('Content-Disposition', `attachment; filename="${file.fileName}"`)
    fileStream.pipe(res)
  } catch(err: any) {
    res.status(400).json({
      error: err.message
    })
  }
}