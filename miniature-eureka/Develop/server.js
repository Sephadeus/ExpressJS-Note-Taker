//Import dependencies
const express = require("express");
const fs = require("fs");
const path = require("path");

//Initialize the app
const app = express();

//Declare which port the app should listen to
let PORT = process.env.PORT || 4000;

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Connect to static file directory
app.use(express.static(__dirname + "/public"));

//Connect to index (primary) page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

//Connect to notes page
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

//Read JSON file and get saved notes
app.get("/api/notes", (req, res) => {
    fs.readFile(path.join(__dirname, "./db/db.json"), "utf8", (err, data) => {
        if(err) {
            return console.error(err);
        } else {
            res.json(JSON.parse(data));
        }
    })
})
