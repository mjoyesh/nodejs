const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt
const User = require("../models/userSchema")

const opts: any = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = process.env.SECRET_KEY

module.exports = (passport: any) => {
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
