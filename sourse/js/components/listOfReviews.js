const createReviewForm = require('./reviewsForm');

function getLocalStorageReview() {
    const reviews = localStorage.reviews;
    return JSON.parse(reviews || "[]");
}

function getReadyReviewsForm(currentGeoObject) {

    let reviewListHTML = '';

    const reviews = getLocalStorageReview();

    for (const review of reviews) {
        let form = createReviewForm(review.author, review.place, review.reviewText, review.timestamp);
        const isSimilarCoords = currentGeoObject.some((geoObject) => JSON.stringify(geoObject.geometry._coordinates) === JSON.stringify(review.coordinates));

        if (isSimilarCoords) {
            reviewListHTML += form;
        }
    }
    return reviewListHTML; //возвращаем блок со списком ревью
}

exports.getLocalStorageReview = getLocalStorageReview;
exports.getReadyReviewsForm = getReadyReviewsForm;

