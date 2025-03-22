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
    let path = window.location.pathname.split("/");
    path.pop();
    if (name !== "" && val !== "") {
        document.cookie = `${name}=${val}; expires=${new Date(0).toGMTString()}; path=/`;
        document.cookie = `${name}=${val}; expires=${new Date(0).toGMTString()}; path=${path.join("/")}`;
    }
}


async function attemptLogin()
{
    let un = $("#username-box").val();
    let pw = $("#password-box").val();
    let rememberMe = $("#remember-me-box").is(":checked");
    if (un.length > 0 && pw.length > 0) {
        await fetch("http://ec2-18-175-157-74.eu-west-2.compute.amazonaws.com:80/API/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            referrerPolicy: "no-referrer",
            body: JSON.stringify({
                emailOrUsername: un, 
                password: pw,
                stayLoggedIn: rememberMe
            })
        }).then(res => {
            if (res.status === 401) {
                $("#login-failure").show();
            } else if (res.status === 200) {
                res.json().then(r => {
                    deleteCookie("authId");
                    deleteCookie("username");
                    createCookie(r.username, r.userAuth, (rememberMe)? 30 : 2);
                    window.location = "./dashboard.html";
                });
            }
        });
    }
}