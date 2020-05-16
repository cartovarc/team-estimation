var functions = require("firebase-functions");
var admin = require("firebase-admin");
admin.initializeApp();

exports.getUser = functions.https.onCall((data, context) => {
  let user = admin.auth().getUserByEmail(data.email);
  return user;
});
