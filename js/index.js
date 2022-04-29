async function getUser(user_id) {
    var result = await fetch(`http://localhost:3000/user?id=${user_id}`,
        {
            method: "GET"
        })
    if (result.status !== 200)
        return null

    var responsebody = await result.json()
    return responsebody["result"]["user"]
}
async function getBlog(blog_id) {
    var result = await fetch(`http://localhost:3000/blog/one?id=${blog_id}`,
        {
            method: "GET"
        })
    if (result.status !== 200)
        return null

    var responsebody = await result.json()
    return responsebody["result"]["blog"]
}
async function likeBlog(blog_id) {
    await fetch('http://localhost:3000/blog/like',
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                "Authorization": localStorage.getItem("LOGINTOKEN")
            },
            body: JSON.stringify({
                email: localStorage.getItem("USEREMAIL"),
                blog_id
            })
        })

    window.location.reload()
}
async function dislikeBlog(blog_id) {
    await fetch('http://localhost:3000/blog/dislike',
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                "Authorization": localStorage.getItem("LOGINTOKEN")
            },
            body: JSON.stringify({
                email: localStorage.getItem("USEREMAIL"),
                blog_id
            })
        })

    window.location.reload()
}
async function loadBlogs() {
    const queryString = window.location.search
    const queries = new URLSearchParams(queryString)

    const mode = queries.get("type") || "toprated"

    var url = "http://localhost:3000/blog"
    document.getElementById("dropdownMenuButton1").innerHTML = "Viewing by <b>Top Rated</b>"
    var result = null
    if (mode === "latest") {
        url = "http://localhost:3000/blog/last24hrs"
        document.getElementById("dropdownMenuButton1").innerHTML = "Viewing by <b>Latest</b>"
    } else if (mode === "favourite") {
        url = "http://localhost:3000/blog/liked"
        document.getElementById("dropdownMenuButton1").innerHTML = "Viewing by <b>Favourite</b>"

        result = await fetch(url,
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
    }

    if (!result)
        result = await fetch(url,
            {
                method: "GET"
            })

    if (result.status !== 200)
        return window.alert("Failed to load blogs")

    var responsebody = await result.json()
    var blogs = responsebody["result"]["blogs"]

    console.log(blogs)

    for (var i = 0; i < blogs.length; i++)
        blogs[i] = await getBlog(blogs[i])
    blogs = blogs.filter(blog => !!blog)

    var authors = []
    for (var i = 0; i < blogs.length; i++)
        authors.push(await getUser(blogs[i]["author"]))

    // Update results count
    document.getElementById("result_count").innerHTML = `<u>${blogs.length}</u>`

    const me = await getSignedUser()

    // Create blog views
    for (var i = 0; i < blogs.length; i++)
        document.getElementById("results").insertAdjacentHTML(
            "beforeend",
            `<div class="card-body">
        <h5 class="card-title" style="cursor: pointer;" onclick="window.location.href = '/html/blog.html?id=${blogs[i]["_id"]}'">${blogs[i]["title"]}</h5>
        <p class="card-text">${blogs[i]["body"].split("<br/>")[0]}</p>
        <!-- Action Buttons -->
        <div style="display: flex; justify-content: space-between;">
            <span>by <span style="font-weight: bold; color: rgb(11, 34, 188); cursor: pointer;" onclick="window.location.href = '/html/user.html?id=${authors[i]["_id"]}'"><u>${authors[i]["username"]}</u></span></span>
            <div></div>
            <div style="opacity: ${blogs[i]["likes"] && me && blogs[i]["likes"].includes(me["_id"]) ? 1 : 0}">
                <img src="images/heart-2.png" alt="" width="25px" height="25px" style="margin-right: 10px;" />
                <span>Your Favourite</span>
            </div>
        </div>
    </div>
    <hr />`
        )
}

// View methods
function clearView() {
    if (document.getElementById("user_state_view").firstChild)
        document.getElementById("user_state_view").removeChild(document.getElementById("user_state_view").firstChild)
}
function placeSignInButton() {
    clearView()

    document.getElementById("user_state_view").insertAdjacentHTML(
        'beforeend',
        `<a id="userauth_button" class="btn btn-dark" href="/html/signin.html" style="margin-left: 10px">Login</a>`
    )
}
function placeSignedInView(username, imagelocation) {
    clearView()

    document.getElementById("user_state_view").insertAdjacentHTML(
        'beforeend',
        `<a class="btn btn-primary" id="createBlog" style="background-color: transparent; display: inline-flex;" href="/html/newblog.html">
        <img src="${imagelocation || "./images/create.png"}" width="25px" height="25px" alt="" style="margin-right: 5px;" />
        <span style="color: black;"><strong>Create</strong></span>
    </a>
    <div class="dropdown">
        <button class="btn btn-light dropdown-toggle" type="button" id="dropdownMenuButton1"
            data-bs-toggle="dropdown" aria-expanded="false">
            Signed in as ${username}
        </button>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            <li><a class="dropdown-item" href="/html/me.html">My Profile</a></li>
            <li>
                <hr />
            </li>
            <li><a class="dropdown-item" onclick="signOut(); window.location.href = '/index.html'">Logout</a></li>
        </ul>
    </div>`
    )
}