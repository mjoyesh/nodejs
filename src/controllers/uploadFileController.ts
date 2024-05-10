const firebase = require("firebase-admin")
const serviceAccount = require("../firebase/serviceAccountKey.json")
const multer = require("multer")

if (!firebase.apps.length) {
  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
  })
}

const bucketName = "upload-file-67cf7.appspot.com"
const bucket = firebase.storage().bucket(bucketName)

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
})

export async function migrateController(req: any, res: any, next: any) {
  upload.single("file")(req, res, async (err: any) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: "File upload error" })
    } else if (err) {
      return res.status(500).json({ error: "Error uploading file" })
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" })
    }

    const file = bucket.file(req.file.originalname)
    const fileStream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
      resumable: false,
    })

    fileStream.on("error", (err: any) => {
      return res
        .status(500)
        .json({ error: "Error uploading file", message: err.message })
    })

    fileStream.on("finish", () => {
      res.status(200).json({ message: "File uploaded successfully" })
    })

    fileStream.end(req.file.buffer)
  })
}

// // Upload File to Firebase
// app.post('/upload', authenticateUser, upload.single('file'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: 'No file uploaded' });
//   }

//   const file = bucket.file(req.file.originalname);
//   const fileStream = file.createWriteStream({
//     metadata: {
//       contentType: req.file.mimetype
//     },
//     resumable: false
//   });

//   fileStream.on('error', (err) => {
//     return res.status(500).json({ error: 'Error uploading file' });
//   });

//   fileStream.on('finish', () => {
//     // File uploaded successfully
//     res.status(200).json({ message: 'File uploaded successfully' });
//   });

//   fileStream.end(req.file.buffer);
// });
