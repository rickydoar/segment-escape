const express = require('express');
const router = express.Router();
const request = require('request');

router.post('/send-one-event', (req, res) => {
  const url = req.body.url;
  request.post(url, {
    json: {
      data: 'ewogICJhbm9ueW1vdXNJZCI6ICJhYmMxMjMiLAogICJldmVudCI6ICJTdGVwIE9uZSIsCiAgInByb3BlcnRpZXMiOiB7CiAgICAiY2x1ZV8xIjogIkNvbm5lY3QgdG8gTWl4cGFuZWwgYmVmb3JlIHN0YXJ0aW5nIHRoZSBuZXh0IHN0ZXAiLAogICAgImNsdWVfMiI6ICJZb3UgYXJlIGxvb2tpbmcgZm9yIHRoZSBzaG9wcGVyIHdobyBib3VnaHQgdGhlIG1vc3QgaXRlbXMgYXQgb25jZSB0aW1lIHdoaWxlIHNwZW5kaW5nIGxlc3MgdGhhbiAyMCBkb2xsYXJzIiwKICAgICJjbHVlXzMiOiAiVGhhdCB1c2VyJ3MgSUQgd2lsbCBnZXQgeW91IHRvIHlvdXIgbmV4dCB0YXNrIiwKICAgICJjbHVlXzQiOiAiVXNlIHRoZSBzYW1lIHNvdXJjZSBmdW5jdGlvbiBmb3IgdGhlIG5leHQgc3RlcCIsCiAgICAiY2x1ZV81IjogIldoZW4geW91IGFyZSBjb25maWRlbnQgaW4geW91ciBzb3VyY2UgZnVuY3Rpb24sIHRoZSBwYXNzd29yZCB0byB0aGUgbmV4dCBzdGVwIGlzIFByYWthc2g0UHJlc2lkZW50IgogIH0sCiAgInVzZXJJZCI6ICJ0ZXN0Igp9',
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
  for (x=1000; x < 1200; x++) {
    event.userId = String(x);
    event.anonymousId = Buffer.from(JSON.stringify(x)).toString('base64');
    if (x === 1115) {
      event.properties.price = 19.20;
      event.properties.cart_size = 14;
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
