const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");

//require these routes created seperately
const authRoute = require("./routes/Authentication/authApi.js");
const newsFeeder = require("./routes/NewsFeeder/newsFeedApi.js");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/news", newsFeeder)
app.use(authRoute);

// sendSMTPMail()

//export route for unit testing and chat
module.exports = app;