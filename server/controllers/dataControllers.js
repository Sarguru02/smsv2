const { collection, getDocs } = require("firebase/firestore");
const { db } = require("../firebase");

module.exports.getData = async (req, res) => {
  const { std, username } = req.body;
  const colRef = collection(db, `class${std}`);
  const docs = await getDocs(colRef);
  var returnData = {};
  docs.forEach((doc) => {
    if (doc.id !== "details") {
      const data = doc.data();
      const required = data[username];
      const dat = JSON.parse(`{"${doc.id}":${required}}`);
      returnData = { ...returnData, ...dat };
    }
  });
  console.log(returnData);
  return res.json(returnData);
};
