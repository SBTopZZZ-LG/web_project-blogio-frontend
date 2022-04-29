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

async function create() {
    const title = document.getElementById("titlefield").value
    var body = document.getElementById("bodyfield").value

    if (!title || !body)
        return window.alert("Your blog is incomplete. Please complete your blog before saving.")

    if (!isSignedIn())
        return window.alert("Please sign in before posting a blog.")

    // Before posting, replace all new lines with breaks
    body = body.split("\n").join("<br/>")

    const result = await fetch('https://webproject-blogio-backend.sbtopzzzlg.repl.co/blog/create',
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
                "Authorization": localStorage.getItem("LOGINTOKEN")
            },
            body: JSON.stringify({
                email: localStorage.getItem("USEREMAIL"),
                blog: {
                    title,
                    body,
                    posted_at: Date.now()
                }
            })
        })
    if (result.status !== 200)
        return window.alert("Unknown error occurred")

    // Success
    window.alert("Blog posted")

    // Navigate to that blog
    const responsebody = await result.json()
    const blog_id = responsebody["result"]["blog"]["_id"]

    window.location.href = `/html/blog.html?id=${blog_id}`
}