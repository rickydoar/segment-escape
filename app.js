var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var eventsRouter = require('./routes/events');
var deviceApiRouter = require('./routes/deviceApi');

var models, { connectDb } = require('./models');
var bodyParser = require('body-parser');

var app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.use('/deviceApi', deviceApiRouter);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/', indexRouter);
app.use('/events', eventsRouter);


app.get(['/','/events'], (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 3001;


connectDb().then(async () => {
  app.listen(port, () =>
    console.log(`Listening on port ${port}...`),
  );
});

module.exports = app;
