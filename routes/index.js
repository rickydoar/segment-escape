var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname+'/../client/build/index.html'));
});

router.post('/password', (req, res) => {
  const password = req.body.password;
  const escapeStep = JSON.stringify(req.body.escapeStep);
  if (escapeStep === '2') {
    if (password === 'Prakash4President') {
      res.send({success: true});
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
