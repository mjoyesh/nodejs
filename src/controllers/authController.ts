const authService = require("../services/authService")

export async function register(req: any, res: any) {
  try {
    await authService.registerUser(req.body)
    res.status(200).json({
      message: "User registered successfully!"
    })
  } catch(err: any) {
    res.status(400).json({
      error: err.message
    })
  }
}

export async function login(req:any, res:any) {
  try {
    const token = await authService.loginUser(req.body)
    res.status(200).json({
      token
    })
  } catch(err: any) {
    res.status(401).json({
      error: err.message
    })
  }
}