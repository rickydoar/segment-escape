let mongoose = require('mongoose')
let validator = require('validator')

let deviceSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    unique: true,
  },
  ipAddress: {
    type: String,
    unique: false,
  },
  lastUpdated : { type : Date, default: Date.now }
});

module.exports = mongoose.model('Device', deviceSchema)
