//old placeholder function
let deviceTypes;
let deviceNameToID = {};
let deviceIDToName = {};
let householdDevices;

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
    // loadDevicesFromLocalStorage();
    getDeviceTypes();
    getDevicesFromHousehold();
});

function loadDevicesFromLocalStorage() {
    let devices = JSON.parse(localStorage.getItem('devices')) || [];
    devices.forEach(deviceName => {
        const grid = document.getElementById("grid");
        const box = document.createElement("div");
        box.classList.add("device");

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

function loadDevices() {
    const grid = document.getElementById("grid");
    grid.innerHTML = `<div class="gridItemAddBox" onclick="showAddDeviceInterface()" title="Add device">+</div>`
    
    householdDevices.forEach(d => {
        d = JSON.parse(d);
        const box = document.createElement("div");
        box.classList.add("device");
        deviceName = deviceIDToName[d.deviceTypeId];
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
    fetch("http://ec2-18-175-157-74.eu-west-2.compute.amazonaws.com/API/toggleDevice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        referrerPolicy: "no-referrer",
        body: JSON.stringify({
            deviceId: _deviceId,
            householdId: Number(getCookie("householdId"))
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
    }).then(r => r.json()
        .then(dev => {
            householdDevices = dev
        }));
    loadDevices();
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

async function removeDeviceFromHousehold(name) {
    let deviceTypeId = deviceNameToID[name];
    let deviceId = -1;
    for (let i in householdDevices) {
        if (JSON.parse(householdDevices[i]).deviceTypeId === deviceTypeId) {
            deviceId = JSON.parse(householdDevices[i]).deviceId;
            break;
        }
    }
    if (deviceId === -1)
        return;
    await fetch("http://ec2-18-175-157-74.eu-west-2.compute.amazonaws.com:80/API/removeDevice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        referrerPolicy: "no-referrer",
        body: JSON.stringify({ 
            deviceId: deviceId,
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
    //saveDeviceToLocalStorage(name);
}


function removeDevice(box) {
    if (!box) return; 

 
    const deviceName = box.querySelector("p").innerText.trim();

    removeDeviceFromHousehold(deviceName);
    box.remove();
  
    // removeDeviceFromLocalStorage(deviceName);
}

 



function closeDeviceInfoInterface() {
	document.getElementById("addDevice").style.display = "none";
}

box.onclick = showDeviceInfoInterface;

function showDeviceInfoInterface(event) {
    
    event.stopPropagation();

  
    const box = event.currentTarget;
    const deviceName = box.querySelector("p").innerText;

    
    const modalTitle = document.getElementById("deviceInfoModalLabel");
    const modalBody = document.getElementById("deviceInfoModalBody");

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
                    <label class="fadeText form-check-label fw-bold mb-5" for="deviceSwitch" id="switchLabel">${deviceName} is off</label>
                    
                    <!-- Switch -->
                    <div class="form-check form-switch ms-5 mb-5">
                        <input class="form-check-input" type="checkbox" role="switch" id="deviceSwitch">
                    </div>
                    
                    <!-- Additional Text -->
                    <p class="mt-10">Current Output: </p>
                </div>
            </div>
        </div>`;

  
    modalBody.setAttribute("data-device-box", box.outerHTML);

  
    const deviceInfoModal = new bootstrap.Modal(document.getElementById('deviceInfoModal'));
    deviceInfoModal.show();

    const removeButton = document.querySelector("#deviceInfoModal .btnRemove[onclick='removeDevice()']");
    removeButton.onclick = function () {
        removeDevice(box); 
        deviceInfoModal.hide(); 
    };

    // Add event listener to the switch
    const switchInput = document.getElementById("deviceSwitch");
    const switchLabel = document.getElementById("switchLabel");

    if (switchInput && switchLabel) {
        switchInput.addEventListener("change", () => {
            toggleSwitchLabel(switchInput, switchLabel, deviceName);
        });
    }
}








    box.onclick = function() { 
        grid.removeChild(box); 
        removeDeviceFromLocalStorage(name);
    };
    grid.insertBefore(box, grid.lastElementChild);
 
    // saveDeviceToLocalStorage(name);


function saveDeviceToLocalStorage(deviceName) {
    let devices = JSON.parse(localStorage.getItem('devices')) || [];
    devices.push(deviceName);
    localStorage.setItem('devices', JSON.stringify(devices));
}

function removeDeviceFromLocalStorage(deviceName) {
    let devices = JSON.parse(localStorage.getItem('devices')) || [];
    devices = devices.filter(device => device !== deviceName);
    localStorage.setItem('devices', JSON.stringify(devices));
}


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









function addDeviceOld() {
	//get value from text input
	var name = document.getElementById("name").value;
	
	closeInterface();
    const grid = document.getElementById("grid");
    const box = document.createElement("div");
    box.classList.add("device");
	
	//concatenate html for box
	let html = "<p>";
	html += name;
	html += "</p><img src = '../image/Lamp.PNG' alt = 'lamp' class = 'devImg'>";
	
    box.innerHTML = html;
    box.onclick = function() { grid.removeChild(box); };
    grid.insertBefore(box, grid.lastElementChild);
}