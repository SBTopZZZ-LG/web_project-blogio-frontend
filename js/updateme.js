async function loadDetails() {
    const user = await getSignedUser()
    if (!user)
        return window.alert("Failed to load user")

    document.getElementById("usernamefield").value = user["username"]
    document.getElementById("emailfield").value = user["email"]
    document.getElementById("biofield").value = user["bio"]
}

async function saveDetails(callback) {
    const username = document.getElementById("usernamefield").value
    const email = document.getElementById("emailfield").value
    const bio = document.getElementById("biofield").value

    if (username.trim().length === 0)
        return window.alert("Invalid username")
    if (!/[a-z0-9\._]+@[a-z0-9\._]+/.test(email))
        return window.alert("Invalid email")

    const result = await fetch('https://webproject-blogio-backend.sbtopzzzlg.repl.co/user',
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                "Authorization": localStorage.getItem("LOGINTOKEN")
            },
            body: JSON.stringify({
                email: localStorage.getItem("USEREMAIL"),
                newData: {
                    username,
                    email,
                    bio
                }
            })
        })
    console.log(result.status)
    if (result.status === 403)
        return window.alert("Email is already in use")
    else if (result.status !== 200)
        return window.alert("Unknown error occurred")

    return callback()
}