const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt
const User = require("../models/userSchema")
const dotenv = require("dotenv")

dotenv.config({ path: "./config.env" })

const opts: any = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req: any) => req.cookies["auth-cookie"],
  ]),
  secretOrKey: process.env.SECRET_KEY,
}

const passportConfig = (passport: any) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload: any, done: any) => {
      User.findById(jwt_payload.id)
        .then((user: any) => {
          if (user) {
            return done(null, user)
          }
          return done(null, false)
        })
        .catch((err: any) => console.log(err))
    })
  )
}

module.exports = passportConfig
