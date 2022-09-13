const popupForm = `

<form id="add-form" class="form">
  <h3 class="form-title">Leave your feedback</h3>
  <div class="form-row">
    <input type="text" placeholder="Your name" name="author" class="form-input">
  </div>
  <div class="form-row">
    <input type="text" placeholder="Place" name="place" class="form-input">
  </div>
  <div class="form-row">
    <textarea placeholder="Your feedback" name="review" class="form-input form-input--textarea"></textarea>
  </div>

  <div class="btn-footer">
    <button id="add-btn" class="btn">Add</button>
  </div>

</form>
`
module.exports = popupForm;