const { add, subtract, division, multiplication } = require("./utils")

describe("Addition Test", () => {
  test("Addition of 2 numbers", () => {
    let sum = add(1, 2)
    expect(sum).toBe(3)
  })
})

describe("Subtraction Test", () => {
  test("Subtraction of 2 numbers", () => {
    let subtraction = subtract(5, 1)
    expect(subtraction).toBe(4)
  })
})

describe("Division Test", () => {
  test("Division of 2 numbers", () => {
    let divide = division(6, 2)
    expect(divide).toBe(3)
  })
})

describe("Multiplication Test", () => {
  test("Multiplication of 2 numbers", () => {
    let multiply = multiplication(7, 3)
    expect(multiply).toBe(21)
  })
})