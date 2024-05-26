import { Request, Response } from "express"
import fs from "fs"
import path from "path"

export const readWriteFileSync = (req: Request, res: Response) => {
  const sourceFile = path.join(__dirname, "../files/sample.txt")
  const destinationFile = path.join(__dirname, "../files/destinationSync.txt")
  const file_data = fs.readFileSync(sourceFile, "utf8")

  fs.writeFileSync(destinationFile, file_data)
  res.status(201).json({
    status: "success",
    message: "File copied successfully synchronously!"
  })
}

export const readWriteFileASync = (req: Request, res: Response) => {
  const sourceFile = path.join(__dirname, "../files/sample.txt")
  const destinationFile = path.join(__dirname, "../files/destinationAsync.txt")

  fs.readFile(sourceFile, "utf8", (err: NodeJS.ErrnoException | null, data: string) => {
    fs.writeFile(destinationFile, data, (err: NodeJS.ErrnoException | null) => {
      res.status(201).json({
        status: "success",
        message: "File copied successfully asynchronously!"
      })
    })
  })
}