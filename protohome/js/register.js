async function attemptSignup()
{
    let un = $("#username-box").val();
    let pw = $("#password-box").val();
    let cf = $("#confirm-box").val();
    if (un.length > 0 && pw.length > 0 && pw === cf) {
        await fetch("http://ec2-18-175-157-74.eu-west-2.compute.amazonaws.com:80", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                action: "register", 
                username: un, 
                password: pw
            }),
        }).then(res => {
            if (res.status === 409) {
                $("#login-text").after("<p style='color: red;'>Username is taken</p>");
            } else if (res.status === 200) {
                /* Successful login code here */
            }
        });
    }
}