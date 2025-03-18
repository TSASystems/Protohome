// TODO 
// Make functions communicate with database
// Make this page accessible from somewhere

document.getElementById('createHousehold').addEventListener('click', function () {
    window.location.href = 'payment.html';
});

document.getElementById('addUser').addEventListener('click', function () {
    const name = prompt('Enter the name of the user to add:');
    if (name) {
        const userType = prompt('Enter the user type (Member or Owner):', 'Member');
        addUserToGrid(name, userType || 'Member');
        // Add logic to add user to database
    }
});

document.getElementById('switchHousehold').addEventListener('click', () => {
    document.getElementById('householdList').innerHTML = households.map(household => `
        <li class="list-group-item" onclick="switchHousehold('${household.householdID}')">${household.householdName}</li>
    `).join('');
    new bootstrap.Modal(document.getElementById('switchHouseholdModal')).show();
});

let currentHouseholdID = '1';

const households = [
    { householdName: 'Household A', householdID: '1', users: [{ username: 'Declan', userType: 'Owner' }] },
    { householdName: 'Household B', householdID: '2', users: [{ username: 'Mark', userType: 'Owner' }] },
    { householdName: 'Household C', householdID: '3', users: [{ username: 'Andrew', userType: 'Owner' }] }
];


function fillUserGrid() {
    const currentHousehold = households.find(household => household.householdID === currentHouseholdID);
    document.getElementById('userGrid').innerHTML = currentHousehold.users.map(user => `
        <div class="grid-item">
            <p>${user.username} (${user.userType})</p>
            <button class="btn btn-danger btn-sm" onclick="removeUser('${user.username}')">Remove</button>
        </div>
    `).join('');
}

function addUserToGrid(name, userType) {
    const currentHousehold = households.find(household => household.householdID === currentHouseholdID);
    currentHousehold.users.push({ username: name, userType});
    fillUserGrid();
}

function removeUser(name) {
    const currentHousehold = households.find(household => household.householdID === currentHouseholdID);
    const index = currentHousehold.users.findIndex(user => user.username === name);
    currentHousehold.users.splice(index, 1);
    fillUserGrid();
}

function switchHousehold(householdID) {
    currentHouseholdID = householdID;
    fillUserGrid();
    const switchHouseholdModal = bootstrap.Modal.getInstance(document.getElementById('switchHouseholdModal'));
    switchHouseholdModal.hide();
}

document.addEventListener('DOMContentLoaded', fillUserGrid);