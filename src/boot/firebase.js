import { firebaseConfig } from "../../credentials/firebase-config.js";

var firebase = require("firebase/app");

require("firebase/auth");
require("firebase/database");
require("firebase/functions");

let firebaseApp = firebase.initializeApp(firebaseConfig);
let firebaseAuth = firebaseApp.auth();
let firebaseDb = firebaseApp.database();
let firebaseFunctions = firebaseApp.functions();

export { firebase, firebaseAuth, firebaseDb, firebaseFunctions };
