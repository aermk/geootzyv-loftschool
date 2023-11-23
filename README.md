# Geo-review app

## About

The application displays a Yandex map. The user can select objects on the map and leave reviews about them.

### How it works

When the user clicks on the map, a modal window opens with a review form. After filling out the form and clicking on the “Add review” button, a placemark is added to the map at the coordinates at which the modal window was opened.
After clicking on the placemark, a form opens for a new review at these coordinates; the form contains the previously left review.
Placemarks nearby are grouped into one placemark. When the map is scaled, placemarks are grouped. For grouped placemarks, their number is displayed.

When you click on a grouped placemark, a review carousel opens. When you click on the address, a modal window opens in which you can leave a new review, as well as view reviews already left for these coordinates.

When the page is reloaded, all reviews and placemarks are restored (LocalStorage is used).

### Built with

JavaScript
Webpack
Yandex Maps API
HTML, CSS

### Demo link
https://aermk.github.io/geootzyv-loftschool/dist/index.html
