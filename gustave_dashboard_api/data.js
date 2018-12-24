// /backend/data.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const DataSchema = new Schema(
    {
        nom: String,
        prenom:String,
        tel: String,
        email: String,
        adresse: String,
        date: String,
        valid: { type: Number, default: 0 }
    },
    { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Data", DataSchema);