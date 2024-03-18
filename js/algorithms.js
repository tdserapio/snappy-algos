var request, articles;
var articleHolder = document.querySelector(".results");

// sorts the array in searchbar
function sort2DArrayFunc(a, b) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] > b[0]) ? -1 : 1;
    }
}

// gets JSON
async function doAjaxThings() {
    request = new XMLHttpRequest();
    request.open("GET", "./availableArticles.json", false);
    request.send(null);
    articles = JSON.parse(request.responseText)["articles"];
}

// finds how similar two sentences are
function sentenceSimilarity(s1, s2) {
    s1 = s1.toLowerCase().split(" ");
    s2 = s2.toLowerCase().split(" ");
    let similarity = 0;
    for (let i = 0; i < s1.length; i++) {
        for (let j = 0; j < s2.length; j++) {
            if (s1[i].indexOf(s2[j]) != -1) {
                similarity++;
            }
        }
    }
    return similarity;
}

// gets JSON
doAjaxThings();

const checkLink = () => {
    let url_string = window.location.href; // www.test.com?filename=test
    let url = new URL(url_string);
    let paramValue = url.searchParams.get("query");

    if (paramValue == null) {
        document.querySelector(".results").innerHTML = `<h3>Alternatively, check out the <a href="?query=">archives</a>.</h3>`;
        document.querySelector(".container").style.paddingTop = "34vh";
    } else {
        // control CSS stuff
        document.querySelector("h1").style.display = "none";
        document.querySelector(".container").style.paddingTop = "13vh";
        document.querySelector('input[type="text"]').value = paramValue;
        
        // get the search query
        paramValue = paramValue.replace("+", " ");

        // the search results that match
        let searchResults = [];
        articles.forEach((article) => {
            // currSJ meant curr Sentence Jaccard because I was planning to use Jaccard Similarity but that was too weird
            let currSJ = sentenceSimilarity(article['title'], paramValue);
            if (currSJ != 0) { // if there is some semblance
                searchResults.push([currSJ, article]);
            }
        });
        // sort based on how similar they are (the higher the more up in results)
        searchResults.sort(sort2DArrayFunc);
        if (searchResults.length == 0) { // sad no results
            articleHolder.innerHTML = `<h3>No results found.</h3>`;
            document.querySelector(".container").style.paddingTop = "34vh";
        } else { // yay with results (a blank search result just gives all the articles)
            articleHolder.innerHTML += `<br>
            <hr>`;
            searchResults.forEach((article) => {
                articleHolder.innerHTML += `
                <div class="result">
                    <div class="titleDiv">
                        <h2 class="resultTitle" onclick="window.location.href='${article[1]["linkToArticle"]}'" style="cursor: pointer;">${article[1]["title"]}</h2>
                        <p class="resultPublished">Date Published: ${article[1]["datePublished"]}</p>
                    </div>
                    <p class="resultDescription">${article[1]["description"]}</p>
                </div>
                <br>
                <hr>
                `;
            });
        }
        // the "archives" is just all the articles
        articleHolder.innerHTML += `<br><h3>Alternatively, check out the <a href="?query=">archives</a>.</h3><br><br><br>`;
    }
}