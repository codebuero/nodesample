'use strict';

const express = require('express'),
      app = express(),
      Chance = require('chance'),
      bodyParser = require('body-parser'),
      expressValidator = require('express-validator');

var chance = new Chance();

app.set('view engine', 'jade')
app.set('views', './views')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(expressValidator());

var _createNewUserMap = function(size) {
  let _size = size || 4;
  let _o = new Map();

  while(_o.size < _size) {
    let t = { name: chance.name().toLowerCase(),
              url: chance.url(),
              twitter: chance.twitter()
            };
    _o.set(_o.size, t);
  } 
  return _o;
}

var o = _createNewUserMap();  

app.get('/', function (req, res) {
  res.status(200).render('index');
});

app.get('/list', function (req, res) {
  let userlist = Array.from(o).map((v) => {return v[1];});
  res.status(200).render('list', {userlist});
});

app.get('/list/:id', function (req, res) {
  req.checkParam({
    'id': {
      isNumeric: true
    }
  });
  let errors = req.validationErrors();
  if (errors) {
    return res.render('error', {errors});
  }
  return res.status(200).render('single', {currentUser});
});

app.get('/add', function (req, res) {
  res.status(200).render('add');
});

app.post('/add', function (req, res) {

  req.checkBody({
    'name': {
      isAlpha: true
    },
    'url': {
      isAlpha: true
    },
    'twitter': {
      isAlpha: true
    }
  });

  let errors = req.validationErrors();
  if (errors) {
    return res.render('error', {errors});
  }
  
  let newId = o.size + 1;
  o.set(newId, req.body);

  res.redirect('/list');
});

var server = app.listen(3000, function () {
  let host = server.address().address;
  let port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
