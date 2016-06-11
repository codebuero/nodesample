'use strict';

var express = require('express');
var app = express();
var Chance = require('chance');
var chance = new Chance();
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(expressValidator());

var o = new Map();

for (var i = 0; i < 4; i++) {
    o.set(i, {name: chance.name().toLowerCase(),url: chance.url(),twitter: chance.twitter()})
} 

app.get('/', function (req, res) {
  var content = 'Hello World!  <br> ' + 
                '<a href="list">List Users</a> <br>' +
                '<a href="add">Add User</a> <br>';
  res.status(200).send(content);
});

app.get('/list', function (req, res) {
  var content = '<html><a href="/">Back</a><dl>';

  o.forEach((value, key) => {
      content += '<dt><a href="/list/' + key + '">' + value.name + '</a></dt>' +
                 '<dd>' + value.url + '</dd>' + 
                 '<dd>' + value.twitter + '</dd>';
  })
  content += '</dl></html>'
  res.status(200).send(content);
});

app.get('/list/:id', function (req, res) {
  let id = (req.params.id && isNaN(req.params.id) !== true) ? +req.params.id : -1 ;
  let content = '<html><a href="/list">Back</a><dl>';
  let current = o.get(id)
  if (!current) {
    return res.status(200).send(content);
  }
  content += '<dt>' + current.name + '</dt><dd>' + current.url + '</dd><dd>' + current.twitter + '</dd>';  
  content += '</dl></html>'
  return res.status(200).send(content);
});

app.get('/add', function (req, res) {
  var content = '<html><form method="post" action="/add"><br>' +
             '<label>Name<input type="text" name="name" /><br>' +
             'URL: <input type="text" name="url"/><br>' +
             'Twitter: <input type="text" name="twitter"/><br>' +
             '<input type="submit" value="submit" /><br>' +
             '</form></html>';
  res.status(200).send(content)
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
    return res.send('<html><a href="/">Back</a><br>There have been validation errors: <br>' + JSON.stringify(errors, null, '\n') + '</html>');
  }

  if (req.body && req.body.name && req.body.url && req.body.twitter) {
    let newId = o.size + 1;
    o.set(newId, req.body);
  }
  res.redirect('/list');
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
