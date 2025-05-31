console.log("dashboard.js loaded!");
// Firebase config
const firebaseConfig = {
	apiKey:
		"AIzaSyCcDkFYWbzTelFDvANfSRfMCnEdJz0Ueug",
	authDomain: "learnerly-d8731.firebaseapp.com",
	projectId: "learnerly-d8731",
	storageBucket:
		"learnerly-d8731.firebasestorage.app",
	messagingSenderId: "564343825391",
	appId:
		"1:564343825391:web:f3b6293e8e59352613cc1a",
	measurementId: "G-SJWGRR8CTF",
	databaseURL:
		"https://learnerly-d8731-default-rtdb.asia-southeast1.firebasedatabase.app"
};

console.log("Initializing Firebase app...");
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();

console.log("Waiting for auth state change...");
auth.onAuthStateChanged(function (user) {
	if (!user) {
		console.log(
			"No user authenticated. Redirecting to login."
		);
		window.location.href =
			"/Learnerly/home/login.html";
		return;
	}
	const uid = user.uid;
	console.log("Authenticated user:", uid);

	// Retrieve and update user info
	const userRef = db.ref("users/" + uid);
	console.log(
		"Setting up listener for user info at:",
		"users/" + uid
	);
	userRef.on("value", function (snapshot) {
		const userInfo = snapshot.val();
		console.log("User info snapshot:", userInfo);

		if (!userInfo) {
			console.log(
				"No user info found. Redirecting to preDash."
			);
			window.location.href =
				"/Learnerly/main/preDash.html";
			return;
		}

		document.getElementById("profile-pic").src =
			userInfo.profilePic ||
			"https://randomuser.me/api/portraits/men/32.jpg";
		document.getElementById("nav-pic").src =
			userInfo.profilePic ||
			"https://randomuser.me/api/portraits/men/32.jpg";
		console.log(
			"Set profile-pic:",
			userInfo.profilePic
		);

		document.getElementById(
			"profile-name"
		).textContent = userInfo.name || "";
		document.getElementById(
			"nav-name"
		).innerText = userInfo.name
			? userInfo.name.split(" ")[0].trim()
			: "";
		console.log(
			"Set profile-name:",
			userInfo.name
		);

		document.getElementById(
			"profile-grade"
		).textContent = userInfo.grade
			? `Grade ${userInfo.grade}`
			: "";
		console.log(
			"Set profile-grade:",
			userInfo.grade
		);

		document.getElementById(
			"profile-level"
		).textContent = userInfo.level || "";
		console.log(
			"Set profile-level:",
			userInfo.level
		);

		document.getElementById(
			"profile-points"
		).textContent = userInfo.points || "0";
		console.log(
			"Set profile-points:",
			userInfo.points
		);

		document.getElementById(
			"profile-rank"
		).textContent = userInfo.rank || "";
		console.log(
			"Set profile-rank:",
			userInfo.rank
		);

		document.getElementById("crd").textContent =
			userInfo.credits || 0;
		console.log("Set credits:", userInfo.credits);

		document.getElementById(
			"profile-progress"
		).textContent = userInfo.progress
			? `${userInfo.progress}%`
			: "0%";
		console.log(
			"Set profile-progress:",
			userInfo.progress
				? `${userInfo.progress}%`
				: "0%"
		);
  const profileProgressElem = document.getElementById("profile-progress");
  const progressBar = document.querySelector(".progress-bar.bg-success");
  const points = Number(userInfo.points) || 0;
  const maxPoints = 20000;
  let percent = Math.min((points / maxPoints) * 100, 100);

  if (profileProgressElem) {
    profileProgressElem.textContent = `${percent.toFixed(1)}%`;
  }
  if (progressBar) {
    progressBar.style.width = `${percent}%`;
    progressBar.setAttribute("aria-valuenow", percent.toFixed(1));
    if (points > maxPoints) {
      progressBar.classList.remove("bg-success");
      progressBar.classList.add("bg-primary");
    } else {
      progressBar.classList.remove("bg-primary");
      progressBar.classList.add("bg-success");
    }
  }


		if (userInfo.courses) {
			console.log(
				"User courses:",
				userInfo.courses
			);
		}
	});

	// Retrieve and update leaderboard
	const leaderboardRef = db.ref("leaderboard");
	console.log(
		"Setting up listener for leaderboard at: leaderboard"
	);
	leaderboardRef.on("value", function (snapshot) {
		const leaderboard = snapshot.val();
		console.log(
			"Leaderboard snapshot:",
			leaderboard
		);

		const leaderboardList =
			document.getElementById("leaderboard-list");
		if (!leaderboardList) {
			console.log(
				"No leaderboard-list element found in DOM."
			);
			return;
		}
		leaderboardList.innerHTML = "";

		// Support both array and object leaderboard formats
		let entries = [];
		if (Array.isArray(leaderboard)) {
			entries = leaderboard.filter(Boolean); // Remove nulls if any
		} else if (
			typeof leaderboard === "object" &&
			leaderboard !== null
		) {
			// Convert object with rank keys to sorted array
			entries = Object.keys(leaderboard)
				.sort((a, b) => Number(a) - Number(b))
				.map((rank) => leaderboard[rank]);
		}

		entries.forEach((entry, idx) => {
			leaderboardList.innerHTML += `
        <li class="list-group-item d-flex align-items-center justify-content-between">
          <span>
            <img src="${
							entry.profilePic ||
							"https://ui-avatars.com/api/?name=" +
								encodeURIComponent(
									entry.name || ""
								)
						}" class="rounded-circle me-2" width="36" height="36" />
            <span class="fw-bold">#${idx + 1} ${
				entry.name || ""
			}</span>
            <span class="text-muted ms-2">${
							entry.grade
								? "Grade " + entry.grade
								: ""
						}</span>
          </span>
          <span class="fw-bold">${
						entry.points || 0
					}</span>
        </li>
      `;
			console.log(
				`Added leaderboard entry #${idx + 1}:`,
				entry
			);
		});
	});
});

// Logout handler
document.addEventListener(
	"DOMContentLoaded",
	function () {
		const logoutBtn =
			document.getElementById("logout-btn");
		if (logoutBtn) {
			logoutBtn.addEventListener(
				"click",
				function (e) {
					e.preventDefault();
					auth.signOut().then(() => {
						window.location.href =
							"/Learnerly/home/login.html";
					});
				}
			);
		}
	}
);
