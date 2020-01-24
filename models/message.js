let mongoose = require('mongoose')
let validator = require('validator')

let messageSchema = new mongoose.Schema({
  text: {
    type: String,
    unique: false,
  },
  timestamp : { type : Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema)
