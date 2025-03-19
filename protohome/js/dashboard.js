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
    getDeviceTypes();
    getDevicesFromHousehold();
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
        getDevicesFromHousehold();
        let switchInput = document.getElementById("deviceSwitch");
        let switchLabel = document.getElementById("switchLabel");
        toggleSwitchLabel(switchInput, switchLabel, box.querySelector("p").innerText, box.id);
    });
}

async function getDevicesFromHousehold() {
    let _householdId = getCookie("householdId");
    if (_householdId === "") {
        window.location = "./household.html"
        return;
    }

    await fetch("http://ec2-18-175-157-74.eu-west-2.compute.amazonaws.com:80/API/getHouseholdDevices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        referrerPolicy: "no-referrer",
        body: JSON.stringify({
            householdId: _householdId
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

    let newname = name;
    let counter = 1;
    while(document.getElementById(newname)){
        newname = `${name}${counter}`;
        counter++;
    }
    // Concatenate HTML for box
    let html = "<p id='"
    html += newname;
    html +="'>";
    html += newname;
    html += "</p><img src='../image/";
    html += name;
    html += ".PNG' class='devImg' alt='";
    html += newname;
    html += "id=";
    html += newname;
    html += "'Img><p id='"+newname+"state'>Off</p>";

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

// box.onclick = showDeviceInfoInterface;

function showDeviceInfoInterface(event) {
    
    event.stopPropagation();

  
    const box = event.currentTarget;
    const deviceName = box.querySelector("p").innerText;

    
    const modalTitle = document.getElementById("deviceInfoModalLabel");
    const modalBody = document.getElementById("deviceInfoModalBody");

    let status;

  //  for (let d of householdDevices) {
    //   if (d.deviceId == box.id) {
    //      status = d.status;
   //         break;
  //    }
  // }

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

    const removeButton = document.querySelector("#deviceInfoModal .btnRemove");
    removeButton.onclick = function () {
        removeDevice(box); 
        deviceInfoModal.hide(); 
    };

    // Add event listener to the switch
    const switchInput = document.getElementById("deviceSwitch");
    const switchLabel = document.getElementById("switchLabel");

    if (switchInput && switchLabel) {
        switchInput.addEventListener("change", () => {
            toggleSwitchLabel(switchInput, switchLabel, deviceName, box.id);
            toggleDevice(box.id);
        });
    }
}


    // box.onclick = function() { 
    //     grid.removeChild(box); 
    //     removeDeviceFromLocalStorage(name);
    // };
    // grid.insertBefore(box, grid.lastElementChild);
 
    // saveDeviceToLocalStorage(name);

function toggleSwitchLabel(switchElement, labelElement, deviceName, deviceId) {
    if (!switchElement || !labelElement) return; 

    labelElement.style.opacity = 0; 

    let device;
    for (let d of householdDevices) {
        if (d.deviceId == deviceId) {
            device = d;
            break;
        }
    }
    console.log(device);

    setTimeout(() => {
        if(switchElement.checked==true){
            labelElement.innerText = `${deviceName} is on`;
            statechange.innerText = "On";
        }
        else{
            labelElement.innerText = `${deviceName} is off`;
            statechange.innerText="Off";
        }
        labelElement.style.opacity = 1;
    }, 300);
}