const uploadLogService = require("../services/uploadLogService")

export async function getUploadLogs(req: any, res: any) {
  try {
    const uploadLogs = await uploadLogService.getUploadedFileLogs()
    res.status(200).json({
      uploadLogs 
    })
  } catch(err: any) {
    res.status(400).json({
      error: err.message
    })
  }
}