var mongoose = require('mongoose');
var Device = require('./device');
var Message = require('./message');


const MONGO_USERNAME="dbUser";
const MONGO_PASSWORD="Test123!";
const DATABASE_URL="mongodb+srv://dbUser:<password>@cluster0-jambg.gcp.mongodb.net/test?retryWrites=true&w=majority";

var options = {
  user: MONGO_USERNAME,
  pass: MONGO_PASSWORD,
  useNewUrlParser: true,
  useUnifiedTopology: true
};

const connectDb = () => {
  return mongoose.connect(process.env.DATABASE_URL || DATABASE_URL, options);
};

module.exports = {
  connectDb,
  Device,
  Message
};
