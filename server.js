const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const app = express();
app.use(express.static(path.join(__dirname, "ProgileImages")));

//! importing routs
const fileRoute = require("./routes/file");
const userRoute = require("./routes/user");
const commentRoute = require("./routes/comment");
const serchRoute = require("./routes/serch");

//! let us to accept form data
app.use(cors());
app.use(express.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// getting the post body
app.use(bodyParser.json());

// getting the post body
app.use(cookieParser());

//! connect to db
mongoose
  .connect(process.env.DBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log("Connected to the DB");
  })
  .catch((err) => console.log("Problem to connect to the db"));

//! activate routs
app.use("/user", userRoute);
app.use("/file", fileRoute);
app.use("/comment", commentRoute);
app.use("/search", serchRoute);

app.get("/image/:file", (req, res) => {
  let file = req.params.file;
  res.sendFile(path.join(__dirname + `/ProgileImages/${file}`));
});

app.get("/video/:file", (req, res) => {
  let file = req.params.file;
  res.sendFile(path.join(__dirname + `/VideoAudio/${file}`));
});

//! Server listen
app.listen(process.env.PORT || 2000, () => {
  console.log("The server is on");
});
