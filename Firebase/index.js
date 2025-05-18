const firebaseConfig = {
  apiKey: "AIzaSyCcDkFYWbzTelFDvANfSRfMCnEdJz0Ueug",

  authDomain: "learnerly-d8731.firebaseapp.com",

  databaseURL:
    "https://learnerly-d8731-default-rtdb.asia-southeast1.firebasedatabase.app",

  projectId: "learnerly-d8731",

  storageBucket: "learnerly-d8731.firebasestorage.app",

  messagingSenderId: "564343825391",

  appId: "1:564343825391:web:f3b6293e8e59352613cc1a",

  measurementId: "G-SJWGRR8CTF",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
let counter=0;
// Initialize Realtime Database and get a reference to the service
const database = firebase.database();
function writeUserData(userId, name, email) {
  firebase.database().ref('users/' + (userId)).set({
    username: name,
    email: email
  });
}

function submitInf(){
    counter+=1;
    let name= document.getElementById("name").value;
    let email=document.getElementById("mail").value;
    writeUserData(counter,name,email);
}