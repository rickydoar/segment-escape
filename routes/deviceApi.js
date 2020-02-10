var express = require('express');
var router = express.Router();
var request = require('request');
var path = require('path');

var device = require('./../models/device');
var message = require('./../models/message');

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

router.post('/getdevices', (req, res) => {
  //console.log('Getting Devices...');

  //console.log(req.body);

  device.find({})
        .exec(function (err, results) {
    if (err) {
        // handle error
    } else {
        // handle document
        var devices = results;
        res.send({"success": true, "devices": devices});
    }
  });

});


router.post('/messages/count', (req, res) => {
  //console.log('Count Messages...');

  //console.log(req.body);

  var deviceId = JSON.stringify(req.body.deviceId); //'12345'; //

  message.find({deviceId: deviceId})
        .exec(function (err, results) {
    if (err) {
        // handle error
    } else {
        // handle document
        var count = results.length;
        res.send({"success": true, "deviceId": deviceId, "count":count});
    }
  });

  //Update last seen
  device.update(
    {deviceId: deviceId}, // find a document with that filter
    {lastUpdated: Date.now()}, // document to insert when nothing was found
    {}, // options
    function (err, doc) { // callback
        if (err) {
            // handle error
        } else {
            // handle document
            //res.send({success: true})
            console.log('Updated lastUpdated for device: ' + deviceId);
        }
    }
  );
});

router.post('/messages/push', (req, res) => {
  console.log('Push Message...');

  console.log(req.body);

  var deviceId = JSON.stringify(req.body.deviceId);
  var messageToPush = JSON.stringify(req.body.message);

  if(messageToPush.length>100) {
    console.log("Could not saved new message: "+ deviceId +". String too long (max:100)");
    res.send({"success": false, "error":"Message character length cannot exceed 100."});
  } else {
    var newMessage = new message({ text: messageToPush, deviceId: deviceId});

    newMessage.save(function (err, results) {
      if (err) {
          // handle error
      } else {
          // handle document
          console.log("Saved new message: "+ deviceId +".");
          res.send({"success": true});
      }
    });
  }
});

router.post('/messages/pop', (req, res) => {
  console.log('Pop Message...');

  console.log(req.body);

  var deviceId = JSON.stringify(req.body.deviceId); //'12345'; //

  message.findOne({deviceId:deviceId})
       .sort({'timestamp': 'desc'})
       .exec(function(err, results) {
         if (err) {
             // handle error
         } else {
             // handle document
             var messageFromPop = results.text;

             message.findById(results.id, function (err, doc) {
               if (err) {
                   // handle error
               } else {
                 doc.remove(function (err, doc) {
                   if (err) {
                       // handle error
                   } else {
                     res.send({"success": true, "deviceId": deviceId, "message": messageFromPop});
                   }
                 });
               }
             });
         }
   });


});

module.exports = router;
