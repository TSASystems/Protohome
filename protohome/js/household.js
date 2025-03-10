


document.addEventListener("DOMContentLoaded", async function () {
    const _userId = 26; 
    const grid = document.getElementById("grid");
    try {
    console.log(`Fetching data for userId: ${_userId}`);
        const response = await fetch("http://127.0.0.1:80/API/getUserDetails", {
            method: "POST",
            referrerPolicy: "no-referrer",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId: _userId })
        });
        const data = await response.json();

        if (response.ok) {
            addUserBox(data.username);
            addUsernameToTitle(data.username);
        } else {
            console.error("Error fetching user details:", data.error);
        }
    } catch (error) {
        console.error("Error:", error);
    }

    addAddUserButton();
});


function addAddUserButton() {
    const grid = document.getElementById("grid");
    const addBox = document.createElement("div");
    addBox.classList.add("grid-item", "add-box");
    addBox.innerText = "+ Add User";
    addBox.onclick = function () {
        window.location.href = "signup.html";
    };
    grid.appendChild(addBox);
}
