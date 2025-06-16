/********************************************************************************
*  WEB322 – Assignment 03
* 
*  I declare that this assignment is my own work in accordance with Seneca's
*  Academic Integrity Policy:
* 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
* 
*  Name: Daniel Kim Student ID: 100118231 Date: June 15, 2025
*
*  Published URL: web-322-assignment3-m4uuzb7k2-daniel-kims-projects-8aec376b.vercel.app
*
********************************************************************************/

// necessary modules for server
const express = require("express"); // handles requests and responses
const path = require("path"); // handle safe file paths
const cors = require("cors"); // middle ware for cross-sharing
const projectData = require("./modules/projects"); // handles project related data logic (initialization, etc.)

// application setup
const app = express();
const port = process.env.PORT || 3000;

// middle ware setup
app.use(cors()); //allow cross-origin requests
app.use(express.json()); //parse JSON bodies
app.use(express.urlencoded({ extended: true })); //parse URL-encoded bodies forms
app.use(express.static(path.join(__dirname, "public")));

// initialization of project data
projectData
    .Initialize()
    .then(() => {
        console.log("Projects initialized successfully.");
    })
    .catch((error) => {
        console.error("Error initializing projects:");
    });

// route for home
app.get("/", (request, response) => {
  response.sendFile(path.join(__dirname, "views", "home.html"));
});
// route for about
app.get("/about", (request, response) => {
  response.sendFile(path.join(__dirname, "views", "about.html"));
});

// get projects by sector
app.get("/solutions/projects/", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    if (!req.query.sector) {
        return res.status(400).json({ error: "Sector query parameter is required." });
    }
    const projectSector = req.query.sector; //known projectSector value from sectorData

    projectData
        .getProjectsBySector(projectSector.toLowerCase())
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            res.sendFile(path.join(__dirname, "views", "404.html")); // error page
        });
});

// get projects by ID
app.get("/solutions/projects/:id", (req, res) => {
    res.setHeader("Content-Type", "application/json");

    const projectId = req.params.id; //known projectId value from projectData

    projectData
        .getProjectsById(parseInt(projectId, 10))
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
             res.sendFile(path.join(__dirname, "views", "404.html"));
        });
});

// middle ware that catches any requests that does not match
app.use((request, response) => {
  response.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

//starts the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

//export app for testing
module.exports = app; // Export the app 
