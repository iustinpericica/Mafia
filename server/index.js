const express = require('express');
const app = express();

const mongoose = require('./mongo.connection');

const loginRouter = require('./routes/user');

app.use('/user', loginRouter);

app.listen(3000, (err)=>{

  if(err)throw err;
  else console.log('Server is running just fine!');

});




