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
if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

const searchBtn =
	document.getElementById("search-btn");
const searchInput = document.getElementById(
	"search-input"
);
const userDetails = document.getElementById(
	"user-details"
);
const noUser = document.getElementById("no-user");
const suggestionsBox = document.getElementById(
	"suggestions"
);
const refreshBtn = document.getElementById(
	"refresh-leaderboard-btn"
);
const leaderboardList = document.getElementById(
	"leaderboard-list"
);
const lbRefreshMsg = document.getElementById(
	"lb-refresh-msg"
);

let currentUid = null;
let usersCache = null;

// Fetch all users once for suggestions (for small/medium user bases)
function fetchUsersCache() {
	if (usersCache)
		return Promise.resolve(usersCache);
	return db
		.ref("users")
		.once("value")
		.then((snap) => {
			usersCache = snap.val() || {};
			return usersCache;
		});
}

// Show suggestions as you type
searchInput.addEventListener(
	"input",
	function () {
		const query = searchInput.value
			.trim()
			.toLowerCase();
		if (!query) {
			suggestionsBox.style.display = "none";
			return;
		}
		fetchUsersCache().then((users) => {
			const matches = [];
			Object.entries(users).forEach(
				([uid, data]) => {
					if (
						uid.toLowerCase().includes(query) ||
						(data.name &&
							data.name
								.toLowerCase()
								.includes(query))
					) {
						matches.push({ uid, ...data });
					}
				}
			);
			renderSuggestions(matches, query);
		});
	}
);

function renderSuggestions(matches, query) {
	if (!matches.length) {
		suggestionsBox.style.display = "none";
		return;
	}
	suggestionsBox.innerHTML = matches
		.slice(0, 10)
		.map(
			(user) => `
      <div class="suggestion-item" data-uid="${
				user.uid
			}">
        <img class="suggestion-pic" src="${
					user.profilePic ||
					"https://ui-avatars.com/api/?name=" +
						encodeURIComponent(
							user.name || user.uid
						)
				}" alt="pic" />
        <div>
          <div><b>${
						user.name || "(no name)"
					}</b></div>
          <div style="font-size:12px;color:#888;">${
						user.uid
					}</div>
        </div>
      </div>
    `
		)
		.join("");
	suggestionsBox.style.display = "block";
}

// Click on suggestion to show user
suggestionsBox.addEventListener(
	"click",
	function (e) {
		let item = e.target;
		while (
			item &&
			!item.classList.contains("suggestion-item")
		) {
			item = item.parentElement;
		}
		if (item) {
			const uid = item.getAttribute("data-uid");
			fetchUsersCache().then((users) => {
				if (users[uid]) {
					showUser(uid, users[uid]);
					suggestionsBox.style.display = "none";
					searchInput.value =
						users[uid].name || uid;
				}
			});
		}
	}
);

// Search button (by UID or name, shows all matches if multiple)
searchBtn.onclick = function () {
	const query = searchInput.value
		.trim()
		.toLowerCase();
	if (!query) return;
	fetchUsersCache().then((users) => {
		// Exact UID match first
		if (users[query]) {
			showUser(query, users[query]);
			suggestionsBox.style.display = "none";
			return;
		}
		// All name matches
		const matches = Object.entries(users)
			.filter(
				([uid, data]) =>
					data.name &&
					data.name.toLowerCase() === query
			)
			.map(([uid, data]) => ({ uid, ...data }));
		if (matches.length === 1) {
			showUser(matches[0].uid, matches[0]);
			suggestionsBox.style.display = "none";
		} else if (matches.length > 1) {
			renderSuggestions(matches, query);
		} else {
			userDetails.style.display = "none";
			noUser.style.display = "block";
			suggestionsBox.style.display = "none";
		}
	});
};

