const express = require('express');
const router = express.Router();
const request = require('request');

router.post('/send-one-event', (req, res) => {
  const url = req.body.url;
  request.post(url, {
    json: {
      data: 'ewogICJldmVudCI6ICJTdGVwIE9uZSIsCiAgInByb3BlcnRpZXMiOiB7CiAgICAiYW5vbnltb3VzSWQiOiAiYWJjMTIzIiwKICAgICJjbHVlXzEiOiAiQ29ubmVjdCB0byBhbiBhbmFseXRpY3MgdG9vbCBvZiB5b3VyIGNob2ljZSBiZWZvcmUgc3RhcnRpbmcgdGhlIG5leHQgc3RlcCIsCiAgICAiY2x1ZV8yIjogIllvdSBhcmUgbG9va2luZyBmb3IgdGhlIHNob3BwZXIgd2hvIGJvdWdodCB0aGUgbW9zdCBpdGVtcyBhdCBvbmNlIHRpbWUgd2hpbGUgc3BlbmRpbmcgbGVzcyB0aGFuIDIwIGRvbGxhcnMiLAogICAgImNsdWVfMyI6ICJUaGF0IHVzZXIncyBJRCB3aWxsIGdldCB5b3UgdG8geW91ciBuZXh0IHRhc2siLAogICAgImNsdWVfNCI6ICJVc2UgdGhlIHNhbWUgc291cmNlIGZ1bmN0aW9uIGZvciB0aGUgbmV4dCBzdGVwIiwKICAgICJjbHVlXzUiOiAiV2hlbiB5b3UgYXJlIGNvbmZpZGVudCBpbiB5b3VyIHNvdXJjZSBmdW5jdGlvbiwgdGhlIHBhc3N3b3JkIHRvIHRoZSBuZXh0IHN0ZXAgaXMgUHJha2FzaDRQcmVzaWRlbnQiCiAgICAidXNlcklkIjogInRlc3QiCiAgfSwKfQ',
      encoding_type: 'base64'
    }
  }, (error, res, body) => {
    if (error) {
      console.error(error)
      return
    }
  })
  res.send({succes: true});
});

router.post('/send-data', (req, res) => {
  const url = req.body.url;
  const event = {
    event: "Order Completed",
    properties: {
      browser: 'Internet Explorer',
      currency: 'US Dollars',
      operating_system: 'Web',
      position: 2,
    },
  }
  request.post(url, {
    json: {
      data: Buffer.from(JSON.stringify(event)).toString('base64'),
      encoding_type: 'base64'
    }
  }, (error, res, body) => {
    if (error) {
      console.error(error)
      return
    }
  })
  for (x=1000; x < 1300; x++) {
    event.properties.userId = String(x);
    event.properties.anonymousId = Buffer.from(JSON.stringify(x)).toString('base64');
    if (x === 1115) {
      event.properties.price = 19.20;
      event.properties.cart_size = 14;
      event.properties.phone_number = "1-415-717-2511";
    } else {
      event.properties.price = Math.floor(Math.random() * 3000) / 100;
      if (event.properties.price < 20) {
        event.properties.cart_size = Math.floor(Math.random() * 10);
      } else {
        event.properties.cart_size = Math.floor(Math.random() * 20);
      }
    }
    request.post(url, {
      json: {
        data: Buffer.from(JSON.stringify(event)).toString('base64'),
        encoding_type: 'base64'
      }
    }, (error, res, body) => {
      if (error) {
        console.error(error)
        return
      }
    })
  }
  res.send({succes: true});
});

module.exports = router;
