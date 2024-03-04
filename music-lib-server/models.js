const db = require("./db");

// Define the subdocument schema for Song
const songSchema = new db.Schema({
    title:  { type: String, required: true },
    artist: { type: [String], required: true },
    releaseYear: { type: Number, default: new Date().getFullYear() },
    genre: { type: [String], required: true }
})

// Define the main schema for User
const userSchema = new db.Schema({
    username: { type: String, required: true },
    passwordHash: { type: String, required: true },
    songLibrary: [{ type: db.Schema.Types.ObjectId, ref: "Song" }]
})

// Create the models
const Song = db.model("Song", songSchema);
const User = db.model("User", userSchema);

module.exports = { 
    User: User,
    Song: Song 
};