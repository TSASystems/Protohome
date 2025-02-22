const ps = document.querySelectorAll("p");
//change the font size of all p elements according to the value of the slider
document.getElementById("font").oninput = function() {
	for (const p of ps) {
		p.style.fontSize = this.value;
	}
}