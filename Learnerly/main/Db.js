import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  push,
  get,
  update,
  remove,
  onValue,
} from "firebase/database";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCcDkFYWbzTelFDvANfSRfMCnEdJz0Ueug",

  authDomain: "learnerly-d8731.firebaseapp.com",

  projectId: "learnerly-d8731",

  storageBucket: "learnerly-d8731.firebasestorage.app",

  messagingSenderId: "564343825391",

  appId: "1:564343825391:web:f3b6293e8e59352613cc1a",

  measurementId: "G-SJWGRR8CTF",

  databaseURL: "https://learnerly-d8731-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Write data
export function writeData(path, data) {
  return set(ref(db, path), data);
}

// Push data (auto-generated key)
export function pushData(path, data) {
  return push(ref(db, path), data);
}

// Read data once
export async function readData(path) {
  const snapshot = await get(ref(db, path));
  return snapshot.exists() ? snapshot.val() : null;
}

// Listen for data changes
export function onDataChange(path, callback) {
  return onValue(ref(db, path), (snapshot) => {
    callback(snapshot.exists() ? snapshot.val() : null);
  });
}

// Update data
export function updateData(path, data) {
  return update(ref(db, path), data);
}

//Remove data from the specified path
export function removeData(path) {
  return remove(ref(db, path));
}

const auth = firebase.auth();

auth.onAuthStateChanged(function (user) {
  if (!user) {
    window.location.href = "/Learnerly/home/login.html";
    return;
  }
  db.ref("users/" + user.uid).on("value", function (snapshot) {
    const userInfo = snapshot.val();
    if (!userInfo) {
      window.location.href = "/Learnerly/main/preDash.html";
      return;
    }
    document.getElementById("profile-pic").src = userInfo.profilePic || "";
    document.getElementById("profile-name").textContent = userInfo.name || "";
    document.getElementById("profile-grade").textContent = userInfo.grade
      ? `Grade ${userInfo.grade}`
      : "";
    // Add other fields as needed
  });
});

