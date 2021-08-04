const mongoose = require("mongoose");

async function connectionDB() {
  await mongoose.connect(process.env.DBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });

  //check error in db connection
  mongoose.connection.on("error", function () {
    console.error.bind(console, "connection error");
  });

  //log successful db connection
  mongoose.connection.once("open", function () {
    console.log("Database connection was successful");
  });
}

exports.connectionDB = connectionDB;
