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
async function loadMe() {
    if (!isSignedIn())
        return window.alert("You are not logged in")

    const result = await fetch('http://localhost:3000/user/get',
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
    if (result.status !== 200)
        return window.alert("Unknown error occurred")

    const responsebody = await result.json()
    const user = responsebody["result"]["user"]

    document.getElementById("user_details").insertAdjacentHTML(
        'beforeend',
        `<h1 class="card-title" style="cursor: pointer;">${user["username"]}</h1>
        <h5><u>${user["email"]}</u></h5>
    <hr />
    <h3>About Me</h3>
    <p class="card-text">${user["bio"]}</p>`
    )

    // Blogs
    var blogs = []
    for (var i = 0; i < user["blogs_posted"].length; i++)
        blogs.push(await getBlog(user["blogs_posted"][i]))
    blogs = blogs.filter(blog => !!blog)

    for (var i = 0; i < blogs.length; i++)
        document.getElementById("my_blogs").insertAdjacentHTML(
            'beforeend',
            `<div class="card-body">
    <h5 class="card-title" style="cursor: pointer;" onclick="window.location.href = '/html/blog.html?id=${blogs[i]["_id"]}'">${blogs[i]["title"]}</h5>
    <p class="card-text">${blogs[i]["body"].split("<br/>")[0]}</p>
    <!-- Action Buttons -->
    <div style="display: flex; justify-content: space-between;">
        <div></div>
        <a href="#" class="btn btn-light">
            <img src="../images/heart.png" alt="" width="25px" height="25px" style="margin-right: 10px;" />
            Add to Favourites
        </a>
    </div>
</div>
<hr />`)
}