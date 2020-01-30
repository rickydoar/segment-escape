var express = require('express');
var router = express.Router();
var path = require('path');
var axios = require('axios');

const DEVICEAPI_URL = 'http://localhost:3000/deviceApi/messages/push';
const OP_SOUND = "OP_SOUND";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname+'/../client/build/index.html'));
});


function sendDeviceMessage(deviceId, message) {
  axios.post(DEVICEAPI_URL, {
    deviceId: deviceId,
    message: message
  })
  .then((res) => {
    console.log(`statusCode: ${res.statusCode}`)
  })
  .catch((error) => {
    console.error(error)
  });
}

function sendDeviceSound(deviceId) {
  sendDeviceMessage(deviceId,OP_SOUND)
}


router.post('/password', (req, res) => {
  const password = req.body.password;
  const escapeStep = JSON.stringify(req.body.escapeStep);
  if (escapeStep === '2') {
    if (password === 'Prakash4President') {
      res.send({success: true});

      sendDeviceMessage("12345","Welcome!");
      sendDeviceSound("12345");

    } else {
      res.send({success: false});
    }
  } else if (escapeStep === '3') {
    if (password === '1115') {
      res.send({success: true});
    } else {
      res.send({success: false});
    }
  }
});

module.exports = router;
