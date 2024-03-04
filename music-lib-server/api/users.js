const jwt = require("jwt-simple");
const { User, Song } = require("../models");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const ObjectId = require("mongodb").ObjectId;

// For encoding/decoding JWT
const secret = "mapleleafs";

// Add a new user to the database
router.post("/register", async function(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Missing username and/or password" });
        
    }

    const user = await User.findOne({ username: username });

    // Username already exists
    if (user) {
        return res.status(409).json({ error: "Username already exists" });
    }

    // Create a hash for the submitted password
    const hash = bcrypt.hashSync(password, 10);

    const newUser = new User({
        username: req.body.username,
        passwordHash: hash
    });

    // Save new user
    const savedNewUser = await newUser.save();

    // Saving error occurred
    if (!savedNewUser) {
        return res.status(400).json({ error: "Server Error" });
    }

    // New user created
    res.sendStatus(201);
});

// User authentication - sends a token when username/password are valid
router.post("/login", async function(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Missing username and/or password" });
    }

    // Find user from the database
    const user = await User.findOne({ username: username });

    // Username not found
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    // Compare given password with database password hash
    if (bcrypt.compareSync(password, user.passwordHash)) {
        // Create and send a JWT that contains the username
        const token = jwt.encode({ username: user.username }, secret);
        res.json({ token: token });
    }
    else {
        res.status(401).json({ error: "Bad password" });
    }
});

// Get list of all songs under user profile
router.get("/songs", async function(req, res) {

    // Check if the X-Auth header is set
    if (!req.headers["x-auth"]) {
        res.status(401).json({ error: "Missing X-Auth header" });
        return;
    }

    const token = req.headers["x-auth"];

    try {
        const decoded = jwt.decode(token, secret);
        
        try {
            let query = {};

            // Artist is specified
            if (req.query.artist) {
                query = { artist: req.query.artist };
            }
            // Genre is specified
            if (req.query.genre) {
                query = { genre: req.query.genre };
            }

            const user = await User.findOne({ username: decoded.username }).populate({
                path: 'songLibrary',
                match: query    // If filter was specified
            });

            if (!user) {
                return res.status(404);
            }

            // Filter out null values as an extra check
            const filteredSongs = user.songLibrary.filter(song => song !== null);

            if (filteredSongs.length === 0) {
                return res.status(404).json({ error: "No songs matched" });
            }

            res.status(200).json(filteredSongs);
        }
        catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    catch (ex) {
        res.status(401).json({ error: "Invalid JWT" });
    }
});

// Get song by ID
router.get("/songs/:id", async function(req, res) {

    // Check if the X-Auth header is set
    if (!req.headers["x-auth"]) {
        return res.status(401).json({ error: "Missing X-Auth header" });
    }

    const token = req.headers["x-auth"];

    // Get song id from request and convert to ObjectId type
    const songId = new ObjectId(req.params.id);

    try {
        const decoded = jwt.decode(token, secret);

        try {
            const user = await User.findOne({ username: decoded.username }).populate('songLibrary');

            if (!user) {
                return res.sendStatus(404);
            }

            const song = user.songLibrary.find(song => song._id.equals(songId));

            if (!song) {
                return res.sendStatus(404);
            }
            
            return res.status(200).json(song);
        }
        catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    catch (ex) {
        res.status(401).json({ error: "Invalid JWT" });
    }
})

// Add a new song under user profile
router.post("/songs", async function(req, res) {
    
    // Check if the X-Auth header is set
    if (!req.headers["x-auth"]) {
        res.status(401).json({ error: "Missing X-Auth header" });
        return;
    }
    
    const token = req.headers["x-auth"];

    try {
        const decoded = jwt.decode(token, secret);

        try {
            // Find the user by username
            const user = await User.findOne({ username: decoded.username });

            // Create a new song instance from info passed through req.body and save it
            const newSong = new Song(req.body);
            await newSong.save();

            // Add the new song to the user's songLibrary
            user.songLibrary.push(newSong);

            // Save the updated user
            await user.save();

            res.sendStatus(204);
        }
        catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    catch (ex) {
        res.status(401).json({ error: "Invalid JWT" });
    }
});

// Update an existing song using song ID
router.put("/songs/:id", async function(req, res) {

    // Check if the X-Auth header is set
    if (!req.headers["x-auth"]) {
        res.status(401).json({ error: "Missing X-Auth header" });
        return;
    }

    const token = req.headers["x-auth"];

    // Get song id from request and convert to ObjectId type
    const songId = new ObjectId(req.params.id); 

    // Song to update sent with body of request
    const { title, artist, releaseYear, genre } = req.body;
    
    try {

        const decoded = jwt.decode(token, secret);

        try {
            const user = await User.findOne({ username: decoded.username}).populate('songLibrary');

            if (!user) {
                return res.sendStatus(404);
            }

            const songToUpdate = user.songLibrary.find(song => song._id.equals(songId));

            if (!songToUpdate) {
                return res.sendStatus(404);
            }

            songToUpdate.set({ title, artist, releaseYear, genre });

            await user.save();

            // Update song in Song collection
            await Song.updateOne({ _id: req.params.id }, req.body);

            res.sendStatus(204);
        }
        catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    catch (ex) {
        res.status(401).json({ error: "Invalid JWT" });
    }
})

// Delete a song using song ID
router.delete("/songs/:id", async function(req, res) {

    // Check if the X-Auth header is set
    if (!req.headers["x-auth"]) {
        res.status(401).json({ error: "Missing X-Auth header" });
        return;
    }

    const token = req.headers["x-auth"];

    // Get song id from request and convert to ObjectId type
    const songId = new ObjectId(req.params.id); 

    try {
        const decoded = jwt.decode(token, secret);

        try {
            const user = await User.findOne({ username: decoded.username });

            if (!user) {
                return res.sendStatus(404);
            }

            // Remove the song from songLibrary
            user.songLibrary = user.songLibrary.filter(song => !song._id.equals(songId));

            // Save the updated user
            await user.save();

            // Remove the song from the Song collection
            const deleteResult = await Song.deleteOne({ _id: songId });

            if (!deleteResult) {
                return res.sendStatus(404);
            }

            res.sendStatus(204); 
        }
        catch (error) {
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    catch (ex) {
        res.status(401).json({ error: "Invalid JWT" });
    }
})

module.exports = router;
