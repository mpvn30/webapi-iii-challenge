const express = require('express');

const router = express.Router();

const db = require('./userDb.js');
const postdb = require("../posts/postDb.js")

router.post('/', validateUser, (req, res) => {
    const body = req.body
    db.insert(body)
    .then(users => {
        res.status(200).json(users);
    })
    .catch(error => {
        res.status(500).json({ error: ".post '/' error" })
    })
});

router.post('/:id/posts', [validateUserId, validatePost], (req, res) => {
    const body = req.body;
    postdb.insert(body)
    .then(posts => {
        res.status(201).json(posts);
    })
    .catch(error =>{
        res.status(500).json({ error: ".post '/:id/posts' error" })
    })
});

router.get('/', (req, res) => {
    db.get()
    .then(users => {
        res.status(200).json(users);
    })
    .catch(error => {
        res.status(500).json({ error: ".get / error" })
    })
});

router.get('/:id', validateUserId,(req, res) => {
    const id = req.params.id;
    db.getById(id)
    .then(user => {
        res.status(200).json(user);
    })
    .catch(error => {
        res.status(500).json({ error: ".get /:id error" })
    })
});

router.get('/:id/posts', validateUserId,(req, res) => {
    const id = req.params.id;
    db.getUserPosts(id)
    .then(posts => {
      res.status(201).json(posts);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: "Error getting user's posts."
      });
    });
});

router.delete('/:id', validateUserId,(req, res) => {
    const id = req.params.id;
    db.remove(id)
    .then(count => {
      if (count > 0) {
        res.status(200).json({
          message: "The user has been deleted."
        });
      } else {
        res.status(404).json({
          message: "The user could not be found."
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: "Error deleting the user."
      });
    });
});

router.put('/:id', [validateUser, validateUserId],(req, res) => {
    const id = req.params.id;
    const body = req.body;
    db.update(id, body)
      .then(post => {
        res.status(201).json(post);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          message: "Error updating user"
        });
      });
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
    } if(!text){
        res.status(400).json({ message: "missing required text field" })
    } else {
        next();
    }
};

module.exports = router;
