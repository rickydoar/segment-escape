var express = require('express');
var router = express.Router();
var request = require('request');
var path = require('path');

var device = require('./../models/device');

router.post('/register', (req, res) => {
  console.log('Registering Device...');

  console.log(req.body);

  var newDeviceId = JSON.stringify(req.body.deviceId); //'12345'; //
  var newDeviceIp = JSON.stringify(req.body.ipAddress); //'192.168.0.2'; //

  console.log("DeviceId: "+newDeviceId+" | DeviceIP: "+newDeviceIp);

  device.findOneAndUpdate(
    {deviceId: newDeviceId}, // find a document with that filter
    {ipAddress:newDeviceIp, lastUpdated: Date.now()}, // document to insert when nothing was found
    {upsert: true, new: true, runValidators: true, useFindAndModify: false}, // options
    function (err, doc) { // callback
        if (err) {
            // handle error
        } else {
            // handle document
            res.send({success: true})
        }
    }
  );

});

module.exports = router;
