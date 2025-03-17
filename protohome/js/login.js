async function attemptLogin()
{
    let un = $("#username-box").val();
    let pw = $("#password-box").val();
    let rememberMe = $("#remember-me-box").is(":checked");
    if (un.length > 0 && pw.length > 0) {
        await fetch("https://ec2-18-175-157-74.eu-west-2.compute.amazonaws.com:443/API/login", {
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
                    createCookie(r.username, r.userAuth, (rememberMe)? 30 : 2);
                    window.location = "./dashboard.html"
                });
            }
        });
    }
}