// express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./.env" });
const app = require("./app");

// console.log(process.env)
const DB = process.env.DATABASE;
// console.log(DB,'\n');
/**
 * to connect to the atlas database
 * we shoukd have to link the current
 * ip address to it in the browser
 */
mongoose
  .connect(process.env.DATABASE_LOCAL)
  .then(() => {
    //console.log(con.connections);//this log give all deatil information of the database
    console.log("Db connection successful");
  })
  .catch((err) => {
    console.log("not connected to the database", err);
  });

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
