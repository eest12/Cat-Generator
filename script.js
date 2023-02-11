let catKey = "";
let imgModUser = "";
let imgModSecret = "";
let loadElem = document.getElementById("loader");
let imageElem = document.getElementById("image");
let descElem = document.getElementById("description");

// set secret variables if available from the config file
try {
    catKey = config.CAT_KEY;
    imgModUser = config.IMG_MOD_USER;
    imgModSecret = config.IMG_MOD_SECRET;
} catch (err) {
    console.log(err.message);
}

/**
 * Makes a GET call.
 * @param {*} url The API URL to call.
 * @param {*} callback The callback function to run after getting data back from the API.
 */
function ajax_get(url, callback) {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            try {
                let data = JSON.parse(xmlhttp.responseText);
                callback(data);
            } catch (err) {
                console.log(err.message + " in " + xmlhttp.responseText);
                return;
            }
        }
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

/**
 * Loads a cat image by calling the Cat API.
 * Also changes the background color of the page to the dominant color in the cat image by calling the SightEngine API.
 */
function loadCat() {
    let catUrl = "https://api.thecatapi.com/v1/images/search?mime_types=jpg,png";

    // fetch only images of cats with sunglasses
    if (document.getElementById("sunglasses").checked) {
        catUrl += "&category_ids=4";
    }

    // use the api key if available; key is required only for some operations, like reading breed info
    if (catKey) {
        catUrl += `&api_key=${catKey}`;
    }

    imageElem.style.display = "none"; // hide cat image
    loadElem.style.display = "block"; // show loader

    // call cat api to fetch image
    ajax_get(catUrl, function (catData) {
        let catImageUrl = catData[0]["url"];
        let dominantColorUrl = `https://api.sightengine.com/1.0/check.json?url=${catImageUrl}&models=properties&api_user=${imgModUser}&api_secret=${imgModSecret}`;

        // call sightengine api for dominant color of image
        ajax_get(dominantColorUrl, function (colorData) {
            // note: this callback function won't execute once the allowed amount of api calls to sightengine has been exceeded
            // need to handle this error so the image still loads even if the background color doesn't change

            document.getElementsByTagName("body")[0].style.backgroundColor = colorData["colors"]["dominant"]["hex"]; // set background color
            imageElem.src = catImageUrl; // set cat image source
            loadElem.style.display = "none"; // hide loader
            imageElem.style.display = "block"; // show cat image

            // set breed info if checkbox is checked
            if (document.getElementById("showdesc").checked) {
                descElem.style.display = "block";

                // check if breed info is available for this image
                if (catData[0]["breeds"] && catData[0]["breeds"].length > 0) {
                    let name = catData[0]["breeds"][0]["name"] ? catData[0]["breeds"][0]["name"] : "Unknown";
                    let temp = catData[0]["breeds"][0]["temperament"] ? catData[0]["breeds"][0]["temperament"] : "Unknown";
                    let origin = catData[0]["breeds"][0]["origin"] ? catData[0]["breeds"][0]["origin"] : "Unknown";
                    let desc = catData[0]["breeds"][0]["description"] ? catData[0]["breeds"][0]["description"] : "Unknown";

                    descElem.innerHTML = `<dl><dt>Breed</dt><dd>${name}</dd>
                        <dt>Temperament</dt><dd>${temp}</dd>
                        <dt>Origin</dt><dd>${origin}</dd>
                        <dt>Description</dt><dd>${desc}</dd></dl>`;
                } else {
                    descElem.innerHTML = "No breed info for this cat, sorry!";
                }
            } else {
                descElem.style.display = "none";
            }
        });
    });
}

// load cat image when the button is pressed
document.getElementById("reload").addEventListener("click", function () {
    loadCat();
})

loadCat(); // load cat image when page loads