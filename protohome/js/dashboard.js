//old placeholder function
let deviceTypes;
let deviceNameToID = {};
let deviceIDToName = {};
let householdDevices;
let households = [];

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

document.addEventListener('DOMContentLoaded', (event) => {
    getDeviceTypes();
    getDevicesFromHousehold();
    getHouseholds();
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
        html += "'><p id='"+deviceName+d.deviceId+"-state'>";
        html += d.status? "On" : "Off";
        html += "</p>";

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

async function removeSchedule(_deviceId) {
    fetch("http://ec2-18-175-157-74.eu-west-2.compute.amazonaws.com/API/removeSchedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        referrerPolicy: "no-referrer",
        body: JSON.stringify({
            deviceId: _deviceId,
            authId: getCookie("authId"),
            username: getCookie("username")
        })
    })
}

async function scheduleDevice(_deviceId, _onTime, _offTime) {
    fetch("http://ec2-18-175-157-74.eu-west-2.compute.amazonaws.com/API/scheduleDevice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        referrerPolicy: "no-referrer",
        body: JSON.stringify({
            deviceId: _deviceId,
            authId: getCookie("authId"),
            username: getCookie("username"),
            onTime: _onTime,
            offTime: _offTime
        })
    })
}

async function toggleDevice(_deviceId) {
    fetch("http://ec2-18-175-157-74.eu-west-2.compute.amazonaws.com:80/API/toggleDevice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        referrerPolicy: "no-referrer",
        body: JSON.stringify({
            deviceId: _deviceId,
            householdId: getCookie("householdId"),
            authId: getCookie("authId"),
            username: getCookie("username")
        })
    }).then(r => {
        let switchInput = document.getElementById("deviceSwitch");
        let switchLabel = document.getElementById("switchLabel");
        let device;
        for (let d of householdDevices) {
            if (d.deviceId == _deviceId) {
                device = d;
                break;
            }
        }
        device.status = !device.status;
        let deviceBox = document.getElementById(`${_deviceId}`);
        let deviceType = deviceBox.querySelector("p").innerText;
        document.getElementById(`${deviceType}${_deviceId}-state`).innerHTML = device.status? "On" : "Off";
        toggleSwitchLabel(switchInput, switchLabel, deviceType, _deviceId);
    });
}

document.getElementById("houseHoldButton").addEventListener("click", chooseHousehold);

async function getDevicesFromHousehold() {
    let _householdId = getCookie("householdId");
    if (_householdId === "") {
        return;
    }

    await fetch("http://ec2-18-175-157-74.eu-west-2.compute.amazonaws.com:80/API/getHouseholdDevices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        referrerPolicy: "no-referrer",
        body: JSON.stringify({
            householdId: _householdId, 
            authId: getCookie("authId"),
            username: getCookie("username")
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
    }).then(r => window.location.reload());
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

function switchHousehold(_householdId) {
    document.cookie = "householdId="+_householdId+"; path=/";
    const switchHouseholdModal = bootstrap.Modal.getInstance(document.getElementById('switchHouseholdModal'));
    switchHouseholdModal.hide();
    window.location.reload();
}

function chooseHousehold() {
    document.getElementById('householdList').innerHTML = households.map(household => `
        <li class="list-group-item" onclick="switchHousehold('${household.householdId}')">${household.householdName}</li>
    `).join('');
    new bootstrap.Modal(document.getElementById('switchHouseholdModal')).show();
}

async function getHouseholds() {
    await fetch("http://ec2-18-175-157-74.eu-west-2.compute.amazonaws.com:80/API/getHouseholds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        referrerPolicy: "no-referrer",
        body: JSON.stringify({
            authId: getCookie("authId"),
            username: getCookie("username")
        })
    }).then(r => r.json().then(s => {
        households = s;
        let _householdId = getCookie("householdId");
        if (_householdId === "")
            chooseHousehold();
    }));
}


function addDevice() {
    // Get highlighted button
    console.log("here");
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

// box.onclick = showDeviceInfoInterface;

function showDeviceInfoInterface(event) {
    
    event.stopPropagation();

  
    const box = event.currentTarget;
    const deviceName = box.querySelector("p").innerText;

    
    const modalTitle = document.getElementById("deviceInfoModalLabel");
    const modalBody = document.getElementById("deviceInfoModalBody");

    let status;

    for (let d of householdDevices) {
        if (d.deviceId == box.id) {
            status = d.status;
            break;
        }
    }

    modalTitle.innerText = deviceName;
    modalBody.innerHTML = `
       <div class="container">
            <div class="row align-items-center">
                <!-- Left Column for Image -->
                <div class="col-md-4 d-flex ">
                    <img src="../image/${deviceName}.PNG" class="devImg" alt="${deviceName}">
                </div>
                
                <!-- Right Column for Label, Switch, and Text -->
                <div class="col-md-8">
                    <!-- Label -->
                    <label class="fadeText form-check-label fw-bold mb-5" for="deviceSwitch" id="switchLabel">${deviceName} is ${status? "on" : "off"}</label>
                    
                    <!-- Switch -->
                    <div class="form-check form-switch ms-5 mb-5">
                        <input class="form-check-input" type="checkbox" role="switch" id="deviceSwitch" ${status? "checked" : ""}>
                    </div>
                    
                    <!-- Additional Text -->
                    <p class="mt-10">Current Output: </p>
                </div>
            </div>
        </div>`;

  
    modalBody.setAttribute("data-device-box", box.outerHTML);

  
    const deviceInfoModal = new bootstrap.Modal(document.getElementById('deviceInfoModal'));
    deviceInfoModal.show();

    const removeButton = document.getElementById("removeButton"); //document.querySelector("#deviceInfoModal .btnRemove[onclick='removeDevice()']");
    removeButton.onclick = function () {
        removeDevice(box); 
        deviceInfoModal.hide(); 
    };

    // Add event listener to the switch
    const switchInput = document.getElementById("deviceSwitch");
    const switchLabel = document.getElementById("switchLabel");

    if (switchInput && switchLabel) {
        switchInput.addEventListener("change", () => {
            toggleDevice(box.id);
        });
    }
}

function toggleSwitchLabel(switchElement, labelElement, deviceName, deviceId) {
    if (!switchElement || !labelElement) return; 

    labelElement.style.opacity = 0; 
    let status;
    for (let d of householdDevices) {
        if (d.deviceId == deviceId) {
            status = d.status;
            break;
        }
    }

    setTimeout(() => {
        labelElement.innerText = status
            ? `${deviceName} is on` 
            : `${deviceName} is off`;
        labelElement.style.opacity = 1;
    }, 300);
}