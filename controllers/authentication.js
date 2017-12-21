var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.register = function(req, res) {

    // if(!req.body.name || !req.body.email || !req.body.password) {
    //   sendJSONresponse(res, 400, {
    //     "message": "All fields required"
    //   });
    //   return;
    // }

    var user = new User();
    console.log(req.body.email);
    User.find({ email: req.body.email }, function(err, results) {
        if (err) throw err;
        console.log('results:');
        console.log(results);
        if (results.length == 0) {
            console.log('registered');
            user.name = req.body.name;
            user.email = req.body.email;
            user.fbid = "";
            user.loginsession = "";
            user.setPassword(req.body.password);

            user.save(function(err) {
                var token;
                token = user.generateJwt();
                res.status(200);
                res.json({
                    "token": token
                });
            });
        } else {
            res.json({ "errorMsg": "User already exists!" });
        }
    })


};

module.exports.login = function(req, res) {

    // if(!req.body.email || !req.body.password) {
    //   sendJSONresponse(res, 400, {
    //     "message": "All fields required"
    //   });
    //   return;
    // }

    passport.authenticate('local', function(err, user, info) {
        var token;

        // If Passport throws/catches an error
        if (err) {
            res.status(404).json(err);
            return;
        }

        // If a user is found
        if (user) {
            token = user.generateJwt();
            res.status(200);
            res.json({
                "token": token
            });
        } else {
            // If user is not found
            res.status(401).json(info);
        }
    })(req, res);

};