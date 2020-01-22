var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname+'/../client/build/index.html'));
});

router.post('/password', (req, res) => {
  const password = req.body.password;
  if (password == 'Prakash4President') {
    res.send({success: true});
  } else {
    res.send({success: false});
  }
});

module.exports = router;
