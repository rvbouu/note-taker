// declaring dependencies and variables
const express = require('express');
const path = require('path');
const {writeFile} = require('fs');
let db = require('./db/db.json');
const uniqid = require('uniqid');

// setting PORT variable up for Render deployment
const PORT = process.env.PORT || 3001;
// initializing express.js
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

// page routes
// setting default page to index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
})

// directing to notes.html
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
})

// api routes
// reads db.json and returns the contents as JSON for fetch in index.js
app.get('/api/notes', (req, res) => {
  res.json(db);
})

// adds unique id to each note submitted
// pushes the content of request from user to db.json
// writes a new file that includes the new note and any previous notes to override the previous db.json 
app.post('/api/notes', (req, res) => {
  req.body.id = uniqid();
  db.push(req.body);
  writeFile('./db/db.json', JSON.stringify(db), (err) => {
    err ? console.log(err) : console.log('Note added.')
  })
  res.json(db)
})

// deletes note from db.json when user clicks on the delete button attached to the note
// filters out any notes with ids that do not match the id from the request
// writes a new file with the deleted note left out to override the previous db.json
app.delete('/api/notes/:id', (req, res) => {
  db = db.filter(({id}) => id !== req.params.id);
  writeFile('./db/db.json', JSON.stringify(db), (err) => {
    err ? console.log(err) : console.log('Note deleted.')
  })
  res.json(db)
})

// catch all path that will return the user to the index.html page when they try to navigate to a page that doesn't exist
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
})


// lets express.js know it can run on specific port
app.listen(PORT, () => {
  console.log(`Express listening at http://localhost:${PORT}`);
})