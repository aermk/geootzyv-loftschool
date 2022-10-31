import { format } from 'date-fns'
const popupForm = require('./popupForm');
const createReviewForm = require('./reviewsForm');
const { getReadyReviewsForm, getLocalStorageReview } = require('./listOfReviews');

let map;
let clusterer;

function mapInit() {
    map = new ymaps.Map('map', {
        center: [61.78900090727265, 34.375410146877094],
        zoom: 18,
    });

    map.events.add('click', (e) => {
        const coordinates = e.get('coords');
        openModalWindow(map, coordinates);
    });

    const customItemContentLayout = ymaps.templateLayoutFactory.createClass(

        `<div class="ballon-content">
            <div class="ballon-header">
                <div class="title">{{ properties.place }}</div>
            <br>
                <a href="" class="address">{{ properties.address }}</a>
            </div>

            <div class="ballon-body">{{ properties.reviewText }}</div>

            <div class="ballon-footer">{{ properties.timestamp }}</div>
        </div>`, {
        build: function () {
            customItemContentLayout.superclass.build.call(this);
            const elemAddress = this.getElement().querySelector(".address");
            const coords = this.getData().geoObject.geometry.getCoordinates();
            const dataOfPlacemark = this.getData().geoObject.properties.get(0);

            ymaps.geocode(coords).then((result) => {
                return result.geoObjects.get(0).getAddressLine();
            }).then(address => {
                elemAddress.innerText = address;
            });
            elemAddress.addEventListener("click", event => {
                event.preventDefault();
                openModalWindow(map, coords, [], dataOfPlacemark);
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

    addPlacemarksOnMap(map); // вызываем получение объектов
}

function addPlacemarksOnMap(map) { // приходит карта

    const reviewsList = getLocalStorageReview();

    const listOfCoordinates = [];

    for (const review of reviewsList) { //проходим по каждому ревью в списке, если он есть
        // создаем метку по координатам ревью

        let placemark = new ymaps.Placemark(review.coordinates, {
            place: review.place,
            reviewText: review.reviewText,
            timestamp: review.timestamp,
            author: review.author,
            adress: review.location
        }, {
            preset: "islands#violetDotIcon"
        });


        placemark.events.add('click', e => { // по клику на метку
            placemark.options.set('hasBalloon', false)
            e.stopPropagation();
            openModalWindow(map, e.get('coords'), [e.get('target')]) // приходит карта, координаты клика, существующие метки
        })
        listOfCoordinates.push(placemark);
    }

    clusterer.removeAll();
    map.geoObjects.remove(clusterer);

    clusterer.add(listOfCoordinates);
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

async function openModalWindow(map, coordinates, currentPlacemarks = [], getReviewOfPlacemark = {}) {
    //currentGeoObjects пустое при новой метке
    let location = await getAddress(coordinates);

    await map.balloon.open(coordinates, {
        content: `<div class="location">${location}</div>` + `<hr>` +
            `<div class="existingReviewsList">
        ${await getReadyReviewsForm(currentPlacemarks, getReviewOfPlacemark) || `<h4>no fucking reviews</h4>`}
        </div> 
        ` + popupForm,
        close: false,
    })

    const existingReviewsList = document.querySelector('.existingReviewsList');

    const addBtn = document.querySelector('#add-btn');

    addBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const getAuthor = document.querySelector('.author');
        const getPlace = document.querySelector('.place');
        const getReview = document.querySelector('.review');
        const timestamp = format(new Date(), 'PPp');

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

        localStorage.reviews = JSON.stringify([...getLocalStorageReview(), review])

        getReadyReviewsForm(currentPlacemarks, getReviewOfPlacemark).then(() => {
            const warning = document.querySelector('h4');
            warning?.remove();
            const reviewForNewPlacemark = document.createElement('div');
            reviewForNewPlacemark.classList.add('existingReviewItem');
            let form = createReviewForm(review.author, review.place, review.reviewText, review.timestamp);
            reviewForNewPlacemark.innerHTML = form;
            existingReviewsList.append(reviewForNewPlacemark);
        })
        addPlacemarksOnMap(map);
    })
}

ymaps.ready(mapInit);

module.exports = mapInit;
