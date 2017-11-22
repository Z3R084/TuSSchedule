'use strict'

const fs = require('fs');

const bodyParser = require('body-parser');
const express = require('express');
const low = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');

const app = express();
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'POST');
  next();
});

const adapter = new FileAsync('db.json');
low(adapter).then(db => {

  app.post('/', (req, res) => {
    console.log('Received request');
    db.get('teams')
      .push(req.body)
      .last()
      .write()
      .then(team => res.json(team));
    // fs.writeFile('json.json', JSON.stringify(req.body), (err) => {
    //   if (err) throw err;
    //   console.log('File written to json.json');
    //   res.json(req.body);
    // })
  });

  return db.defaults({ teams: [] }).write();
}).then(() => {

  app.listen(3000, () => {
    console.log('Listening on port 3000. Post a file to http://localhost:3000 to save to /json.json');
  });
});