//Import dependencies
const express = require("express");
const fs = require("fs");
const path = require("path");

//Initialize the app
const app = express();

//Declare which port the app should listen to
var PORT = process.env.PORT || 3001;

//Connect to static file directory
app.use(express.static("public"));

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Connect to index (primary) page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

//Connect to notes page
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

//Read JSON file and get saved notes
app.get("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (err, data) => {
    if (err) {
      return console.error(err);
    } else {
      res.json(JSON.parse(data));
    }
  });
});

//POST route to take and save new notes
app.post("/api/notes", (req, res) => {
  const dockedNote = req.body;

  fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (err, data) => {
    if (err) {
      return console.error(err);
    } 
    let notes = JSON.parse(data);
    console.log(notes);
    if(notes.length > 0){

    let lastID = notes[notes.length-1].id;
    var id = parseInt(lastID + 1);
    } else {
        var id = 1;
    }

    let savedNote = {
        title: dockedNote.title,
        text: dockedNote.text,
        id: id
    }

    var notesArray = notes.slice(0);
    notesArray.push(savedNote);

    fs.writeFile(path.join(__dirname, "./db/db.json"), JSON.stringify(notesArray), (err) => {
        if (err) {
          return console.error(err);
        } else {
          res.json(notesArray);
        }
      });
  });
});

//DELETE route to delete a note
//app.delete();

//App listener on PORT
app.listen(PORT, () => {
  console.log(`Server now active at 'http://localhost:${PORT}'`);
});
