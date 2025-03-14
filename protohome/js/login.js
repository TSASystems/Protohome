async function attemptLogin()
{
    let un = $("#username-box").val();
    let pw = $("#password-box").val();
    if (un.length > 0 && pw.length > 0) {
        await fetch("http://ec2-18-175-157-74.eu-west-2.compute.amazonaws.com:80/API/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            referrerPolicy: "no-referrer",
            body: JSON.stringify({
                emailOrUsername: un, 
                password: pw
            }),
        }).then(res => {
            if (res.status === 401) {
                $("#login-failure").show();
            } else if (res.status === 200) {
                /* Successful login code here */
            }
        });
    }
}