# Cat-Generator

    ![Cat Generator Screenshot](page-screenshot.jpg)

This riveting, fascinating website shows you a picture of a cat. Click the "New Kitty" button to see a new cat. The images are fetched from The Cat API.

The background of the page changes with each image, matching the dominant color of each cat pic. This feature works by calling the SightEngine API.

## Future improvements

- When the daily limit of calls to the SightEngine API has been reached, the page stops updating with new images, getting stuck on the loader icon. This should be improved so that new cat images are still displayed even if the background color functionality stops working.
- UI should be made responsive so it adjusts to different screen dimensions.
- Speed could be improved by reducing the amount of API calls.
- Because the images are made to cover a fixed width and height while retaining their original aspect ratio, sometimes a significant portion of the photo is cropped out (like the cat's head, or even the whole cat). This should be fixed to ensure the cat is always visible.
- Breed info should show details of all the cats in the image if there are multiple, not just of one breed, since it is uncertain which cat the description refers to.
- **Debatable improvement:** Currently, checking "Breed info" only enables this feature for the next cat image. This feature should show the breed details of the currently displayed image as soon as the checkmark is selected.