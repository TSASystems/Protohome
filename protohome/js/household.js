


// document.addEventListener("DOMContentLoaded", async function () {
//     const _userId = 26; 
//     const grid = document.getElementById("grid");
//     try {
//     console.log(`Fetching data for userId: ${_userId}`);
//         const response = await fetch("http://127.0.0.1:80/API/getUserDetails", {
//             method: "POST",
//             referrerPolicy: "no-referrer",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({ userId: _userId })
//         });
//         const data = await response.json();

//         if (response.ok) {
//             addUserBox(data.username);
//             addUsernameToTitle(data.username);
//         } else {
//             console.error("Error fetching user details:", data.error);
//         }
//     } catch (error) {
//         console.error("Error:", error);
//     }

//     addAddUserButton();
// });


// function addAddUserButton() {
//     const grid = document.getElementById("grid");
//     const addBox = document.createElement("div");
//     addBox.classList.add("grid-item", "add-box");
//     addBox.innerText = "+ Add User";
//     addBox.onclick = function () {
//         window.location.href = "signup.html";
//     };
//     grid.appendChild(addBox);
// }

// TODO 
// Make functions communicate with database
// Make arrays take in objects
// Complete switchHousehold

document.getElementById('createHousehold').addEventListener('click', function () {
    window.location.href = 'payment.html';
});

document.getElementById('addUser').addEventListener('click', function () {
    const name = prompt('Enter the name of the user to add:');
    if (name) {
        // Add logic to add user to database
        addUserToGrid(name);
    }
});

// Needs to list all available households by household name 
document.getElementById('switchHousehold').addEventListener('click', function () {
    const householdName = prompt('Enter the name of the household to switch to:');
    if (householdName) {
        // Add logic to switch household
    }
});

// Make these arrays take in objects

// Dummy data for usernames
const username = ['Declan', 'Mark', 'Andrew'];

// Dummy data for userTypes
const userTypes = ['Owner', 'Member'];

// Dummy data for household names
const householdName = ['Household A', 'Household B', 'Household C'];

// Dummy data for householdID
const householdID = ['1', '2', '3'];



function fillUserGrid() {
    const userGrid = document.getElementById('userGrid');
    userGrid.innerHTML = username.map(user => `
        <div class="grid-item">
            <p>${user}</p>
            <button class="btn btn-danger btn-sm" onclick="removeUser('${user}')">Remove</button>
        </div>
    `).join('');
}

function addUserToGrid(name) {
    username.push(name);
    fillUserGrid();
}

function removeUser(name) {
    username.splice(username.indexOf(name), 1);
    fillUserGrid();
}

document.addEventListener('DOMContentLoaded', fillUserGrid);