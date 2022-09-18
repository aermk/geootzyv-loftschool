const popupForm = require('./popupForm');

let map;

function openModalWindow(coordinates) {
    return new Promise((resolve) => {
        resolve(
            map.balloon.open(coordinates, {
                content: popupForm,
            }),
        );
    });
    // map.balloon.open(coordinates, { // добавить await - дождаться, пока этот кусок кода выполнится,
    //     // и затем продолжить выполнение внутри этой функции (вместо промиса)
    //     content: popupForm,
    // });
}

function getAddress(coords) {
    return new Promise((resolve) => {
        ymaps.geocode(coords).then(function (res) {
            const firstGeoObject = res.geoObjects.get(0);
            let = adress = firstGeoObject.getAddressLine();
            resolve(adress);
        })
    });
}

let storage = localStorage;
console.log(storage, 'storage')

function mapInit() {
    map = new ymaps.Map('map', {
        center: [61.78900090727265, 34.375410146877094],
        zoom: 15,
    });

    map.events.add('click', (e) => {

        const coordinates = e.get('coords');

        openModalWindow(coordinates).then(() => {
            const addBtn = document.querySelector('#add-btn');

            getAddress(coordinates).then((adress) => {
                const locationDiv = document.querySelector('.location');
                locationDiv.innerHTML = adress;
            });

            const getAuthor = document.querySelector('.author');
            const getPlace = document.querySelector('.place');
            const getReview = document.querySelector('.review');

            addBtn.addEventListener('click', (e) => {
                e.preventDefault();

                console.log(getAuthor.value, getPlace.value, getReview.value, 'данные формы')

                storage.data = JSON.stringify({ // добавление в сторэдж
                    authorName: getAuthor.value,
                    place: getPlace.value,
                    review: getReview.value,
                })

                map.geoObjects.add(new ymaps.Placemark(coordinates, {
                    balloonContent: 'fix: Сюда тоже добавить форму'
                }, {
                    preset: 'islands#dotIcon',
                    iconColor: '#E8AA4DFF'
                }))
                map.balloon.close();
            })
        });
    });

}

ymaps.ready(mapInit);

module.exports = mapInit;
