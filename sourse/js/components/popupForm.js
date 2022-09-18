const popupForm = `

<form id="add-form" class="form">
  <div class="location">Location</div>
  <hr>
  <div class="form-row">
    <h4 class="existing-reviews">no reviews for this place</h4>
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