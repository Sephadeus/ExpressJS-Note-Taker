//Import dependencies
const express = require('express');
const fs = require('fs');
const path = require('path');


//Initialize the app
const app = express();

//Declare which port the app should listen to
let PORT = process.env.PORT || 4000;

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Connect to static file directory
app.use(express.static(__dirname + '/public'));

//Connect to index (primary) page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

//Connect to notes page
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"))
});



