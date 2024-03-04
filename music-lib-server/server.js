const morgan = require("morgan");
const express = require("express");
const cors = require("cors");

const app = express();

// Middleware that parses HTTP requests with JSON body
app.use(express.json());

// Shows HTTP requests in the console
app.use(morgan("dev"));

// CORS to allow requests from any origin
app.use(cors());

// Create endpoint http://localhost:8000/api
app.use("/api", require("./api/users"));

const port = 8000;
app.listen(port, () => console.log(`Server listening on port ${port}`));

module.exports = app;