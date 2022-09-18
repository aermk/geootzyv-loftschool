/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 299:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const createReviewForm = __webpack_require__(0);
const getLocalStorageReview = __webpack_require__(273);

async function getReadyReviewsForm(currentGeoObjects) { // принимает массив с объектами?

    let reviewListHTML = '';
    const reviews = getLocalStorageReview();
    console.log(reviews, 'reviews')

    for (const review of reviews) { // идем по каждому ревью из сторэджа
        let form = createReviewForm(review.author, review.place, review.reviewText);
        if (currentGeoObjects.some((geoObject) => JSON.stringify(geoObject.geometry._coordinates) === JSON.stringify(review.coordinates))) {
            reviewListHTML += createReviewForm();
        }
    }
    return reviewListHTML; //возвращаем блок со списком ревью
}

module.exports = getReadyReviewsForm;


/***/ }),

/***/ 273:
/***/ ((module) => {



function getLocalStorageReview() { // получаем список ревью
    const reviews = localStorage.reviews // создаем массив в локал сторе
    return JSON.parse(reviews || "[]") // возвращаем массив ревью или пустой массив
}

module.exports = getLocalStorageReview;

/***/ }),

/***/ 398:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const popupForm = __webpack_require__(624);
const createReviewForm = __webpack_require__(0);
const getReadyReviewsForm = __webpack_require__(299);

let map;

function mapInit() {
    map = new ymaps.Map('map', {
        center: [61.78900090727265, 34.375410146877094],
        zoom: 15,
    });

    map.events.add('click', (e) => {
        const coordinates = e.get('coords');
        openModalWindow(map, coordinates);
    });

    addPlacemarksOnMap(map); // вызываем получение объектов
}

// async function getReadyReviewsForm(currentGeoObjects) { // принимает массив с объектами?

//     let reviewListHTML = '';
//     const reviews = getLocalStorageReview();
//     console.log(reviews, 'reviews')

//     for (const review of reviews) { // идем по каждому ревью из сторэджа
//         let form = createReviewForm(review.author, review.place, review.reviewText);
//         if (currentGeoObjects.some((geoObject) => JSON.stringify(geoObject.geometry._coordinates) === JSON.stringify(review.coordinates))) {
//             reviewListHTML += form;
//         }
//     }
//     return reviewListHTML; //возвращаем блок со списком ревью
// }

// function getLocalStorageReview() { // получаем список ревью
//     const reviews = localStorage.reviews // создаем массив в локал сторе
//     return JSON.parse(reviews || "[]") // возвращаем массив ревью или пустой массив
// }

function addPlacemarksOnMap(map) { // приходит карта
    const reviewsList = getLocalStorageReview()
    for (const review of reviewsList) { //проходим по каждому ревью в списке, если он есть
        // создаем метку по координатам ревью

        const placemark = map.geoObjects.add(new ymaps.Placemark(review.coordinates, {}, {
            preset: 'islands#dotIcon',
            iconColor: '#E8AA4DFF'
        }))

        placemark.events.add('click', e => { // по клику на метку
            e.stopPropagation();
            openModalWindow(map, e.get('coords'), [e.get('target')]) // приходит карта, координаты клика
        })
    }
}

async function getAddress(coords) {
    return new Promise((resolve) => {
        ymaps.geocode(coords).then(function (res) {
            const firstGeoObject = res.geoObjects.get(0);
            let adress = firstGeoObject.getAddressLine();
            resolve(adress);
        })
    });
}

async function openModalWindow(map, coordinates, currentPlacemarks = []) {
    //currentGeoObjects пустое при новой метке

    let location = await getAddress(coordinates);

    await map.balloon.open(coordinates, {
        content: `<div class="location">${location}</div>` + `<hr>` +
            `<div class="existingReviewsList">
        ${await getReadyReviewsForm(currentPlacemarks) || `<h4>no fucking reviews</h4>`}
        </div> 
        ` + popupForm,
        close: false,
    })

    const addBtn = document.querySelector('#add-btn');

    addBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const currentReviewsList = document.querySelector('.currentReviewsList');
        const getAuthor = document.querySelector('.author');
        const getPlace = document.querySelector('.place');
        const getReview = document.querySelector('.review');

        const review = {
            coordinates,
            author: getAuthor.value,
            place: getPlace.value,
            reviewText: getReview.value,
        }

        getAuthor.value = '';
        getPlace.value = '';
        getReview.value = '';

        localStorage.reviews = JSON.stringify([...getLocalStorageReview(), review])

        getReadyReviewsForm(currentPlacemarks).then(() => {
            const warning = document.querySelector('h4');
            warning?.remove();
            const reviewForNewPlacemark = document.createElement('div');
            let form = createReviewForm(review.author, review.place, review.reviewText);

            reviewForNewPlacemark.innerHTML = form;
            currentReviewsList.append(reviewForNewPlacemark);
        })
        addPlacemarksOnMap(map);
    })
}

ymaps.ready(mapInit);

module.exports = mapInit;


/***/ }),

/***/ 624:
/***/ ((module) => {

const popupForm = `

<form id="add-form" class="form">
  <div class="form-row currentReviewsList">
  </div>
    <div class="form-row">
      <h3 class="form-title">Leave your feedback:</h3>
    </div>
    <div class="form-row">
      <input type="text" placeholder="Your name" name="author" class="form-input author">
    </div>
    <div class="form-row">
      <input type="text" placeholder="Place" name="place" class="form-input place">
    </div>
    <div class="form-row">
      <textarea placeholder="Your feedback" name="review" class="form-input form-input--textarea review"></textarea>
    </div>

    <div class="btn-footer">
      <button id="add-btn" class="btn">Add</button>
    </div>

</form>
`
module.exports = popupForm;

/***/ }),

/***/ 0:
/***/ ((module) => {

function createReviewForm(author, place, text) {
    return `
    <div class="existingReviewItem">
    <div class="existingReviewItem-author-place">
        <b>${author}</b> <i>${place}</i></div>
    <div class="existingReviewItem-text">${text}</div>
</div>
`
}

module.exports = createReviewForm;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";


const mapInit = __webpack_require__(398);
const popupForm = __webpack_require__(624);
const createReviewForm = __webpack_require__(0);
const getLocalStorageReview = __webpack_require__(273);
const getReadyReviewsForm = __webpack_require__(299);
})();

/******/ })()
;