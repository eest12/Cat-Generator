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
 * Processes data returned by an API.
 * @callback requestCallback
 * @param {string} responseMessage
 */

/**
 * Makes a GET call.
 * @param {string} url The API URL to call.
 * @param {requestCallback} callback The callback function to run after getting data back from the API.
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
 * Sets the source of the cat image element, sets the color of the page background, and hides the loader element.
 * @param {string} imgSource The URL or path of the cat image.
 * @param {string} bgColor The color to set the page background to.
 */
function showCatImage(imgSource, bgColor = "rgb(20, 20, 30)") {
    document.getElementsByTagName("body")[0].style.backgroundColor = bgColor; // set background color
    imageElem.src = imgSource; // set cat image source
    loadElem.style.display = "none"; // hide loader
    imageElem.style.display = "block"; // show cat image
}

/**
 * Parses and shows the breed information if the breed checkbox is selected.
 * @param {Object[]} breedData A list of cat breeds and their details in JSON format.
 */
function showBreedInfo(breedData) {
    // make sure checkbox for breed info is checked
    if (document.getElementById("showdesc").checked) {
        descElem.style.display = "block";

        // check if breed info is available for this image
        if (breedData && breedData.length > 0) {
            descElem.innerHTML = "";

            for (let i = 0; i < breedData.length; i++) {
                let name = breedData[i]["name"] ? breedData[i]["name"] : "Unknown";
                let temp = breedData[i]["temperament"] ? breedData[i]["temperament"] : "Unknown";
                let origin = breedData[i]["origin"] ? breedData[i]["origin"] : "Unknown";
                let desc = breedData[i]["description"] ? breedData[i]["description"] : "Unknown";

                descElem.innerHTML += `<dl><dt>Breed</dt><dd>${name}</dd>
                <dt>Temperament</dt><dd>${temp}</dd>
                <dt>Origin</dt><dd>${origin}</dd>
                <dt>Description</dt><dd>${desc}</dd></dl>`;

                // if there are more breeds after this one, add a divider
                if (i < breedData.length - 1) {
                    descElem.innerHTML += "<hr>";
                }
            }
        } else {
            descElem.innerHTML = "No breed info for this cat, sorry!";
        }
    } else {
        descElem.style.display = "none";
    }
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

        // use the sightengine api only if the user and secret are available
        if (imgModUser && imgModSecret) {
            let dominantColorUrl = `https://api.sightengine.com/1.0/check.json?url=${catImageUrl}&models=properties&api_user=${imgModUser}&api_secret=${imgModSecret}`;

            // call sightengine api for dominant color of image
            ajax_get(dominantColorUrl, function (colorData) {
                // note: this callback function won't execute once the allowed amount of api calls to sightengine has been exceeded
                // need to handle this error so the image still loads even if the background color doesn't change

                showCatImage(catImageUrl, colorData["colors"]["dominant"]["hex"]); // set cat image and background color
                showBreedInfo(catData[0]["breeds"]); // update the breed description element
            });
        } else {
            showCatImage(catImageUrl); // set cat image without setting background color
        }
    });
}

// load cat image when the button is pressed
document.getElementById("reload").addEventListener("click", function () {
    loadCat();
})

loadCat(); // load cat image when page loads