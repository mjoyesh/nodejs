import { Request, Response } from "express"
const { add, subtract, division, multiplication } = require("../utils")

export const getCalculationResult = (req: Request, res: Response) => {
  const operation = req.params.operation
  const num1 = req.params.n1
  const num2 = req.params.n2
  let result

  switch (operation) {
    case "addition":
      result = add(num1, num2)
      break

    case "subtraction":
      result = subtract(num1, num2)
      break

    case "division":
      result = division(num1, num2)
      break

    case "multiplication":
      result = multiplication(num1, num2)
      break

    default:
      result = "Something went wrong!"
  }

  res.status(200).json({
    status: "success",
    result
  })
}