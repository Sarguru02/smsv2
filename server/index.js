require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { studentLogin, teacherLogin } = require("./controllers/authControllers");
const { getData, uploadData } = require("./controllers/dataControllers");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

app.get("/", (req, res) => {
  return res.send("Everything okay");
});

app.post("/student/login", studentLogin);

app.post("/student/data", getData);

app.post("/teacher/login", teacherLogin);

app.post("/teacher/upload", uploadData);

port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
