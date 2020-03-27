const User = require("../models/user");

// Get all users
exports.user_get_all = (req, res, next) => {
    User
        .find()
        .exec()
        .then(result => {
            const response = {
                users: result.map(result => {
                    return {
                        _id: result.id,
                        name: result.name,
                        email: result.email,
                        password: result.password
                    }
                })
            }
            res.status(200).json(response)
        })
        .catch(err => {res.status(500).json({error: err})})
}

// Post one user
exports.user_post_one = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: "Mail Exists"
                })
            }
            else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    }
                    else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId,
                            name: req.body.name,
                            email: req.body.email,
                            password: hash
                        });
                        user
                            .save()
                            .then(result => {res.status(201).json({message: 'User created'})})
                            .catch(err => {res.status(500).json({error: err});
                        });
                    }
                });
            }
        })
}

// Login one user
exports.user_login = (req, res, next) => {
    User
        .find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                res.status(401).json({
                    message: 'Auth Failed'
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    res.status(401).json({
                        message: 'Auth Failed'
                    }); 
                }
                if (result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        id: user[0]._id
                    }, process.env.JWT_KEY, {
                        expiresIn: "1h"
                    });
                    return res.status(200).json({
                        message: 'Auth Successful',
                        token: token
                    });
                }
            })
        })
        .catch(err => {
            res.status(500).json({ error: err })
        })
}

// Find one user
exports.user_find_one = (req, res, next) => {
    const id = req.params.userId;
    User
        .findById({email: req.body.email})
        .exec()
        .then(result => {
            const response = {
                _id: result.id,
                name: result.name,
                email: result.email,
                password: "Nice try."
            }
            res.status(200).json(response)
        })
        .catch(err => {res.status(500).json({error: err})})
}

// Delete one user
exports.user_delete_one = (req, res, next) => {
    const id = req.params.userId;
    User
        .remove({_id: id})
        .exec()
        .then(result => {
            const response = {
                message: "User deleted."
            }
            res.status(200).json(response)
        })
        .catch(err => {console.log(err);res.status(500).json({error: err})})
}