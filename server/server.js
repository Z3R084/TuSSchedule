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

  app.get('/tournament', (req, res) => {
    console.log('data send');
    const tournament = db.get('tournament').last().value();
    res.send(tournament);
  });

  app.post('/tournament', (req, res) => {
    console.log('Received request');
    db.get('tournament')
      .push(req.body)
      .last()
      .write()
      .then(tournament => res.json(tournament));
    // fs.writeFile('json.json', JSON.stringify(req.body), (err) => {
    //   if (err) throw err;
    //   console.log('File written to json.json');
    //   res.json(req.body);
    // })
  });

  return db.defaults({ tournament: [] }).write();
}).then(() => {

  app.listen(3000, () => {
    console.log('Listening on port 3000. Post a file to http://localhost:3000 to save to /json.json');
  });
});