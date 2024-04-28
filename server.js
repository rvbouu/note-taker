const express = require('express');
const path = require('path');
const {writeFile} = require('fs');
const db = require('./db/db.json');
const uniqid = require('uniqid');

const PORT = 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

// page routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
})

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
})

// api routes
app.get('/api/notes', (req, res) => {
  res.json(db);
})

app.post('/api/notes', (req, res) => {
  req.body.id = uniqid();
  console.log(req.body);
  db.push(req.body);
  writeFile('./db/db.json', JSON.stringify(db), (err) => {
    err ? console.log(err) : console.log('all good')
  })
  res.json(db)
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
})

app.listen(PORT, () => {
  console.log(`Express listening at http://localhost:${PORT}`);
})