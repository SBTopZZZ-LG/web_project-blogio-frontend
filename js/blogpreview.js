async function loadBlog() {
    const title = localStorage.getItem("saved_title")
    var body = localStorage.getItem("saved_body")

    if (!title || !body)
        return window.alert("Missing parameters")

    // Replace new lines with breaks
    body = body.split("\n").join("<br/>")

    // Deleted stored data
    localStorage.removeItem("saved_title")
    localStorage.removeItem("saved_body")

    const user = await getSignedUser()
    if (!user)
        return window.alert("Unknown error occurred")

    document.getElementById("result").insertAdjacentHTML(
        'beforeend',
        `<h1 class="card-title">${title}</h1>
        <div style="display: flex; justify-content: space-between; margin-bottom: 50px;">
            <div></div>
            <a href="#" class="btn btn-light">
                <img src="/web_project-blogio-frontend/images/heart.png" alt="" width="25px" height="25px" style="margin-right: 10px;" />
                Add to Favourites
            </a>
        </div>
        <hr/>
        <p>${body}</p>
        <hr/>
        <span>Article by <span
                    style="font-weight: bold; color: rgb(11, 34, 188); cursor: pointer; margin-top: auto; margin-bottom: auto;" onclick="window.location.href = '/web_project-blogio-frontend/html/user.html?id=${user["_id"]}'"><u>${user["username"]}</u></span></span>
        <br/>
                    <i>“${user["bio"]}”</i>`
    )
}