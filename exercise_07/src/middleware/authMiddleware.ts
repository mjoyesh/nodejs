const passport = require("passport")

const passportAuthentication = passport.authenticate("jwt", { session: false })

module.exports = passportAuthentication
