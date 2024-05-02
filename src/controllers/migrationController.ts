import fs from "fs"
import csvParser from "csv-parser"
import { Request, Response, NextFunction } from "express"

export async function migrateController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = req.query.userId as string

  if (userId !== "authorized_user") {
    return next(new Error("Unauthorized user"))
  }

  const csvFilePath = ""

  let migratedCount = 0
  let skippedCount = 0
  const errors: { row: number; error: string }[] = []

  fs.readFile(csvFilePath, (err, data) => {
    if (err) {
      return next(err)
    }
    csvParser()
      .on("data", async (row) => {
        try {
          migratedCount++
        } catch (error) {
          errors.push({
            row: migratedCount + skippedCount + 1,
            error: error.message,
          })
          skippedCount++
        }
      })
      .on("error", (error) => {
        next(error)
      })
      .write(data)
  })
}
