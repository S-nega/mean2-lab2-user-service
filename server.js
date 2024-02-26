var createError = require('http-errors');
const cors = require("cors");
var express = require('express');
var path = require('path');
const Users = require('./models/users.js');
const { error } = require('console');
const jwt = require('jsonwebtoken');
var app = express();
var express = require('express');
var path = require('path');
const mongoose = require('mongoose');
const authMiddleware = require('./middleware/authMiddleware.js');
const bodyParser = require('body-parser');

var app = express();

app.use(express.static(path.join(__dirname, 'lab2-users/dist')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors()); //Разрешение на cors
app.use(bodyParser.json());


//mongoose connecting
mongoose.
connect('mongodb+srv://admin:admin@userslist.s6zf9e1.mongodb.net/?retryWrites=true&w=majority')
.then(() => {
console.log('connected to MongoDB')
  }).catch((error) => {
    console.log(error)
})

//port connection
app.listen(3000, ()=>{
  console.log('listen port 3000')
});


//get all users
app.get('/api/users', async(req, res)=>{
  try{
    const users = await Users.find({});
    // console.log(users);
    res.json(users);
  } catch (error){
    console.log(error)
    res.status(500).json({message: error.message});
  }
});

//get one user
app.get('/api/users/:id', async(req, res) => {
  try {
      const {id} = req.params;
      const user = await Users.findById(id);

      // console.log(user);
      res.json(user);

  } catch (error) {
      res.status(500).json({message: error.message});
  }
})

//authorize user
app.post('/api/users/auth', async(req, res) => {
  try{
      const email = req.body.email;
      const pass = req.body.password;
      
      const user = await Users.findOne({email: email});
      // console.log(user);

      if (user){
        if(user.password === pass){
          const token = jwt.sign({ userId: user._id }, 'secret', { expiresIn: '1h' });
          console.log('user authorized, ' + token);
          return res.status(200).json({ message: 'Logged in successfully', token });
        }
      }
      else{
        res.status(500).json({message: 'Incorrect data'});
        console.log('Incorrect data');
      }

  } catch (error){
      console.log(error);
      res.status(500).json({message: error.message});
  }
})

//add new user
app.post('/api/users/reg', async(req, res) => {
  try{
      const user = await Users.create(req.body)
      console.log(user);
      // res.status(200).send({user: user})

      res.status(200).redirect('/api/users');

  } catch (error){
      console.log(error)
      res.status(500).json({message: error.message});
  }
})

//update user
app.post('/api/users/update/:id', authMiddleware, async(req, res) => {
  try {
      const {id} = req.params;
      const user = await Users.findByIdAndUpdate(id, req.body);
      console.log(req.name);
      console.log(req.age);
      console.log(req.email);

      if(!user){
          return res.status(404).json({message: `cannot find any user with ID ${id}`})
      }

      const updatedUser = await Users.findById(id);
      console.log(updatedUser);
      res.status(200).send({user: updatedUser})
      // res.status(200).redirect('/api/users');  

  } catch (error) {
      res.status(500).json({message: error.message});
  }
})

//delete user
app.delete('/api/users/del/:id', authMiddleware, async(req, res) => {
try{
    const {id} = req.params;
    const user = await Users.findByIdAndDelete(id);
    console.log(user);
    if(!user){
      return res.status(404).json({message: `cannot find any user with ID ${id}`})
    }
    res.status(200).send({user: user})
    // res.status(200).redirect('/api/users');

} catch (error){
    res.status(500).json({message: error.message});
}
})

module.exports = app;
