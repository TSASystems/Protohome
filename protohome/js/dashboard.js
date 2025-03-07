//old placeholder function
function addBox() {
    const grid = document.getElementById("grid");
    const box = document.createElement("div");
    box.classList.add("gridItemAddBox");
    box.innerText = "Placeholder Text";
    box.onclick = function() { grid.removeChild(box); };
    grid.insertBefore(box, grid.lastElementChild);
}

function closeInterface() {
	document.getElementById("addDevice").style.display = "none";
}

function showInterface() {

   

    const deviceModal = new bootstrap.Modal(document.getElementById('deviceModal'));

  
    deviceModal.show();
    


}

function displayAvailableDevices(id, address, text, target) {
  
    const button = document.createElement('button');
    button.className = 'list-group-item list-group-item-action';
    button.id = id;
    
    button.setAttribute('data-bs-toggle', 'list');
    button.setAttribute('href', target);
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', target.substring(1));
    const img=document.createElement('img');
    
    img.src = '../image/'+address+'.PNG';
    img.width = 40;
    img.height = 40;
    const ButtonText = document.createTextNode(text);
    const Space = document.createTextNode(' ');
    
    
    button.appendChild(img);
    button.appendChild(Space);
    button.appendChild(ButtonText);// button.textContent = text;
    document.getElementById('list-tab').appendChild(button);
  }

  displayAvailableDevices('list-airconditioner-list','AirConditioner', 'Air Conditioner', '#list-airconditioner');
  displayAvailableDevices('list-blender-list','Blender', 'Blender', '#list-blender');
  displayAvailableDevices('list-centralheating-list','CentralHeating', 'Central Heating', '#list-centralheating');
  displayAvailableDevices('list-coffeemaker-list','CoffeeMaker', 'Coffee Maker', '#list-coffeemaker');
  displayAvailableDevices('list-charger-list','Charger', 'Charger', '#list-charger');
  displayAvailableDevices('list-dishwasher-list','Dishwasher', 'Dishwasher', '#list-dishwasher');
  displayAvailableDevices('list-gameingconsole-list','GameConsole' ,'Gaming Console', '#list-gameingconsole');
  displayAvailableDevices('list-hairdryer-list','HairDryer', 'Hair Dryer', '#list-hairdryer');
  displayAvailableDevices('list-iron-list','Iron' ,'Iron', '#list-iron');
  displayAvailableDevices('list-lamp-list','Lamp', 'Lamp', '#list-lamp');
  displayAvailableDevices('list-laptop-list','Laptop', 'Laptop', '#list-laptop');
  displayAvailableDevices('list-microwave-list','Microwave', 'Microwave', '#list-microwave');
  displayAvailableDevices('list-tv-list','TV', 'TV', '#list-tv');
  displayAvailableDevices('list-tablet-list','Desktop', 'Desktop', '#list-tablet');
  displayAvailableDevices('list-toaster-list','Toaster', 'Toaster', '#list-toaster')
  displayAvailableDevices('list-vacuumcleaner-list','VacuumCleaner', 'Vacuum Cleaner', '#list-vacuumcleaner');
  displayAvailableDevices('list-waterheater-list','WaterHeater', 'Water Heater', '#list-waterheater');
  displayAvailableDevices('list-washingmachine-list','WashingMachine', 'Washing Machine', '#list-washingmachine');  
  displayAvailableDevices('list-wifirouter-list','WifiRouter', 'Wi-Fi Router', '#list-wifirouter');
    
    
    
   
    

    
 
    
 
    
    
    
    








function addDevice() {
	//get highlighted button
	var toAdd = document.getElementsByClassName("list-group-item list-group-item-action active");
	var name = toAdd[0].innerText;
	
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