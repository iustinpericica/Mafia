const mongoose = require('../mongo.connection');
const loginRouter = require('express').Router;

const Schema = mongoose.Schema;
const Model = mongoose.Model;

const loginSchema = new Schema({
  user: String,
  password: String
});

const loginModel = new Model('user', loginSchema);


loginRouter.get('/login', (req, res)=>{

  console.log(req.body);

});

module.exports = loginRouter;
