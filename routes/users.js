var express = require('express');
const axios = require('axios');
var router = express.Router();
const Users = require('../models/users.js');

//get all users
router.get('/', async(req, res)=>{
    try{
      const users = await Users.find({}).select('name age');
      res.json(users);
    } catch (error){
      console.log(error)
      res.status(500).json({message: error.message});
    }
  });
  
  //get one user
  router.get('/:id', async(req, res) => {
    try {
      const {id} = req.params;
      const user = await Users.findById(id).select('name age email password');
      // console.log(user);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({message: error.message});
    }
  })
  
module.exports = router;