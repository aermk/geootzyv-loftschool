const popupForm = require('./popupForm');

let map;

function openModalWindow(coordinates) {
    return new Promise((resolve) => {
        resolve(
            map.balloon.open(coordinates, {
                content: popupForm,
            })
        );
    });
    // map.balloon.open(coordinates, { // добавить await - дождаться, пока этот кусок кода выполнится,
    //     // и затем продолжить выполнение внутри этой функции (вместо промиса)
    //     content: popupForm,
    // });
}

function mapInit() {
    map = new ymaps.Map('map', {
        center: [61.78900090727265, 34.375410146877094],
        zoom: 15,
    });

    map.events.add('click', (e) => {

        const coordinates = e.get('coords');
        openModalWindow(coordinates).then(() => {
            const addBtn = document.querySelector('#add-btn');

            addBtn.addEventListener('click', (e) => {
                e.preventDefault();
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
