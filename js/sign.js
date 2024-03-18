// capitalize word
function capitalize(s) {
    return s[0].toUpperCase() + s.slice(1);
}

// access localStorage as an object
const lStoreObject = (key) => {
    return JSON.parse(localStorage.getItem(key));
}

// clear the input fields of the form
const clearFields = () => {
    let container = document.querySelector(".container");
    container.querySelectorAll("*").forEach((elem) => {
        if (elem.tagName == "INPUT") {
            elem.value = "";
        }
    });
}

// log-in user
const logIn = () => {
    // get username and password
    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;

    if (localStorage.getItem(username) == null) { // if username not found
        alert("Username not found! Please try again.");
        clearFields();
    } else {
        if (lStoreObject(username)["password"] != password) { // if password wrong
            alert("Wrong password or username!");
            clearFields();
        } else { // password correct
            localStorage.setItem("signedIn", username);
            window.location.href = "/";
        }
    }
}

const signUp = () => {
    // get all fields, my bad for not using FormData
    let username = document.querySelector("#username").value;
    let email = document.querySelector("#email").value;
    let nationality = document.querySelector("#nationality").value;
    let age = document.querySelector("#age").value;
    let password = document.querySelector("#password").value;

    if (localStorage.getItem(username) != null) {
        alert("Username already taken!");
        clearFields();
    } else {
        // the literal date right now when they registered
        let likeRightNow = new Date();
        let modifiedRn = likeRightNow.toISOString().split('T')[0];
        modifiedRn = modifiedRn.split("/").join(" - ");
        // just make a new entry of object in localStorage
        localStorage.setItem(username, `{
    "email": "${email}",
    "nationality": "${nationality}",
    "age": ${age},
    "password": "${password}",
    "user since": "${modifiedRn}"
}`);
        window.location.href = "/html/signin.html"
    }
}

const loadRest = () => {
    // get the current person signed in
    let username = localStorage.getItem("signedIn");

    // say hi
    document.querySelector(".container").innerHTML = `
<h1>Hello, ${username}!</h1><br><br>
    `;
    let dictStorage = lStoreObject(username);

    // each of the characteristics that can be displayed
    for (var key of Object.keys(dictStorage)) {
        if (key == "password") continue;
        let toAdd = `<h3 style="user-select: text; cursor: text;"><span style="text-decoration: underline; font-weight: bold; user-select: none; cursor: pointer;">${capitalize(key)}:</span> ${dictStorage[key]}`;
        if (key == "age") toAdd += " year(s) old";
        document.querySelector(".container").innerHTML += toAdd + "</h3>";
    }
    // log-out option
    document.querySelector(".container").innerHTML += `<br><br>
<button onclick="logOut()">LOG-OUT</button>
    `;
}

const logOut = () => { // logging out means signedIn guy is not signedIn anymore :(
    localStorage.setItem("signedIn", "");
    alert("Successfully signed out of your account!");
    window.location.href = "/";
}