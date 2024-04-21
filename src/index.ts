const express = require("express")
const app = express()
const port = 8000
const { add, subtract, division, multiplication } = require("./utils")

app.get("/calculate/:operation/:n1/:n2", (req: any, res: any) => {
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

  res.json(result)
})

app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`)
})
