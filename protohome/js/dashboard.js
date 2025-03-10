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



function showDeviceInfoInterface() {

  

    const deviceInfoModal = new bootstrap.Modal(document.getElementById('deviceInfoModal'));
    deviceInfoModal.show();




  
   
    


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