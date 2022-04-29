async function loadBlog() {
    const queryString = window.location.search
    const queries = new URLSearchParams(queryString)

    const blog_id = queries.get("id")
    if (!blog_id)
        return window.alert("Blog id required")

    var result = await fetch(`http://localhost:3000/blog/one?id=${blog_id}`,
        {
            method: "GET"
        })
    if (result.status !== 200)
        return window.alert(`Cannot load blog\nError code: ${result.status}`)

    var responsebody = await result.json()
    const blog = responsebody["result"]["blog"]

    const me = await getSignedUser()

    if (isSignedIn() && blog["author"] === me["_id"])
        // Place edit button
        document.getElementById("user_state_view2").insertAdjacentHTML(
            'beforeend',
            `<a class="btn btn-outline-primary" href='/html/editblog.html?id=${blog["_id"]}'>Edit Blog</a>`
        )

    // Change title
    document.title = `${blog["title"]} - Blog.io`

    result = await fetch(`http://localhost:3000/user?id=${blog["author"]}`)

    var author = null
    if (result.status === 200) {
        responsebody = await result.json()
        author = responsebody["result"]["user"]
    }

    const liked = me && blog["likes"].includes(me["_id"])

    document.getElementById("result").insertAdjacentHTML(
        "beforeend",
        `<h1 class="card-title">${blog["title"]}</h1>
        <div style="display: flex; justify-content: space-between; margin-bottom: 50px;">
            <div></div>
            <a onclick="${liked ? "dislikeBlog('$')".replace("$", blog["_id"]) : "likeBlog('$')".replace("$", blog["_id"])};" class="btn btn-light">
                <img src="/images/${liked ? "heart-2" : "heart"}.png" alt="" width="25px" height="25px" style="margin-right: 10px;" />
                <span>${liked ? "Added to your Favourites" : "Add to Favourites"}</span>
            </a>
        </div>
        <hr/>
        <p>${blog["body"]}</p>
        <hr/>
        <span>Article by <span
                    style="font-weight: bold; color: rgb(11, 34, 188); cursor: pointer; margin-top: auto; margin-bottom: auto;" onclick="window.location.href = '/html/user.html?id=${author["_id"]}'"><u>${author["username"]}</u></span></span>
        <br/>
                    <i>“${author["bio"]}”</i>`
    )
}