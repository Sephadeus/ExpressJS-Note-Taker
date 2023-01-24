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

//Get data from the request body
  const dockedNote = req.body;

//Read json file to get current notes
  fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (err, data) => {
    if (err) {
      return console.error(err);
    }

//Assign values in json file to array in temporary variable
    let notes = JSON.parse(data);
    console.log(notes);

    //If array has values, assign ID value to be one more than the previous ID
    if (notes.length > 0) {
      let lastID = notes[notes.length - 1].id;
      var id = parseInt(lastID + 1);

        //If array is vacant give the first note a value of one
    } else {
      var id = 1;
    }

    //Create new note from data stored in the request body
    let savedNote = {
      title: dockedNote.title,
      text: dockedNote.text,
      id: id,
    };

    //Copy the array of notes
    var notesArray = notes.slice(0);
    //Push new note onto clone array and save to file
    notesArray.push(savedNote);

    fs.writeFile(
      path.join(__dirname, "./db/db.json"),
      JSON.stringify(notesArray),
      (err) => {
        if (err) {
          return console.error(err);
        } else {
          res.json(notesArray);
        }
      }
    );
  });
});

//DELETE route to delete a note
app.delete("/api/notes/:id", (req, res) => {

//Get ID from request parameters
  let idToDelete = req.params.id;

//Read the json file and assign array of values to a temporary variable
  fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (err, data) => {
    if (err) {
      return console.error(err);
    }

    let notes = JSON.parse(data);
    console.log(notes);

    //Loop through the array until one has an ID that matches the one to be deleted
    for (let i = 0; i < notes.length; i++) {
      if (notes[i].id == idToDelete) {
        var notesArray = notes.splice(i, 1);

    //Save the altered array to the json file
        fs.writeFile(
          path.join(__dirname, "./db/db.json"),
          JSON.stringify(notesArray),
          (err, data) => {
            if (err) {
              return console.error(err);
            }
              res.json(notesArray);
            })
          }
      }
    });
});


//App listener on PORT
app.listen(PORT, () => {
  console.log(`Server now active at 'http://localhost:${PORT}'`);
});
