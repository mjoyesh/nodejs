const fs = require("fs")
const ExcelJS = require("exceljs")
import path from "path"

interface RowInterface {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: any
}

export const convertJSONtoExcel = () => {
  const json_file_path = path.join(__dirname, "../files/sample_data.json")
  const excel_file_path = path.join(__dirname, "../files/sample_data.xlsx")
  const json_data = JSON.parse(fs.readFileSync(json_file_path, "utf8"))

  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet("Sample Data Sheet")

  const headers = Object.keys(json_data[0])
  worksheet.addRow(headers)

  try {
    json_data.forEach((row: RowInterface) => {
      const rowData: RowInterface[] = []
      headers.forEach((header) => {
        rowData.push(row[header as keyof RowInterface])
      })
      worksheet.addRow(rowData)
    })

    return workbook.xlsx.writeFile(excel_file_path)
  } catch (err) {
    console.log("Something went wrong!")
  }
}
