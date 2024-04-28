const express = require('express');
const path = require('path');
const {writeFile} = require('fs');
let db = require('./db/db.json');
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
  db.push(req.body);
  writeFile('./db/db.json', JSON.stringify(db), (err) => {
    err ? console.log(err) : console.log('Note added.')
  })
  res.json(db)
})

app.delete('/api/notes/:id', (req, res) => {
  db = db.filter(({id}) => id !== req.params.id);
  writeFile('./db/db.json', JSON.stringify(db), (err) => {
    err ? console.log(err) : console.log('Note added.')
  })
  res.json(db)
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
})

app.listen(PORT, () => {
  console.log(`Express listening at http://localhost:${PORT}`);
})