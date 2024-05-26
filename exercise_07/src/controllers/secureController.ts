const getProtectedData = (req: any, res: any) => {
  res.json({
    id: req.user.id,
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    email: req.user.email,
    username: req.user.username
  })
}

module.exports = { getProtectedData }
