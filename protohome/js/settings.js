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

const font=document.getElementById('font');
const FontSize=document.getElementById('FontSize');
if (font !== undefined) {
    font.addEventListener('input',function(){
        FontSize.textContent=this.value;
    });
}

const logoutButton = document.getElementById("log-out-button");
logoutButton.addEventListener("click", () => {
    deleteCookie("authId");
    deleteCookie("username");
    deleteCookie("householdId");
    window.location = "./login.html";
});

async function deleteAccount() {
    let un = document.querySelector("#username-box").value;
    let pw = document.querySelector("#password-box").value;
    let cf = document.querySelector("#confirm-box").value;
    if (pw !== cf) {
        alert("Passwords don't match");
        return;
    }
    await fetch("http://ec2-18-175-157-74.eu-west-2.compute.amazonaws.com:80/API/deleteAccount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        referrerPolicy: "no-referrer",
        body: JSON.stringify({
            emailOrUsername: un,
            password: pw,
            usernameHash: getCookie("username"),
            authId: getCookie("authId")
        })
    }).then(r => {
        if (r.status === 200) {
            deleteCookie("authId");
            deleteCookie("username");
            deleteCookie("householdId");
            window.location = "./login.html";
        } else {
            alert("Could not delete account");
        }
    })
}

const deleteAccountButton = document.getElementById("delete-account-button");
deleteAccountButton.addEventListener("click", () => {
    document.getElementById("account-input").style="display:block;";
    deleteAccountButton.style="display:none;";
});

const confirmDeleteAccount = document.getElementById("confirm-delete-account");
confirmDeleteAccount.addEventListener("click", deleteAccount);