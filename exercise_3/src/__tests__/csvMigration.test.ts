import * as admin from "firebase-admin"
import * as fs from "fs"
import * as path from "path"
import { Request, Response } from "express"
import { migrateController } from "../controllers/migrationController"

jest.mock("firebase-admin", () => {
  const firestoreMock: any = {
    collection: jest.fn(() => firestoreMock),
    add: jest.fn(),
  }
  const adminMock = {
    initializeApp: jest.fn(),
    credential: {
      cert: jest.fn(),
    },
    firestore: jest.fn(() => firestoreMock),
  }
  return adminMock
})

jest.mock("fs")

describe("migrateController", () => {
  let req: any
  let res: any
  let next: jest.MockedFunction<any>
  let addMock: jest.Mock

  beforeEach(() => {
    req = {
      query: {
        userId: "authorized_user",
      },
    }
    res = {
      send: jest.fn(),
    }
    next = jest.fn()
    addMock = jest.fn()
    jest.spyOn(admin.firestore(), "collection").mockReturnValue({
      add: addMock,
    } as any)
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  it("should migrate data from CSV to Firebase Firestore", async () => {
    const csvData = [{ id: "1", name: "John" }]
    const csvFilePath = path.resolve(
      __dirname,
      "../firebase/dummy_migration_data.csv"
    )
    const csvDataBuffer = Buffer.from(
      csvData.map((row) => Object.values(row).join(",")).join("\n")
    )
    const readFileMock = jest
      .spyOn(fs, "readFile")
      .mockImplementationOnce((path, callback) => {
        callback(null, csvDataBuffer)
      })

    await migrateController(req as Request, res as Response, next)

    expect(admin.initializeApp).toHaveBeenCalled()
    expect(admin.firestore).toHaveBeenCalled()
    expect(readFileMock).toHaveBeenCalledWith(csvFilePath, expect.any(Function))
    expect(admin.firestore().collection).toHaveBeenCalledWith("data-migration")
    expect(addMock).toHaveBeenCalledWith(csvData[0])
    expect(next).not.toHaveBeenCalled()
    expect(res.send).toHaveBeenCalledWith("Migration completed successfully.")
  })

  // it("should handle unauthorized user", async () => {
  //   req.query.userId = "unauthorized_user";

  //   await migrateController(req as Request, res as Response, next);

  //   expect(next).toHaveBeenCalledWith(new Error("Unauthorized user"));
  //   expect(admin.initializeApp).not.toHaveBeenCalled();
  // });

  // it("should handle file read error", async () => {
  //   const error = new Error("File read error");
  //   (fs.readFile as any).mockImplementationOnce((path: any, callback: any) => {
  //     callback(error);
  //   });

  //   await migrateController(req as Request, res as Response, next);

  //   expect(next).toHaveBeenCalledWith(error);
  //   expect(admin.initializeApp).not.toHaveBeenCalled();
  // });
})
