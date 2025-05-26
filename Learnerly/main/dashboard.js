
console.log("dashboard.js loaded!");
// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCcDkFYWbzTelFDvANfSRfMCnEdJz0Ueug",
  authDomain: "learnerly-d8731.firebaseapp.com",
  projectId: "learnerly-d8731",
  storageBucket: "learnerly-d8731.firebasestorage.app",
  messagingSenderId: "564343825391",
  appId: "1:564343825391:web:f3b6293e8e59352613cc1a",
  measurementId: "G-SJWGRR8CTF",
  databaseURL: "https://learnerly-d8731-default-rtdb.asia-southeast1.firebasedatabase.app",
};

console.log("Initializing Firebase app...");
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

console.log("Waiting for auth state change...");
auth.onAuthStateChanged(function(user) {
  if (!user) {
    console.log("No user authenticated. Redirecting to login.");
    window.location.href = "/Learnerly/home/login.html";
    return;
  }
  const uid = user.uid;
  console.log("Authenticated user:", uid);

  // Retrieve and update user info
  const userRef = db.ref("users/" + uid);
  console.log("Setting up listener for user info at:", "users/" + uid);
  userRef.on("value", function(snapshot) {
    const userInfo = snapshot.val();
    console.log("User info snapshot:", userInfo);

    if (!userInfo) {
      console.log("No user info found. Redirecting to preDash.");
      window.location.href = "/Learnerly/main/preDash.html";
      return;
    }

    document.getElementById("profile-pic").src = userInfo.profilePic || "https://randomuser.me/api/portraits/men/32.jpg";
    document.getElementById("nav-pic").src = userInfo.profilePic || "https://randomuser.me/api/portraits/men/32.jpg";
    console.log("Set profile-pic:", userInfo.profilePic);

    document.getElementById("profile-name").textContent = userInfo.name || "";
    document.getElementById("nav-name").innerText = userInfo.name ? userInfo.name.split(" ")[0].trim() : "";
    console.log("Set profile-name:", userInfo.name);

    document.getElementById("profile-grade").textContent = userInfo.grade ? `Grade ${userInfo.grade}` : "";
    console.log("Set profile-grade:", userInfo.grade);

    document.getElementById("profile-level").textContent = userInfo.level || "";
    console.log("Set profile-level:", userInfo.level);

    document.getElementById("profile-points").textContent = userInfo.points || "0";
    console.log("Set profile-points:", userInfo.points);

    document.getElementById("profile-rank").textContent = userInfo.rank || "";
    console.log("Set profile-rank:", userInfo.rank);

    document.getElementById("crdk").textContent = userInfo.credits || 0;
    console.log("Set credits:", userInfo.credits);

    const progress = userInfo.progress || 0;
    const progressBar = document.querySelector(".progress-bar.bg-success");
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
      progressBar.setAttribute("aria-valuenow", progress);
      console.log("Set progress bar to:", progress, "%");
    }

    if (userInfo.courses) {
      console.log("User courses:", userInfo.courses);
    }
  });

  // Retrieve and update leaderboard
  const leaderboardRef = db.ref("leaderboard");
  console.log("Setting up listener for leaderboard at: leaderboard");
  leaderboardRef.on("value", function(snapshot) {
    const leaderboard = snapshot.val();
    console.log("Leaderboard snapshot:", leaderboard);

    const leaderboardList = document.getElementById("leaderboard-list");
    if (!leaderboardList) {
      console.log("No leaderboard-list element found in DOM.");
      return;
    }
    leaderboardList.innerHTML = "";
    if (Array.isArray(leaderboard)) {
      leaderboard.forEach((entry, idx) => {
        leaderboardList.innerHTML += `
          <li class="list-group-item d-flex align-items-center justify-content-between">
            <span>
              <img src="${entry.profilePic}" class="rounded-circle me-2" width="36" height="36" />
              <span class="fw-bold">#${idx + 1} ${entry.name}</span>
              <span class="text-muted ms-2">Grade ${entry.grade}</span>
            </span>
            <span class="fw-bold">${entry.points}</span>
          </li>
        `;
        console.log(`Added leaderboard entry #${idx + 1}:`, entry);
      });
    } else {
      console.log("Leaderboard is not an array.");
    }
  });
});
