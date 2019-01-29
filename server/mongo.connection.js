const mongoose = require('mongoose');

mongoose.connect('mongodb://admin:mafia0000@ds155164.mlab.com:55164/mafia');

module.exports = mongoose;
