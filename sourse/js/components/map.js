const popupForm = require('./popupForm');
const createReviewForm = require('./reviewsForm');
const { getReadyReviewsForm, getLocalStorageReview } = require('./listOfReviews');
const fns = require('date-fns');

let map;
let clusterer;
const listOfPlacemarkLS = [];

function mapInit() {
    map = new ymaps.Map('map', {
        center: [61.78900090727265, 34.375410146877094],
        zoom: 16,
    });

    map.events.add('click', (e) => {
        const coordinates = e.get('coords');
        openModalWindow(coordinates);
    });

    const customItemContentLayout = ymaps.templateLayoutFactory.createClass(

        `<div class="ballon-content">
            <div class="ballon-header">
                <div class="title">{{ properties.place }}</div>
            <br>
                <a href="" class="adress">{{ properties.adress }}</a>
            </div>

            <div class="ballon-body">{{ properties.reviewText }}</div>

            <div class="ballon-footer">{{ properties.timestamp }}</div>
        </div>`, {
        build: function () {
            customItemContentLayout.superclass.build.call(this);
            const elemAddress = this.getElement().querySelector(".adress");
            const coords = this.getData().geoObject.geometry.getCoordinates();

            ymaps.geocode(coords).then((result) => {
                return result.geoObjects.get(0).getAddressLine();
            }).then(adress => {
                elemAddress.innerText = adress;
            });
            elemAddress.addEventListener("click", event => {
                event.preventDefault();
                openModalWindow(coords);
            });
        }
    }
    );

    clusterer = new ymaps.Clusterer({
        preset: 'islands#invertedVioletClusterIcons',
        clusterDisableClickZoom: true,
        groupByCoordinates: false,
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        clusterBalloonItemContentLayout: customItemContentLayout,
    });

    clusterer.options.set({
        gridSize: 70,
        clusterDisableClickZoom: true
    });

    addPlacemarksOnMap(map);
}

function createPlacemark(review) {
    let placemark = new ymaps.Placemark(review.coordinates, {
        place: review.place,
        reviewText: review.reviewText,
        timestamp: review.timestamp,
        author: review.author,
        adress: review.location,
        coordinates: review.coordinates
    }, {
        preset: "islands#violetDotIcon"
    });

    placemark.events.add('click', e => {
        placemark.options.set('hasBalloon', false)
        e.stopPropagation();
        openModalWindow(e.get('target').geometry.getCoordinates());
    })
    listOfPlacemarkLS.push(placemark);
}

function addNewPlacemarks(currentPlacemarks) {

    for (const review of currentPlacemarks) {
        createPlacemark(review);
    }

    clusterer.add(listOfPlacemarkLS);
    map.geoObjects.add(clusterer);
};

function addPlacemarksOnMap(map) {

    const reviewsList = getLocalStorageReview();

    for (const review of reviewsList) {
        createPlacemark(review);
    }

    clusterer.removeAll();
    map.geoObjects.remove(clusterer);

    clusterer.add(listOfPlacemarkLS);
    map.geoObjects.add(clusterer);
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

async function openModalWindow(coordinates) {
    const currentPlacemarks = listOfPlacemarkLS
        .filter((i) => coordinates[0] === i.properties._data.coordinates[0] && coordinates[1] === i.properties._data.coordinates[1])

    let location = await getAddress(coordinates);

    await map.balloon.open(coordinates, {
        content: `<div class="location">${location}</div>` + `<hr>` +
            `<div class="existingReviewsList">
        ${await getReadyReviewsForm(currentPlacemarks) || `<h4>no reviews</h4>`}
        </div> 
        ` + popupForm,
        close: false,
    })

    const existingReviewsList = document.querySelector('.existingReviewsList');

    const addBtn = document.querySelector('#add-btn');

    addBtn.addEventListener('click', (e) => {
        e.preventDefault();

        let currentPlasemarks = [];

        const getAuthor = document.querySelector('.author');
        const getPlace = document.querySelector('.place');
        const getReview = document.querySelector('.review');
        const timestamp = fns.format(new Date(), 'PPp');

        const review = {
            coordinates,
            author: getAuthor.value,
            place: getPlace.value,
            reviewText: getReview.value,
            timestamp: timestamp,
            location: location,
        }

        getAuthor.value = '';
        getPlace.value = '';
        getReview.value = '';

        currentPlasemarks.push(review);
        addNewPlacemarks(currentPlasemarks);

        localStorage.reviews = JSON.stringify([...getLocalStorageReview(), review]);

        const warning = document.querySelector('h4');
        warning?.remove();
        const reviewForNewPlacemark = document.createElement('div');
        reviewForNewPlacemark.classList.add('existingReviewItem');
        let form = createReviewForm(review.author, review.place, review.reviewText, review.timestamp);
        reviewForNewPlacemark.innerHTML = form;
        existingReviewsList.append(reviewForNewPlacemark);
    })
}

ymaps.ready(mapInit);

module.exports = mapInit;
