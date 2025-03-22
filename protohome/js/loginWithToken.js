function getCookie(name) {
    let decodedCookie = decodeURIComponent(document.cookie);
    let cookies = decodedCookie.split('; ');
    for(let c of cookies) {
        if (c.substring(0, name.length) === name) {
            return c.substring(name.length+1, c.length);
        }
    }
    return "";
}

function deleteCookie(name) {
    let val = getCookie(name);
    if (name !== "" && val !== "")
        document.cookie = `${name}=${val}; expires=${new Date(0).toGMTString()}; path=/`;
}

function loginWithToken() {
    let token = getCookie("authId");
    let un = getCookie("username");
    if (token === "" || un === "") {
        window.location = "./login.html"
    } else {
        fetch("http://ec2-18-175-157-74.eu-west-2.compute.amazonaws.com/API/loginWithToken", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            referrerPolicy: "no-referrer",
            body: JSON.stringify({
                username: un,
                authId: token
            })
        }).then(r => {
            if (r.status !== 200) {
                deleteCookie("authId");
                deleteCookie("username");
                window.location = "./login.html";
            }
        })
    }
}

loginWithToken();