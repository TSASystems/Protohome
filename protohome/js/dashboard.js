//old placeholder function
function addBox() {
    const grid = document.getElementById("grid");
    const box = document.createElement("div");
    box.classList.add("grid-item");
    box.innerText = "Placeholder Text";
    box.onclick = function() { grid.removeChild(box); };
    grid.insertBefore(box, grid.lastElementChild);
}

function closeInterface() {
	document.getElementById("addDevice").style.display = "none";
}

function showInterface() {
	document.getElementById("addDevice").style.display = "block";
	document.getElementById("name").value = "";
}

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