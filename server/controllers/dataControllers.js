const { collection, getDocs, doc, setDoc } = require("firebase/firestore");
const { db } = require("../firebase");

module.exports.getData = async (req, res) => {
  const { std, RollNo } = req.body;
  const colRef = collection(db, `class${std}`);
  const docs = await getDocs(colRef);
  var returnData = {};
  docs.forEach((doc) => {
    if (doc.id !== "details") {
      const data = doc.data();
      const required = data[RollNo];
      const dat = JSON.parse(`{"${doc.id}":${JSON.stringify(required)}}`);
      returnData = { ...returnData, ...dat };
    }
  });
  return res.json(returnData);
};

module.exports.uploadData = async (req, res) => {
  const data = req.body;
  const std = data["std"];
  delete data["std"];
  const keys = Object.keys(data);
  for (var i = 0; i < keys.length; i++) {
    const docRef = doc(db, `class${std}`, keys[i]);
    await setDoc(docRef, data[keys[i]]);
  }
  res.status(200).send("ok");
};
