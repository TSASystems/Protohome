// TODO 
// Make functions communicate with database
// Make this page accessible from somewhere
let households = [];

document.addEventListener('DOMContentLoaded', (event) => {
    getHouseholdUsers();
});

document.getElementById('createHousehold').addEventListener('click', function () {
    const householdName = prompt('Enter the name of the household:');
    createHousehold(householdName);
    //window.location.reload();
});

document.getElementById('addUser').addEventListener('click', function () {
    const name = prompt('Enter the name of the user to add:');
    if (name) {
        const userType = prompt('Enter the user type (Member or Manager):', 'Member');
        addUserToGrid(name, userType || 'Member');
        addUserToHousehold(name, userType);
    }
});

function chooseHousehold() {
    document.getElementById('householdList').innerHTML = households.map(household => `
        <li class="list-group-item" onclick="switchHousehold('${household.householdId}')">${household.householdName}</li>
    `).join('');
    new bootstrap.Modal(document.getElementById('switchHouseholdModal')).show();
}

document.getElementById('switchHousehold').addEventListener('click', chooseHousehold);

function fillUserGrid() {
    const currentHousehold = households.find(household => household.householdId === Number(getCookie("householdId")));
    document.getElementById('userGrid').innerHTML = currentHousehold.users.map(user => `
        <div class="grid-item">
            <p>${user.username} (${user.userType})</p>
            <button class="btn btn-danger btn-sm" onclick="removeUser('${user.username}')">Remove</button>
        </div>
    `).join('');
}

function addUserToGrid(name, userType) {
    const currentHousehold = households.find(household => household.householdId === Number(getCookie("householdId")));
    currentHousehold.users.push({username: name, userType});
    fillUserGrid();
}

function removeUser(name) {
    const currentHousehold = households.find(household => household.householdId === Number(getCookie("householdId")));
    const index = currentHousehold.users.findIndex(user => user.username === name);
    currentHousehold.users.splice(index, 1);
    removeUserFromHousehold(name);
    fillUserGrid();
}

function switchHousehold(householdId) {
    document.cookie = "householdId="+householdId+"; path=/";
    fillUserGrid();
    const switchHouseholdModal = bootstrap.Modal.getInstance(document.getElementById('switchHouseholdModal'));
    switchHouseholdModal.hide();
}

async function getHouseholdUsers() {
    await fetch("http://ec2-18-175-157-74.eu-west-2.compute.amazonaws.com:80/API/getHouseholdUsers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        referrerPolicy: "no-referrer",
        body: JSON.stringify({ 
            username: getCookie("username"),
            authId: getCookie("authId")
        })
    }).then(r => r.json()
        .then(s => {
            households = s;
            console.log(getCookie("householdId"));
            if (getCookie("householdId") === "")
                chooseHousehold();
            else
                fillUserGrid();
        })
    );
}

async function addUserToHousehold(name, _userType) {
    await fetch("http://ec2-18-175-157-74.eu-west-2.compute.amazonaws.com:80/API/addUserToHousehold", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        referrerPolicy: "no-referrer",
        body: JSON.stringify({ 
            username: getCookie("username"),
            authId: getCookie("authId"),
            householdId: getCookie("householdId"),
            targetUser: name,
            userType: _userType
        })
    });
}

async function removeUserFromHousehold(name) {
    await fetch("http://ec2-18-175-157-74.eu-west-2.compute.amazonaws.com:80/API/removeUserFromHousehold", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        referrerPolicy: "no-referrer",
        body: JSON.stringify({ 
            username: getCookie("username"),
            authId: getCookie("authId"),
            householdId: getCookie("householdId"),
            targetUser: name
        })
    });
}

async function createHousehold(name) {
    await fetch("http://ec2-18-175-157-74.eu-west-2.compute.amazonaws.com:80/API/createHousehold", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        referrerPolicy: "no-referrer",
        body: JSON.stringify({ 
            username: getCookie("username"),
            authId: getCookie("authId"),
            householdName: name
        })
    });
}