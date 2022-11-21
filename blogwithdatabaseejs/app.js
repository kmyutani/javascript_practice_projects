

/* IMPORTS */
require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose');
const ejs = require("ejs");
const mainRoutes = require('./routes/main-route');

/* CONSTANTS */
const app = express();

// Replace all process.env with your own values
// Add your connection string from your mongoDB Atlast Cluster
const connectionString = process.env.CONNECTION_STRING

const PORT = process.env.PORT || 3000;

/* MAIN */
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

mongoose.connect(
  connectionString,
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  }
);

app.use('/', mainRoutes);


app.listen(PORT, function() {
  console.log(`Server is running on port ${PORT}`);
});
