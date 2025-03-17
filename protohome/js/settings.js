const ps = document.querySelectorAll("p");
const fontSlider = document.getElementById("font");
const fontSizeDisplay = document.getElementById("FontSize");

const savedFontSize = localStorage.getItem("fontSize");
if (savedFontSize) {
    for (const p of ps) {
        p.style.fontSize = savedFontSize + "px";
    }
    fontSlider.value = savedFontSize; 
	fontSizeDisplay.textContent = savedFontSize;
}

fontSlider.addEventListener("input", function() {
    const newSize = this.value + "px";

    for (const p of ps) {
        p.style.fontSize = newSize;
    }

    localStorage.setItem("fontSize", this.value); 
	fontSizeDisplay.textContent = this.value;
});
