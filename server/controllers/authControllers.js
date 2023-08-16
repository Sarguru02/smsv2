const { doc, getDoc } = require("firebase/firestore");
const { db } = require("../firebase");
const jwt = require("jsonwebtoken");

module.exports.studentLogin = async (req, res) => {
  const { userType, username, password, std } = req.body;
  const docRef = doc(db, `class${std}`, "details");
  const detail = await getDoc(docRef);
  if (detail.exists() && userType === "student") {
    const data = detail.data();
    const student = data[`${username}`];
    if (student.RollNo === username && student.Password === password) {
      delete student["Password"];
      const token = jwt.sign(
        {
          ...student,
          isLogged: true,
          msg: "Success",
          std,
          userType,
        },
        process.env.JWT_SECRET_KEY
      );
      return res.status(200).json({
        ...student,
        isLogged: true,
        msg: "Success",
        std,
        userType,
        token,
      });
    } else {
      const token = jwt.sign(
        {
          isLogged: false,
          msg: "Password incorrect",
        },
        process.env.JWT_SECRET_KEY
      );
      return res
        .status(200)
        .json({ isLogged: false, msg: "Password incorrect", token });
    }
  } else {
    const token = jwt.sign(
      {
        isLogged: false,
        msg: "User not found",
      },
      process.env.JWT_SECRET_KEY
    );
    return res.json({ isLogged: false, msg: "User not found" });
  }
};

module.exports.teacherLogin = async (req, res) => {
  const { userType, username, password } = req.body;
  const docRef = doc(db, "teachers", username);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists() && userType === "teacher") {
    const teacher = docSnap.data();
    if (teacher.username === username && teacher.password === password) {
      delete teacher["password"];
      const token = jwt.sign(
        {
          ...teacher,
          isLogged: true,
          msg: "Success",
          userType,
        },
        process.env.JWT_SECRET_KEY
      );
      return res.status(200).json({
        ...teacher,
        isLogged: true,
        msg: "Success",
        userType,
        token,
      });
    } else {
      const token = jwt.sign(
        { isLogged: false, msg: "Password incorrect" },
        process.env.JWT_SECRET_KEY
      );
      return res
        .status(200)
        .json({ isLogged: false, msg: "Password incorrect" });
    }
  } else {
    const token = jwt.sign(
      { isLogged: false, msg: "User not found" },
      process.env.JWT_SECRET_KEY
    );
    return res.json({ isLogged: false, msg: "User not found" });
  }
};

module.exports.checkLogin = async (req, res) => {};
