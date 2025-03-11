//old placeholder function


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

  displayAvailableDevices('list-airconditioner-list', 'Air Conditioner', '#list-airconditioner');
  displayAvailableDevices('list-blender-list', 'Blender', '#list-blender');
  displayAvailableDevices('list-centralheating-list', 'Central Heating', '#list-centralheating');
  displayAvailableDevices('list-coffeemaker-list', 'Coffee Maker', '#list-coffeemaker');
  displayAvailableDevices('list-charger-list', 'Charger', '#list-charger');
  displayAvailableDevices('list-dishwasher-list', 'Dishwasher', '#list-dishwasher');
  displayAvailableDevices('list-gameconsole-list', 'Game Console', '#list-gameconsole');
  displayAvailableDevices('list-hairdryer-list', 'Hair Dryer', '#list-hairdryer');
  displayAvailableDevices('list-iron-list', 'Iron', '#list-iron');
  displayAvailableDevices('list-lamp-list', 'Lamp', '#list-lamp');
  displayAvailableDevices('list-laptop-list', 'Laptop', '#list-laptop');
  displayAvailableDevices('list-microwave-list', 'Microwave', '#list-microwave');
  displayAvailableDevices('list-tv-list', 'TV', '#list-tv');
  displayAvailableDevices('list-tablet-list', 'Desktop', '#list-tablet');
  displayAvailableDevices('list-toaster-list', 'Toaster', '#list-toaster')
  displayAvailableDevices('list-vacuumcleaner-list', 'Vacuum Cleaner', '#list-vacuumcleaner');
  displayAvailableDevices('list-waterheater-list', 'Water Heater', '#list-waterheater');
  displayAvailableDevices('list-washingmachine-list', 'Washing Machine', '#list-washingmachine');  
  displayAvailableDevices('list-wifirouter-list', 'Wi-Fi Router', '#list-wifirouter');
    
    
    
   
    

    
 
    
 
    
    
    
    





  document.addEventListener('DOMContentLoaded', (event) => {
    loadDevicesFromLocalStorage();
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
        html += "</p><img src = '../image/"
        html += deviceName;
        html += ".PNG' class = 'devImg' alt='";
        html += deviceName;
        html += "'>";

        box.innerHTML = html;
        box.onclick = function() { 
            grid.removeChild(box); 
            removeDeviceFromLocalStorage(deviceName);
        };
        grid.insertBefore(box, grid.lastElementChild);
    });
}


function addDevice() {
	//get highlighted button
	var toAdd = document.getElementsByClassName("list-group-item list-group-item-action active");
	var name = toAdd[0].innerText.trim();
	
    const grid = document.getElementById("grid");
    const box = document.createElement("div");
      device = box.classList.add("device");
	
	//concatenate html for box
	let html = "<p>";
	html += name;
	html += "</p><img src = '../image/"
	html += name;
	html += ".PNG' class = 'devImg' alt='";
	html += name;
	html += "'>";
	
    box.innerHTML = html;
    //box.onclick = function() { grid.removeChild(box); };
    grid.insertBefore(box, grid.lastElementChild);
    box.onclick = showDeviceInfoInterface;

}

 



function closeDeviceInfoInterface() {
	document.getElementById("addDevice").style.display = "none";
}

box.onclick = showDeviceInfoInterface;

function showDeviceInfoInterface(event) {
    let deviceName = event.currentTarget.querySelector("p").innerText;
    const modalTitle = document.getElementById("deviceInfoModalLabel");
    const modalBody = document.getElementById("deviceInfoModalBody");

    modalTitle.innerText = deviceName;
    modalBody.innerHTML = `
        <div class="device-info-container">
    <img src="../image/${deviceName}.PNG" width="250" height="250" class="devImg" alt="${deviceName}">
    <div class="activeSwitch form-check form-switch">
        <input class="form-check-input custom-switch" type="checkbox" role="switch" id="deviceSwitch">
        <label class="form-check-label" id="switchLabel" for="deviceSwitch">${deviceName} is off</label>
    </div>
</div>
<p>Here you can add device settings and controls.</p>`;

  
    const deviceInfoModal = new bootstrap.Modal(document.getElementById('deviceInfoModal'));
    deviceInfoModal.show();

   
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

 
    saveDeviceToLocalStorage(name);


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








//concept with lamp
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