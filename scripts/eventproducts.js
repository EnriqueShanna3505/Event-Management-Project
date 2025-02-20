/* So in this JS, i wanted to generate the html that
I created, instead of me doing it one by one which took
a lot of time and not ideal. 

The steps are I need to save the data, generate the html, then,
make it interactive. */

let eventProductsHTML = '';

eventProducts.forEach((eventProduct) => {
  eventProductsHTML += `<div class="event-product-container">
          <div class="event-product-image-container">
            <img src="${eventProduct.image}" alt="" class="event-product-image">
          </div>

          <div class="event-product-name limit-text-to-2-lines">
          ${eventProduct.name}
          </div>

          <div class="event-product-participant-container">
            <div class="event-product-participant-count link-primary">
              <a href="#" class="participant-link">
                <span class="participant-counter">Participants: ${
                  eventProduct.participant
                }</span>
              </a>
            </div>
          </div>

          <div class="event-product-price">
           RM ${(eventProduct.priceCents / 100).toFixed(2)}
          </div>

          <div class="event-product-participant-quantity-container">
            <select class="js-quantity-selector" data-event-product-id ="${
              eventProduct.id
            }">
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>

          <div class="event-product-spacer"></div>

          <div class="added-to-event-cart">
            <img src="images/icons/checkmark.png">
            Added
          </div>

          <button class="add-to-event-cart-button button-primary js-add-to-event-cart" 
          data-event-product-id="${eventProduct.id}">
            Add to Calendar
          </button>

        </div>
    `;
});
//Generate html with js, take objects from products.js
document.querySelector('.js-event-products-grid').innerHTML = eventProductsHTML;

//Make Participant Selection Interactive

document.querySelectorAll('.js-quantity-selector').forEach((selectElement) => {
  selectElement.addEventListener('change', function () {
    const eventProductId = this.dataset.eventProductId;

    let matchingProduct;

    eventProducts.forEach((product) => {
      if (eventProductId === product.id) {
        matchingProduct = product;
      }
    });

    if (matchingProduct) {
      matchingProduct.participant = Number(this.value);

      let participantCounter = this.closest(
        '.event-product-container'
      ).querySelector('.participant-counter');
      participantCounter.innerHTML = `Participants: ${matchingProduct.participant}`;
    }
  });
});

//Make add to event cart button interactive
document.querySelectorAll('.js-add-to-event-cart').forEach((button) => {
  button.addEventListener('click', () => {
    const eventProductId = button.dataset.eventProductId;

    let matchingItem;

    eventCart.forEach((item) => {
      if (eventProductId === item.eventProductId) {
        matchingItem = item;
      }
    });

    if (!matchingItem) {
      eventCart.push({
        eventProductId: eventProductId,
        quantity: 1,
      });

      // Change button to indicate it's added
      button.innerHTML = 'Added to Calendar';
      button.disabled = true; // Prevent multiple clicks
    }

    //Make Calendar Quantity Interactive
    let calendarQuantity = 0;

    eventCart.forEach((item) => {
      calendarQuantity += item.quantity;
    });

    document.querySelector('.js-calendar-quantity').innerHTML =
      calendarQuantity;
  });
});
