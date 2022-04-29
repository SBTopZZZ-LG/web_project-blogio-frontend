async function register(username, email, password, callback) {
    const result = await fetch('https://webproject-blogio-backend.sbtopzzzlg.repl.co/user/signUp',
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({
                username, email, password
            })
        })
    switch (result.status) {
        case 403: window.alert("Email is already in use."); return callback(false)
        case 200: break
        default: window.alert("Unknown error occurred. Please try again later."); return callback(false)
    }

    return callback(true)
}
async function login(email, password, callback) {
    const result = await fetch('https://webproject-blogio-backend.sbtopzzzlg.repl.co/user/signIn',
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({
                email,
                password
            })
        })
    switch (result.status) {
        case 404: window.alert("Sorry but no account with this email address exists."); return callback(false)
        case 403: window.alert("Entered password is incorrect."); return callback(false)
        case 200: break
        default: window.alert("Unknown error occurred. Please try again later."); return callback(false)
    }

    const responsebody = await result.json()
    const user_id = responsebody["result"]["user_id"]
    const login_token = responsebody["result"]["login_token"]

    localStorage.setItem("USEREMAIL", email)
    localStorage.setItem("USERID", user_id)
    localStorage.setItem("LOGINTOKEN", login_token)

    return callback(true)
}
async function loginHeadless(callback) {
    // Check for saved creds
    if (!localStorage.getItem("LOGINTOKEN"))
        return callback(false)

    const result = await fetch('https://webproject-blogio-backend.sbtopzzzlg.repl.co/user/signInWithLoginToken',
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                "Authorization": localStorage.getItem("LOGINTOKEN")
            },
            body: JSON.stringify({
                email: localStorage.getItem("USEREMAIL")
            })
        })
    if (result.status !== 200) {
        localStorage.removeItem("USEREMAIL")
        localStorage.removeItem("USERID")
        localStorage.removeItem("LOGINTOKEN")
        return callback(false)
    }

    return callback(true)
}
async function getSignedUser() {
    // Check for saved creds
    if (!localStorage.getItem("LOGINTOKEN"))
        return;

    const result = await fetch('https://webproject-blogio-backend.sbtopzzzlg.repl.co/user/get',
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                "Authorization": localStorage.getItem("LOGINTOKEN")
            },
            body: JSON.stringify({
                email: localStorage.getItem("USEREMAIL")
            })
        })
    if (result.status !== 200) {
        localStorage.removeItem("USEREMAIL")
        localStorage.removeItem("USERID")
        localStorage.removeItem("LOGINTOKEN")
        return;
    }

    return (await result.json())["result"]["user"]
}
function isSignedIn() {
    return !!localStorage.getItem("LOGINTOKEN")
}
function signOut() {
    localStorage.removeItem("USERID")
    localStorage.removeItem("USEREMAIL")
    localStorage.removeItem("LOGINTOKEN")
}