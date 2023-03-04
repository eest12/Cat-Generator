let loadElem = document.getElementById("loader");
let imageElem = document.getElementById("image");
let descElem = document.getElementById("description");

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
async function loadCat() {
    const netlifyFuncPath = "/.netlify/functions/fetch-api";

    // cat api query parameters
    const catApiId = "cat_api";
    let sunglasses = "false";

    // set whether to request only images of cats with sunglasses
    if (document.getElementById("sunglasses").checked) {
        sunglasses = "true";
    }

    imageElem.style.display = "none"; // hide cat image
    loadElem.style.display = "block"; // show loader

    // request cat data
    const catData = await fetch(`${netlifyFuncPath}?id=${catApiId}&sunglasses=${sunglasses}`).then((res) => res.json());
    
    // sightengine api query and request
    const seApiId = "se_api";
    const catImageUrl = catData["data"][0]["url"];
    const colorData = await fetch(`${netlifyFuncPath}?id=${seApiId}&imgUrl=${catImageUrl}`).then((res) => res.json());

    showCatImage(catImageUrl, colorData["data"]["colors"]["dominant"]["hex"]); // set cat image and background color
    showBreedInfo(catData["data"][0]["breeds"]); // update the breed description element
}

// load cat image when the button is pressed
document.getElementById("reload").addEventListener("click", function () {
    loadCat();
})

loadCat(); // load cat image when page loads