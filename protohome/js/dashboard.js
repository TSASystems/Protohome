

function addBox() {
    const grid = document.getElementById("grid");
    const box = document.createElement("div");
    box.classList.add("grid-item");
    box.innerText = "Placeholder Text";
    box.onclick = function() { grid.removeChild(box); };
    grid.insertBefore(box, grid.lastElementChild);
}