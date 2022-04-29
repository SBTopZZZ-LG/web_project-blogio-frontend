async function loadBlog() {
    const queryString = window.location.search
    const queries = new URLSearchParams(queryString)

    const blog_id = queries.get("id")

    if (!blog_id)
        return window.alert("Failed to load blog")

    const result = await fetch(`http://localhost:3000/blog/one?id=${blog_id}`,
        {
            method: "GET"
        })
    if (result.status !== 200)
        return window.alert("Unknown error occurred")

    const responsebody = await result.json()
    const blog = responsebody["result"]["blog"]

    // Replace breaks with new lines
    blog["body"] = blog["body"].split("<br/>").join("\n")

    // Set values
    document.getElementById("titlefield").value = blog["title"]
    document.getElementById("bodyfield").value = blog["body"]
}
async function deleteblog() {
    const queryString = window.location.search
    const queries = new URLSearchParams(queryString)

    const blog_id = queries.get("id")

    const result = await fetch('http://localhost:3000/blog/delete',
        {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                "Authorization": localStorage.getItem("LOGINTOKEN")
            },
            body: JSON.stringify({
                email: localStorage.getItem("USEREMAIL"),
                blog_id
            })
        })
    if (result.status !== 200)
        return window.alert("Failed to delete blog")

    window.alert("Blog was deleted")

    // Navigate to home page
    window.location.href = "/index.html"
}
async function preview() {
    const title = document.getElementById("titlefield").value
    const body = document.getElementById("bodyfield").value

    if (!title || !body)
        return window.alert("Your blog is incomplete. Please complete your blog before previewing.")

    // Store
    localStorage.setItem("saved_title", title)
    localStorage.setItem("saved_body", body)

    // Navigate to blog_preview
    window.open('/html/blogpreview.html', '_blank')
}
async function edit() {
    const queryString = window.location.search
    const queries = new URLSearchParams(queryString)

    const blog_id = queries.get("id")

    const title = document.getElementById("titlefield").value
    var body = document.getElementById("bodyfield").value

    if (!title || !body)
        return window.alert("Your blog is incomplete. Please complete your blog before saving.")

    if (!isSignedIn())
        return window.alert("Please sign in before posting a blog.")

    // Before posting, replace all new lines with breaks
    body = body.split("\n").join("<br/>")

    const result = await fetch('http://localhost:3000/blog/update',
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                "Authorization": localStorage.getItem("LOGINTOKEN")
            },
            body: JSON.stringify({
                email: localStorage.getItem("USEREMAIL"),
                blog_id: blog_id,
                blog: {
                    title,
                    body
                }
            })
        })
    if (result.status !== 200)
        return window.alert("Unknown error occurred")

    // Success
    window.alert("Blog edited")

    // Navigate to that blog
    window.location.href = `/html/blog.html?id=${blog_id}`
}