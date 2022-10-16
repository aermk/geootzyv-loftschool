import { format } from 'date-fns'
const popupForm = require('./popupForm');
const createReviewForm = require('./reviewsForm');
const { getReadyReviewsForm, getLocalStorageReview } = require('./listOfReviews');

let map;
let clusterer;

function mapInit() {
    map = new ymaps.Map('map', {
        center: [61.78900090727265, 34.375410146877094],
        zoom: 17,
    });

    map.events.add('click', (e) => {
        const coordinates = e.get('coords');
        openModalWindow(map, coordinates);
    });

    var customItemContentLayout = ymaps.templateLayoutFactory.createClass(
        '<h2 class=ballon_header>{{ properties.balloonContentHeader|raw }}</h2>' +
        '<a href="" class=ballon_adressLink>{{ properties.balloonContentBody_adressLink|raw }}</a>' +
        '<div class=ballon_body>{{ properties.balloonContentBody|raw }}</div>' +
        '<h5 class=ballon_footer>{{ properties.balloonContentFooter|raw }}</h5>'
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

    clusterer.events.add('balloonopen', (event) => { // по клику на кластер ДОДЕЛАТЬ
        const adressLink = document.querySelector('.ballon_adressLink');
        // let getPlacemarksInCluster = event.get('target').getGeoObjects(); // следующая строчка 
        // не отрабатывает, если создать getPlacemarksInCluster
        console.log(adressLink, 'adressLink');

        adressLink.addEventListener('click', (e) => {
            // не работает с getPlacemarksInCluster
            e.preventDefault();
            console.log('here')
        })
    })
}

function addPlacemarksOnMap(map) { // приходит карта

    const reviewsList = getLocalStorageReview();

    const listOfCoordinates = [];

    for (const review of reviewsList) { //проходим по каждому ревью в списке, если он есть
        // создаем метку по координатам ревью

        const placemark = new ymaps.Placemark(review.coordinates,
            {
                balloonContentHeader: review.place,
                balloonContentBody: review.reviewText,
                balloonContentBody_adressLink: review.location,
                balloonContentFooter: review.timestamp
            },
            {
                preset: 'islands#dotIcon',
                iconColor: '#E8AA4DFF'
            })


        placemark.events.add('click', e => { // по клику на метку
            placemark.options.set('hasBalloon', false)
            e.stopPropagation();

            const adress = getAddress(e.get('coords'))

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

        getReadyReviewsForm(currentPlacemarks).then(() => {
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
