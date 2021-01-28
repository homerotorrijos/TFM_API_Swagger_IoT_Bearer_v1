'use-strict'

var passport = require('passport')
var Strategy = require('passport-http').DigestStrategy
const User = require('../models/users')






function Auth(){
    passport.authenticate('digest', { session: false })

    passport.use(new Strategy({ qop: 'auth' },
    function(email, cb) {
        User.findByUsername(email, function(err, user) {
            if (err) { return cb(err); }
            if (!user) { return cb(null, false); }
            return cb(null, user, user.password);
        })
    }))

}


module.exports = {
    Auth
}