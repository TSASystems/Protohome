// Some global variables
let deviceTypes;
let deviceNameToID = {};
let deviceIDToName = {};
let householdDevices;
let totalEnergyOutput = [];
let deviceStates = JSON.parse(localStorage.getItem("deviceStates")) || {};
const switchInputs = {};

function closeAddDeviceInterface() {
	document.getElementById("addDevice").style.display = "none";
}

function showAddDeviceInterface() {
    const deviceModal = new bootstrap.Modal(document.getElementById('deviceModal'));
    deviceModal.show();
}

function displayAvailableDevices(id, text, target) {
    const button = document.createElement('button');
    button.className = 'list-group-item list-group-item-action';
    button.id = id;
    
    button.setAttribute('data-bs-toggle', 'list');
    button.setAttribute('href', target);
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', target.substring(1));
    const img=document.createElement('img');
    
    img.src = '../image/'+text+'.PNG';
    img.width = 40;
    img.height = 40;
    const ButtonText = document.createTextNode(text);
    const Space = document.createTextNode(' ');
    
    
    button.appendChild(img);
    button.appendChild(Space);
    button.appendChild(ButtonText);// button.textContent = text;
    document.getElementById('list-tab').appendChild(button);
  }

  document.addEventListener("DOMContentLoaded", () => {
    getDeviceTypes();
    getDevicesFromHousehold();

    // Restore devices' states
    Object.keys(deviceStates).forEach(deviceId => {
        const device = document.getElementById(deviceId);
        if (device) {
            const deviceName = device.querySelector("p").innerText;
            const isOn = deviceStates[deviceId].state === "on";
            if (isOn) {
                toggleDeviceState(deviceId, deviceName, { checked: true }, null, null);
            }
        }
    });
});


function loadDevices() {
    const grid = document.getElementById("grid");
    
    householdDevices.forEach(d => {
        let box = document.createElement("div");
        box.classList.add("device");
        deviceName = deviceIDToName[d.deviceTypeId];
        box.id = d.deviceId;
        // Concatenate HTML for box
        let html = "<p>";
        html += deviceName;
        html += "</p><img src='../image/";
        html += deviceName;
        html += ".PNG' class='devImg' alt='";
        html += deviceName;
        html += "'>";

        box.innerHTML = html;

        // Add click event to show device info
        box.onclick = function (event) {
            showDeviceInfoInterface(event);
        };

        // Insert the new device before the "+" box
        grid.insertBefore(box, grid.lastElementChild);
    });
}

async function getDeviceTypes() {
    fetch("http://ec2-18-175-157-74.eu-west-2.compute.amazonaws.com/API/getDeviceTypes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        referrerPolicy: "no-referrer",
        body: JSON.stringify({})
    }).then(r => r.json()
        .then(dev => {
            for (let i = 0; i < dev.length; i++) {
                deviceNameToID[dev[i].deviceTypeName] = dev[i].deviceTypeId;
                deviceIDToName[dev[i].deviceTypeId] = dev[i].deviceTypeName;
                let str = dev[i].deviceTypeName.replaceAll(/[ -]/g, "").toLowerCase();
                displayAvailableDevices(`list-${str}-list`, dev[i].deviceTypeName, `#list-${str}`);
            }
            deviceTypes = dev;
        }));
}

async function toggleDevice(_deviceId) {
    fetch("http://ec2-18-175-157-74.eu-west-2.compute.amazonaws.com:80/API/toggleDevice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        referrerPolicy: "no-referrer",
        body: JSON.stringify({
            deviceId: _deviceId,
            householdId: getCookie("householdId")
        })
    })
    getDevicesFromHousehold();
}

async function getDevicesFromHousehold(name) {
    await fetch("http://ec2-18-175-157-74.eu-west-2.compute.amazonaws.com:80/API/getHouseholdDevices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        referrerPolicy: "no-referrer",
        body: JSON.stringify({ 
            deviceTypeId: deviceNameToID[name],
            deviceName: name,
            householdId: getCookie("householdId")
        })
    }).then(r => {
        householdDevices = [];
        document.querySelectorAll(".device").forEach(e => e.remove());
        r.json()
            .then(dev => {
                householdDevices = dev.map(d => JSON.parse(d));
                loadDevices();
            })
    });
}

async function addDeviceToHousehold(name) {
    await fetch("http://ec2-18-175-157-74.eu-west-2.compute.amazonaws.com:80/API/addDevice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        referrerPolicy: "no-referrer",
        body: JSON.stringify({ 
            deviceTypeId: deviceNameToID[name],
            deviceName: name,
            householdId: getCookie("householdId")
        })
    });
}

async function getHouseholdUsers(name) {
    await fetch("http://ec2-18-175-157-74.eu-west-2.compute.amazonaws.com:80/API/getHouseholdUsers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        referrerPolicy: "no-referrer",
        body: JSON.stringify({ 
            username: getCookie("username"),
            authId: getCookie("authId"),
            householdId: getCookie("householdId")
        })
    });
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

