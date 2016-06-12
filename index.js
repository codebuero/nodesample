'use strict';

const express = require('express'),
      app = express(),
      Chance = require('chance'),
      bodyParser = require('body-parser'),
      expressValidator = require('express-validator');

var chance = new Chance();

var _createNewUserMap = function(size) {
  let _size = size || 4;
  let _o = new Map();

  while(_o.size < _size) {
    let _n = chance.name().toLowerCase();
    let _t = { name: _n,
              url: `https://${chance.domain()}`,
              twitter: `@${_n}`.replace(' ', '_')
            };
    _o.set(_o.size, _t);
  } 
  return _o;
}

var dataSource = _createNewUserMap(10);  

app.set('view engine', 'pug')
app.set('views', './views')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(expressValidator({
 customValidators: {
    inInterval: function(param, lower, upper) {
      return lower <= param && param < upper;
    }
 }
}));

app.get('/', function (req, res) {
  res.status(200).render('index');
});

app.get('/list', function (req, res) {
  let userlist = Array.from(dataSource).map((v) => {return v[1];});
  res.status(200).render('list', {userlist});
});

app.get('/list/:id', function (req, res) {
  req.checkParams('id').notEmpty().isInt().inInterval(0, dataSource.size);

  let errors = req.validationErrors();

  if (errors) {
    return res.status(404).render('error', {errors});
  }

  req.sanitizeParams('id').toInt();
  let currentUser = dataSource.get(req.params.id)
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
  dataSource.set(o.size, req.body);

  res.redirect('/list');
});

var server = app.listen(3000, function () {
  let host = server.address().address;
  let port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
