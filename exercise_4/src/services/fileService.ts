const firebase = require("firebase-admin")
const serviceAccount = require("../firebase/uploadFileServiceAccountKey.json")
const FileSchema = require("../models/fileSchema")

if (!firebase.apps.length) {
  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
  })
}

const bucketName = process.env.UPLOAD_FILE_FIREBASE_BUCKET
const bucket = firebase.storage().bucket(bucketName)

async function uploadFile(fileData: any) {
  const file = new FileSchema({
    uploadedBy: fileData.userId,
    fileName: fileData.fileName,
    filePath: `files/${fileData.fileName}`
  })

  await file.save()

  await bucket.upload(fileData.filePath, {
    destination: `files/${fileData.fileName}`
  })
}

async function deleteFile(fileId: string) {
  const file = await FileSchema.findById(fileId)
  if(!file){
    throw new Error("File not found!")
  }

  await file.remove()
  await bucket.file(`files/${file.fileName}`).delete()
}

async function getFile(fileId: string) {
  const file = await FileSchema.findById(fileId)
  if(!file){
    throw new Error("File not found!")
  }
  if(!file.isDeleted){
    throw new Error("File is deleted!")
  }
  file.numberOfDownloads++
  await file.save()
  return file
}

async function getUploadLogs() {
  return await FileSchema.find()
}

module.exports = {
  uploadFile,
  deleteFile,
  getFile,
  getUploadLogs
}