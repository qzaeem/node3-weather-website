const path = require("path");
const express = require('express');
const hbs = require("hbs");
const geocode = require("./utils/geocode.js");
const forecast = require("./utils/forecast.js");

const app = express();
const port = process.env.PORT || 3000;

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
    res.render("index", {
        title: "Weather App",
        name: "Zaeem Qureshi"
    });
});

app.get("/about", (req, res) => {
    res.render("about", {
        title: "About Me",
        name: "Zaeem Qureshi"
    });
});

app.get("/help", (req, res) => {
    res.render("help", {
        title: "Help",
        message: "This is the landing page for help.",
        name: "Zaeem Qureshi"
    });
});

app.get("/weather", (req, res) => {
    const query = req.query;

    if (!req.query.address) {
        return res.send({
            error: "The address field is missing"
        });
    }

    geocode(req.query.address, (error, { longitude, latitude, location } = {}) => {
        if (error) {
            return res.send({
                error
            });
        }
        forecast({ latitude: latitude, longitude: longitude }, (error, { forecast } = {}) => {
            if (error) {
                return res.send({
                    error
                });
            }

            res.send({
                forecast,
                location,
                address: req.query.address
            });
        });
    });
});

app.get("/help/*", (req, res) => {
    res.render("error", {
        title: "404",
        message: "Help article not found."
    });
});

app.get("*", (req, res) => {
    res.render("error", {
        title: "404",
        message: "Page not found."
    });
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}.`);
});