async function removeDeviceFromHousehold(_deviceId) {
    await fetch("http://ec2-18-175-157-74.eu-west-2.compute.amazonaws.com:80/API/removeDevice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        referrerPolicy: "no-referrer",
        body: JSON.stringify({ 
            deviceId: _deviceId,
            householdId: getCookie("householdId")
        })
    });
}


function addDevice() {
    // Get highlighted button
    var toAdd = document.getElementsByClassName("list-group-item list-group-item-action active");
    if (toAdd.length === 0) {
        alert("Please select a device to add.");
        return;
    }
    var name = toAdd[0].innerText.trim();

    const grid = document.getElementById("grid");
    const box = document.createElement("div");
    box.classList.add("device");

    // Concatenate HTML for box
    let html = "<p>";
    html += name;
    html += "</p><img src='../image/";
    html += name;
    html += ".PNG' class='devImg' alt='";
    html += name;
    html += "'>";

    box.innerHTML = html;

  
    box.onclick = function (event) {
        showDeviceInfoInterface(event);
    };

   
    grid.insertBefore(box, grid.lastElementChild);

    addDeviceToHousehold(name);
    getDevicesFromHousehold();
}


function removeDevice(box) {
    if (!box) return; 

    console.log(box);
    const deviceId = box.id;

    removeDeviceFromHousehold(deviceId);
    box.remove();
}

 



function closeDeviceInfoInterface() {
	document.getElementById("addDevice").style.display = "none";
}

box.onclick = showDeviceInfoInterface;



function showDeviceInfoInterface(event) {
    event.stopPropagation();
    const box = event.currentTarget;
    const deviceId = box.id;
    const deviceName = box.querySelector("p").innerText;

    const modalTitle = document.getElementById("deviceInfoModalLabel");
    const modalBody = document.getElementById("deviceInfoModalBody");

    // Ensure state is properly retrieved
    if (!deviceStates[deviceId]) {
        deviceStates[deviceId] = { state: "off", output: 0 }; 
    }
    const isOn = deviceStates[deviceId].state === "on";
    const output = deviceStates[deviceId].output || 0;

    modalTitle.innerText = deviceName;
    modalBody.innerHTML = `
       <div class="container">
            <div class="row align-items-center">
                <div class="col-md-4 d-flex">
                    <img src="../image/${deviceName}.PNG" class="devImg" alt="${deviceName}">
                </div>
                <div class="col-md-8">
                    <label class="fadeText form-check-label fw-bold mb-5" id="switchLabel">
                        ${deviceName} is ${isOn ? "on" : "off"}
                    </label>
                    <div class="form-check form-switch ms-5 mb-5">
                        <input class="form-check-input" type="checkbox" role="switch" id="${deviceId}-${deviceName}Switch"" ${isOn ? "checked" : ""}>
                    </div>
                    <p class="mt-10">Current Output: <span id="deviceOutput">${output}W</span></p>
                </div>
            </div>
        </div>`;

    // Store the switch input in the global object
    switchInputs[deviceId] = document.getElementById(`${deviceName}Switch`);
    const switchLabel = document.getElementById("switchLabel");
    const outputElement = document.getElementById("deviceOutput");


    // Add event listener to the switch
    switchInputs[deviceId].addEventListener("change", () => {
        toggleDeviceState(deviceId, deviceName,  switchInputs[deviceId], switchLabel, outputElement);
    });

    // Show the modal
    const deviceInfoModal = new bootstrap.Modal(document.getElementById('deviceInfoModal'));
    deviceInfoModal.show();
}


function toggleDeviceState(deviceId, deviceName, switchLabel, outputElement) {
    const isOn =  switchInputs[deviceId].checked;

    // Assign output based on state
    let output = isOn ? Math.floor(Math.random() * 100) + 10 : 0;

    // Ensure each device has its unique state
    deviceStates[deviceId] = { state: isOn ? "on" : "off", output: output };
    localStorage.setItem("deviceStates", JSON.stringify(deviceStates));

    // Update UI with smooth transition
    switchLabel.style.opacity = 0;
    setTimeout(() => {
        switchLabel.innerText = `${deviceName} is ${isOn ? "on" : "off"}`;
        switchLabel.style.opacity = 1;
        outputElement.innerText = `${output}W`;
    }, 300);

    // Send request to server to update state
    toggleDevice(deviceId);
}





    // box.onclick = function() { 
    //     grid.removeChild(box); 
    //     removeDeviceFromLocalStorage(name);
    // };
    // grid.insertBefore(box, grid.lastElementChild);
 
    // saveDeviceToLocalStorage(name);

function toggleSwitchLabel(switchElement, labelElement, deviceName) {
    if (!switchElement || !labelElement) return; 

    labelElement.style.opacity = 0; 

    setTimeout(() => {
        labelElement.innerText = switchElement.checked 
            ? `${deviceName} is on` 
            : `${deviceName} is off`;
        labelElement.style.opacity = 1;
    }, 300);
}

