const { doc, getDoc } = require("firebase/firestore");
const { db } = require("../firebase");

module.exports.studentLogin = async (req, res) => {
  const { userType, username, password, std } = req.body;
  const docRef = doc(db, `class${std}`, "details");
  const detail = await getDoc(docRef);
  if (detail.exists() && userType === "student") {
    const data = detail.data();
    const student = JSON.parse(data[`${username}`]);
    if (student.username === username && student.password === password) {
      delete student["password"];
      return res.status(200).json({
        ...student,
        isLogged: true,
        msg: "Success",
        std,
      });
    } else {
      return res
        .status(200)
        .json({ isLogged: false, msg: "Password incorrect" });
    }
  } else {
    return res.json({ isLogged: false, msg: "User not found" });
  }
};

module.exports.teacherLogin = async (req, res) => {
  const { userType, username, password } = req.body;
  const docRef = doc(db, "teachers", username);
  const teacher = await getDoc(docRef);
  if (teacher.exists() && userType === "teacher") {
    if (teacher.username === username && teacher.password === password) {
      delete teacher["password"];
      return res.status(200).json({
        ...teacher,
        isLogged: true,
        msg: "Success",
      });
    } else {
      return res
        .status(200)
        .json({ isLogged: false, msg: "Password incorrect" });
    }
  } else {
    return res.json({ isLogged: false, msg: "User not found" });
  }
};
