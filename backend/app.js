// ~/Desktop/tender-management-system/backend/app.js

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Tender Management");
});

module.exports = app;
