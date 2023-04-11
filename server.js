//Import necessary modules:
//express
const express = require("express");
//fs
const fs = require("fs");
//path - provides utility functions for working with file and directory paths in a cross-platform manner, making it easier to work with file paths in a consistent way across different operating systems
const path = require("path");

const app = express();
//const port = 8080;
const port = process.env.PORT || 8080;
//const mainDir = path.join(__dirname, "./Develop/public");
const mainDir = path.join(__dirname, "Develop/public");

// Middleware for serving static files
//app.use(express.static('./Develop/public'));
app.use(express.static('Develop/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route for handling GET request to "/notes" URL
//__dirname = Node.js global variable= represents the current directory of the server.js file, and the "notes.html" file path is constructed by joining the __dirname with the relative path to the file
// This way can ensure that the file path is correct regardless of where server.js file is located in the file system.
app.get("/notes", (req, res) => {
    //res.sendFile(path.join(__dirname, "./Develop/public/notes.html"));
});

// Route for handling GET request to "/api/notes" URL
app.get("/api/notes", (req, res) => {
    //res.sendFile(path.join(__dirname, "./Develop/db/db.json"));
    res.sendFile(path.join(__dirname, "Develop/db/db.json"));
});

// Route for handling GET request to "/api/notes/:id" URL
app.get("/api/notes/:id", (req, res) => {
    //const filteredNotes = JSON.parse(fs.readFileSync("./Develop/db/db.json", "utf8"));
    const filteredNotes = JSON.parse(fs.readFileSync("Develop/db/db.json", "utf8"));
    res.json(filteredNotes[Number(req.params.id)]);
});

// Route for handling POST request to "/api/notes" URL
app.post("/api/notes", (req, res) => {
    //const filteredNotes = JSON.parse(fs.readFileSync("./Develop/db/db.json", "utf8"));
    const filteredNotes = JSON.parse(fs.readFileSync("Develop/db/db.json", "utf8"));
    const newNote = req.body;
    const uniqueID = (filteredNotes.length).toString();
    newNote.id = uniqueID;
    filteredNotes.push(newNote);
    fs.writeFileSync("./Develop/db/db.json", JSON.stringify(filteredNotes));
    console.log("Note saved to db.json. Content: ", newNote);
    res.json(filteredNotes);
});

// Route for handling DELETE request to "/api/notes/:id" URL
app.delete("/api/notes/:id", (req, res) => {
    //const savedNotes = JSON.parse(fs.readFileSync("./Develop/db/db.json", "utf8"));
    const savedNotes = JSON.parse(fs.readFileSync("Develop/db/db.json", "utf8"));
    const noteID = req.params.id;
    let newID = 0;
    console.log(`Deleting note with ID ${noteID}`);
    const filteredNotes = savedNotes.filter(noteToDelete => {
        return noteToDelete.id != noteID;
    });

    for (const noteToDelete of filteredNotes) {
        noteToDelete.id = newID.toString();
        newID++;
    }
    //fs.writeFileSync() method, passing in the path to the file and the data you want to write as arguments
    //fs.writeFileSync('path to file', JSON.stringify(data));
    //fs.writeFileSync("./Develop/db/db.json", JSON.stringify(filteredNotes));
    fs.writeFileSync("Develop/db/db.json", JSON.stringify(filteredNotes));
    res.json(filteredNotes);
});

// Route for handling all other requests with a fallback to "index.html"
app.get("*", (req, res) => {
    res.sendFile(path.join(mainDir, "index.html"));
});

// Start the server and listen for incoming requests
app.listen(port, () => {
    console.log(`Now listening to port ${port}!`);
});