// gets JSON
async function checkLink() {
    // get the link and get "name" for article
    let url_string = window.location.href;
    let url = new URL(url_string);
    let paramValue = url.searchParams.get("name");

    // if no article found with title :'(
    if (paramValue == null) {
        window.alert("ERROR: Page not found.\n");
        setTimeout(() => {
            window.location.href = "/html/algorithms/index.html";
        }, 2500);
    }

    // make XMLHttpRequest
    request = new XMLHttpRequest();
    try {
        // get file
        request.open("GET", `./articles/${paramValue}`, false);
        request.send(null);
    } catch {
        // aw man
        window.alert("ERROR: Page not found.\n");
        window.location.href = "/html/algorithms/index.html";
    }

    // yay file exist
    let res = (request.responseText);
    if (res.includes("Error response")) { // oh no its error
        window.location.href = "/html/algorithms/index.html";
    }
    // nevermind, it IS the file, make newlines <br>
    res = String(res);
    res = res.replace(/\r/g, "");
    res = res.split("\n\n");
    res = res.join("<br>");

    // put it in the container as described in article.html
    document.querySelector(".container").innerHTML = res;
}