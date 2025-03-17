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
                lastName: ln
            }),
        }).then(res => {
            if (res.status === 409) {
                $("#username-taken").show();
                $("#password-mismatch").hide();
            } else if (res.status === 200) {
                /* Successful login code here */
            }
        });
    } else {
        $("#username-taken").show();
        $("#password-mismatch").hide();        
    }
}