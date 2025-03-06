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

function displayAvailableDevices(id, text, target) {
  
    const button = document.createElement('button');
    button.className = 'list-group-item list-group-item-action';
    button.id = id;
    button.setAttribute('data-bs-toggle', 'list');
    button.setAttribute('href', target);
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', target.substring(1)); 
    button.textContent = text;

    document.getElementById('list-tab').appendChild(button);
  }

  
  displayAvailableDevices('list-lamp-list', 'Lamp', '#list-lamp');
  displayAvailableDevices('list-centralheating-list', 'Central Heating', '#list-centralheating');
  displayAvailableDevices('list-dishwasher-list', 'Dishwasher', '#list-dishwasher');
  displayAvailableDevices('list-wifirouter-list', 'Wi-Fi Router', '#list-wifirouter');
































//concept with lamp
function addDevice() {
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