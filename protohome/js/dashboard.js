//old placeholder function
function addBox() {
    const grid = document.getElementById("grid");
    const box = document.createElement("div");
    box.classList.add("grid-item");
    box.innerText = "Placeholder Text";
    box.onclick = function() { grid.removeChild(box); };
    grid.insertBefore(box, grid.lastElementChild);
}

//concept with lamp
function addDevice() {
    const grid = document.getElementById("grid");
    const box = document.createElement("div");
    box.classList.add("device");
    box.innerHTML = "<p>Lamp</p><img src = '../image/Lamp.PNG' alt = 'lamp' class = 'devImg'>";
    box.onclick = function() { grid.removeChild(box); };
    grid.insertBefore(box, grid.lastElementChild);
	
	//display add device interface
	document.getElementById("addDevice").style.display = "block";
}

//close button
document.getElementById("close").onclick = function() {
	document.getElementById("addDevice").style.display = "none";
}