function showUser(uid, data) {
	currentUid = uid;
	noUser.style.display = "none";
	userDetails.style.display = "block";
	document.getElementById("user-pic").src =
		data.profilePic ||
		"https://ui-avatars.com/api/?name=" +
			encodeURIComponent(data.name || uid);
	document.getElementById(
		"user-name"
	).textContent = data.name || "";
	document.getElementById(
		"user-uid"
	).textContent = uid;
	document.getElementById(
		"user-grade"
	).textContent = data.grade || "";
	document.getElementById(
		"user-points"
	).textContent = data.points || "";
	document.getElementById(
		"user-credits"
	).textContent = data.credits || "";
	document.getElementById(
		"user-courses"
	).textContent = data.courses
		? Object.keys(data.courses)
				.filter((k) => data.courses[k])
				.join(", ")
		: "";

	document.getElementById("edit-grade").value =
		data.grade || "";
	document.getElementById("edit-points").value =
		data.points || "";
	document.getElementById("edit-credits").value =
		data.credits || "";
	// Set courses
	const select = document.getElementById(
		"edit-courses"
	);
	Array.from(select.options).forEach((opt) => {
		opt.selected =
			data.courses &&
			data.courses[opt.value] === true;
	});
}

document.getElementById("save-btn").onclick =
	function () {
		if (!currentUid) return;
		const grade =
			document.getElementById("edit-grade").value;
		const points = document.getElementById(
			"edit-points"
		).value;
		const credits = document.getElementById(
			"edit-credits"
		).value;
		const select = document.getElementById(
			"edit-courses"
		);
		const courses = {};
		Array.from(select.options).forEach((opt) => {
			courses[opt.value] = opt.selected;
		});

		db.ref("users/" + currentUid)
			.update({
				grade,
				points,
				credits,
				courses
			})
			.then(() => {
				alert("User updated!");
				fetchUsersCache(true); // Optionally refresh cache
				searchBtn.onclick(); // Refresh user info
			});
	};

// Function to scan users and update leaderboard
refreshBtn.onclick = function () {
	lbRefreshMsg.style.display = "none";
	db.ref("users")
		.once("value")
		.then((snap) => {
			const users = snap.val() || {};
			// Convert to array and sort by points descending
			const sorted = Object.entries(users)
				.map(([uid, data]) => ({
					uid,
					name: data.name || "",
					points: parseInt(data.points) || 0,
					profilePic: data.profilePic || "",
					grade: data.grade || ""
				}))
				.sort((a, b) => b.points - a.points)
				.slice(0, 10);

			// Write top 10 to leaderboard node
			const updates = {};
			sorted.forEach((user, idx) => {
				updates[idx + 1] = {
					uid: user.uid,
					name: user.name,
					points: user.points,
					profilePic: user.profilePic,
					grade: user.grade
				};
			});
			db.ref("leaderboard")
				.set(updates)
				.then(() => {
					lbRefreshMsg.style.display = "block";
					lbRefreshMsg.style.color = "green";
					lbRefreshMsg.textContent =
						"Leaderboard updated!";
					showLeaderboard();
				});
		});
};

// Function to display leaderboard
function showLeaderboard() {
	db.ref("leaderboard")
		.once("value")
		.then((snap) => {
			const lb = snap.val() || {};
			let html = `<table style="width:100%;border-collapse:collapse;">
      <tr style="background:#f7f8fa;">
        <th style="padding:6px;">Rank</th>
        <th style="padding:6px;">Name</th>
        <th style="padding:6px;">UID</th>
        <th style="padding:6px;">Points</th>
      </tr>`;
			for (let i = 1; i <= 10; i++) {
				const entry = lb[i] || {};
				html += `<tr>
        <td style="padding:6px;text-align:center;">${i}</td>
        <td style="padding:6px;">${
					entry.name || ""
				}</td>
        <td style="padding:6px;">${
					entry.uid || ""
				}</td>
        <td style="padding:6px;">${
					entry.points || ""
				}</td>
      </tr>`;
			}
			html += "</table>";
			leaderboardList.innerHTML = html;
		});
}
showLeaderboard();
