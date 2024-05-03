import fs from "fs"
import csvParser from "csv-parser"
import { Request, Response, NextFunction } from "express"
import * as admin from "firebase-admin"
import path from "path"

export async function writeMigrationLog(log: any): Promise<void> {
  const logFilePath = path.resolve(__dirname, "../../migration.log")
  const logData = JSON.stringify(log, null, 2)

  fs.appendFile(logFilePath, logData + "\n", (err) => {
    if (err) {
      console.error("Error writing migration log:", err)
    } else {
      console.log("Migration log has been written successfully.")
    }
  })
}

export function checkAuthorization(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const userId = req.query.userId as string
  if (userId !== "authorized_user") {
    next(new Error("Unauthorized user"))
  } else {
    next()
  }
}

const serviceAccount = require("../firebase/serviceAccountKey.json")
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const firestore = admin.firestore()

export async function migrateController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = req.query.userId as string
  if (userId !== "authorized_user") {
    return next(new Error("Unauthorized user"))
  }

  const csvFilePath = path.join(
    __dirname,
    "../firebase/dummy_migration_data.csv"
  )
  const collectionName = "data-migration"
  const migrationFileName = "migrationScript.ts"
  const migrationTriggeredBy = userId

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
          await firestore.collection(collectionName).add(row)
          migratedCount++
        } catch (error: any) {
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
      .on("end", async () => {
        await writeMigrationLog({
          fileName: migrationFileName,
          filePath: csvFilePath,
          migrationTriggeredBy,
          migratedCount,
          skippedCount,
          errors,
        })
        console.log("Migration completed successfully.")
        res.send("Migration completed successfully.")
      })
      .write(data)
  })
}
