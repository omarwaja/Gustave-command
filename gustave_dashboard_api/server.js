const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require("./data");
const nodemailer = require("./nodemailer");
const path = require("path");

const API_PORT = 3001;
const app = express();
const router = express.Router();

// this is our MongoDB database
const dbRoute = "mongodb://gustave:mercigustave774411@ds121652.mlab.com:21652/gustave";

// connects our back end code with the database
mongoose.connect(
    dbRoute,
    { useNewUrlParser: true }
);

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));



// ***************************************** 
app.use('/',express.static(path.join(__dirname, "/build")));
app.use('/addcommand', express.static(path.join(__dirname, "/build")));

// ***************************************** 


// this is our get method
// this method fetches all available data in our database
router.get("/getData", (req, res) => {
    Data.find((err, data) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: data });
    });
});

// this is our validation method
// this method overwrites existing data in our database
//this method send a validation email 
router.post("/acceptcommand", (req, res) => {
    const { command } = req.body;
    console.log(command._id);
    nodemailer.send(command, 1);   
    Data.findOneAndUpdate({_id: command._id}, {valid: 1}, err => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
    });
});

// this is our rejection method
// this method overwrites existing data in our database
//this method send a rejection email 
router.post("/rejectcommand", (req, res) => {
    const { command } = req.body;
    console.log(command._id);
    nodemailer.send(command, -1);
    Data.findOneAndUpdate({ _id: command._id }, { valid: -1 }, err => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
    });
});

// this is our delete method
// this method removes existing data in our database
router.delete("/deleteData", (req, res) => {
    const { _id } = req.body;
    Data.findOneAndDelete(_id, err => {
        if (err) return res.send(err);
        return res.json({ success: true });
    });
});

// this is our create methid
// this method adds new data in our database
router.post("/putData", (req, res) => {
    let data = new Data();
    const { nom, prenom, tel, email, adresse, date } = req.body;
    data.nom= nom;
    data.prenom = prenom;
    data.tel = tel;
    data.email = email;
    data.adresse = adresse;
    data.date= date;
    data.save(err => {
        if (err) {
            res.status(500).send({ erreur: 'Server error' });
        } else {
            res.status(200).send({ succès: 'Ajout fait avec succès' });
        }
    });
});

// append /api for our http requests
app.use("/api", router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));