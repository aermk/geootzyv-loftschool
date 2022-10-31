const createReviewForm = require('./reviewsForm');

function getLocalStorageReview() { // получаем список ревью
    const reviews = localStorage.reviews // создаем массив в локал сторе
    return JSON.parse(reviews || "[]") // возвращаем массив ревью или пустой массив
}

async function getReadyReviewsForm(currentGeoObject, dateOfCluster) { // принимает текущий объект на карте, данные кластера

    let reviewListHTML = '';

    if ((Object.keys(dateOfCluster).length === 0 || dateOfCluster === undefined) && currentGeoObject.length === 0) {
        return; // абсолютно новая метка
    } else if (dateOfCluster && currentGeoObject.length === 0) { // одиночная метка или клик по ссылке
        let form = createReviewForm(dateOfCluster.author, dateOfCluster.place, dateOfCluster.reviewText, dateOfCluster.timestamp);
        reviewListHTML += form;
        return reviewListHTML;
    }

    const reviews = getLocalStorageReview();

    for (const review of reviews) { // идем по каждому ревью из сторэджа
        let form = createReviewForm(review.author, review.place, review.reviewText, review.timestamp);
        const isSimilarCoords = currentGeoObject.some((geoObject) => {
            return JSON.stringify(geoObject.geometry._coordinates) === JSON.stringify(review.coordinates);
        })

        if (isSimilarCoords) {
            reviewListHTML += form;
        }
    }
    return reviewListHTML; //возвращаем блок со списком ревью
}

exports.getLocalStorageReview = getLocalStorageReview;
exports.getReadyReviewsForm = getReadyReviewsForm;

