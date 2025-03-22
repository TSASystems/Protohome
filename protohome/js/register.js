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

async function attemptSignup()
{
    let un = $("#username-box").val();
    let pw = $("#password-box").val();
    let DoB = $("#dob-box").val();
    let addr = $("#address-box").val();
    let fn = $("#username-box").val();
    let ln = $("#password-box").val();
    let email = $("#email-box").val();
    let cf = $("#confirm-box").val();
    let rememberMe = $("#remember-me-box").is(":checked");
    if (un.length > 0 && pw.length > 0 && pw === cf) {
        await fetch("http://ec2-18-175-157-74.eu-west-2.compute.amazonaws.com:80/API/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            referrerPolicy: "no-referrer",
            body: JSON.stringify({
                username: un, 
                password: pw,
                emailAddress: email,
                dob: DoB,
                address: addr,
                firstName: fn,
                lastName: ln,
                stayLoggedIn: rememberMe
            }),
        }).then(res => {
            if (res.status === 200) {
                res.json().then(r => {
                    // deleteCookie("authId");
                    // deleteCookie("username");
                    // createCookie(r.username, r.userAuth, (rememberMe)? 30 : 2);
                    window.location = "./login.html"
                });
            } else {
                $("#username-taken").show();
                $("#password-mismatch").hide();
            } 
        });
    } else {
        $("#username-taken").show();
        $("#password-mismatch").hide();        
    }
}