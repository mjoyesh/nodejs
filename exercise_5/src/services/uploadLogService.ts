const FileSchema = require("../models/fileSchema")

const getUploadedFileLogs = async() => {
  return await FileSchema.find()
}

module.exports = { getUploadedFileLogs }