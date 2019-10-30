const express = require('express');

const router = express.Router();

const db = require('./userDb.js');
const postdb = require("../posts/postDb.js")

router.post('/', validateUser, (req, res) => {
    const body = req.body
    db.insert(body)
    .then(user => {
        res.status(200).json(user);
    })
    .catch(error => {
        res.status(500).json({ error: ".post '/' error" })
    })
});

router.post('/:id/posts', (req, res) => {

});

router.get('/', (req, res) => {

});

router.get('/:id', (req, res) => {

});

router.get('/:id/posts', (req, res) => {

});

router.delete('/:id', (req, res) => {

});

router.put('/:id', (req, res) => {

});

//custom middleware

function validateUserId(req, res, next) {
    let id = req.params.id;
    db.getById(id)
    .then(user => {
        if(user){
            next();
        } else {
            res.status(400).json({ message: "invalid user id" })
        }
    })
    .catch(error => {
        res.status(500).json({ you:"shall not pass!!" })
    })
};

function validateUser(req, res, next) {
    const body = req.body;
    const name = req.body.name;
    if(!body){
        res.status(400).json({ message: "missing user data" })
    } else if(!name){
        res.status(400).json({ message: "missing required name field" })
    } else {
        next();
    }
};

function validatePost(req, res, next) {
    const body = req.body;
    const text = req.body.text;
    if(!body){
        res.status(400).json({ message: "missing post data" })
    } else if(!text){
        res.status(400).json({ message: "missing required text field" })
    } else {
        next();
    }
};

module.exports = router;
