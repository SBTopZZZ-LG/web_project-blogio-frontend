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
async function searchBlogs() {
    const queryString = window.location.search
    const queries = new URLSearchParams(queryString)

    const searchQuery = queries.get("keyword")

    const result = await fetch(`http://localhost:3000/blog/search?query=${searchQuery}`,
        {
            method: "GET"
        })
    if (result.status !== 200)
        return window.alert("Failed to search blogs")

    const responsebody = await result.json()
    const blogs_raw = responsebody["result"]["blogs"]
    var blogs = [], authors = []
    for (var i = 0; i < blogs_raw.length; i++) {
        blogs.push(await getBlog(blogs_raw[i]))
        authors.push(await getUser(blogs[i]["author"]))
    }

    // Update results count
    document.getElementById("result_count").innerText = blogs.length
    // Update title
    document.title = `${blogs.length} result(s) for '${searchQuery}' - Blog.io`

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
            <div style="opacity: ${blogs[i]["likes"].includes(me["_id"]) ? 1 : 0}">
                <img src="../images/heart-2.png" alt="" width="25px" height="25px" style="margin-right: 10px;" />
                <span>Your Favourite</span>
            </div>
        </div>
    </div>
    <hr />`
        )
}