async function loadUser() {
    const queryString = window.location.search
    const queries = new URLSearchParams(queryString)

    const user_id = queries.get("id")
    if (!user_id)
        return window.alert("User id required")

    const result = await fetch(`https://webproject-blogio-backend.sbtopzzzlg.repl.co/user?id=${user_id}`,
        {
            method: "GET"
        })
    if (result.status !== 200)
        return window.alert("Cannot load user")

    const responsebody = await result.json()
    const user = responsebody["result"]["user"]

    // Update title
    document.title = `${user["username"]} - Blog.io`

    document.getElementById("result").insertAdjacentHTML(
        'beforeend',
        `<h1 class="card-title">${user["username"]}</h1>
        <hr />
        <h3>About Me</h3>
        <p class="card-text">${user["bio"]}</p>`
    )
}