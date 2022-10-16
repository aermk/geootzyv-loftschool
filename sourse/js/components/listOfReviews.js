const createReviewForm = require('./reviewsForm');

function getLocalStorageReview() { // получаем список ревью
    const reviews = localStorage.reviews // создаем массив в локал сторе
    return JSON.parse(reviews || "[]") // возвращаем массив ревью или пустой массив
}

async function getReadyReviewsForm(currentGeoObjects) { // принимает массив с объектами?

    let reviewListHTML = '';
    const reviews = getLocalStorageReview();

    const currentReviewsList = document.querySelector('.currentReviewsList');
    console.log(currentReviewsList, 'currentReviewsList')

    for (const review of reviews) { // идем по каждому ревью из сторэджа
        let form = createReviewForm(review.author, review.place, review.reviewText, review.timestamp);
        if (currentGeoObjects.some((geoObject) => JSON.stringify(geoObject.geometry._coordinates) === JSON.stringify(review.coordinates))) {
            reviewListHTML += form;
        }
    }
    return reviewListHTML; //возвращаем блок со списком ревью
}

exports.getLocalStorageReview = getLocalStorageReview;
exports.getReadyReviewsForm = getReadyReviewsForm;
