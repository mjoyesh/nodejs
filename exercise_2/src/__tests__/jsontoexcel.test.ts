import fs from "fs"
import path from "path"
import ExcelJS from "exceljs"
import { convertJSONtoExcel } from "../controllers/readJSONToExcelController"

interface RowInterface {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: any
}

jest.mock("fs")

describe("convertJSONtoExcel", () => {
  const jsonFilePath = path.join(__dirname, "../files/sample_data.json")
  const excelFilePath = path.join(__dirname, "../files/sample_data.xlsx")

  // Mocking the JSON data
  const jsonData: RowInterface[] = [
    {
      id: 1,
      title: "Product 1",
      price: 10,
      description: "Description 1",
      category: "Category 1",
      image: "Image 1",
      rating: 4,
    },
    {
      id: 2,
      title: "Product 2",
      price: 20,
      description: "Description 2",
      category: "Category 2",
      image: "Image 2",
      rating: 5,
    },
  ]

  // Mocking Excel workbook and worksheet
  const mockWorksheet = {
    addRow: jest.fn(),
  }
  const mockWorkbook = {
    addWorksheet: jest.fn().mockReturnValue(mockWorksheet),
    xlsx: {
      writeFile: jest.fn().mockResolvedValue(undefined),
    },
  }
  jest.spyOn(ExcelJS, "Workbook").mockReturnValue(mockWorkbook as any)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  // Test case for successful conversion
  it("should convert JSON to Excel successfully", async () => {
    // Mock fs.readFileSync
    ;(fs.readFileSync as jest.Mock).mockReturnValueOnce(
      JSON.stringify(jsonData)
    )

    // Expect the function to throw an error
    await expect(convertJSONtoExcel()).resolves.toBeUndefined()

    expect(fs.readFileSync).toHaveBeenCalledWith(jsonFilePath, "utf8")
    expect(mockWorkbook.xlsx.writeFile).toHaveBeenCalledWith(excelFilePath)
  })
})
