const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const User = require('../models/user');

// Get all existing users
router.get('/', (req, res, next) => {
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
});

// Create a new user
router.post('/signup' , (req, res, next) => {
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
});

// Login a user
router.post('/login', (req, res, next) => {
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
                    return res.status(200).json({
                        message: 'Auth Successful'
                    });
                }
            })
        })
        .catch(err => {
            res.status(500).json({ error: err })
        })
});

// Find an existing user by userID
router.get('/:userId', (req, res, next) => {
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
})

// Delete an existing user by userId
router.delete('/:userId', (req, res, next) => {
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
});

module.exports = router;