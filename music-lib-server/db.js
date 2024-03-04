const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/music_lib_db");
module.exports = mongoose;