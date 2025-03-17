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
        await fetch("https://ec2-18-175-157-74.eu-west-2.compute.amazonaws.com:443/API/register", {
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
            if (res.status === 409) {
                $("#username-taken").show();
                $("#password-mismatch").hide();
            } else if (res.status === 200) {
                res.json().then(r => {
                    createCookie(r.username, r.userAuth, (rememberMe)? 30 : 2);
                    window.location = "./dashboard.html"
                });
            }
        });
    } else {
        $("#username-taken").show();
        $("#password-mismatch").hide();        
    }
}
window.addEventListener('DOMContentLoaded', function() {
    const today = new Date();
    
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    const nowDate = `${year}-${month}-${day}`;
    
    document.getElementById('dob-box').max = nowDate;//set the max birth date to syetem time
});




    