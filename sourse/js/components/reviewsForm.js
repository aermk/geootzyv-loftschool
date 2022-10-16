function createReviewForm(author, place, text, time) {
    return `
    <div class="existingReviewItem">
    <div class="existingReviewItem-author-place">
        <b>${author}</b> <i>${place}</i> ${time}</div>
    <div class="existingReviewItem-text">${text}</div>
</div>
`
}

module.exports = createReviewForm;