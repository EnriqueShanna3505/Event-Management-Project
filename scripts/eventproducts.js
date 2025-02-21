/* So in this JS, i wanted to generate the html that
I created, instead of me doing it one by one which took
a lot of time and not ideal. 

The steps are I need to save the data, generate the html, then,
make it interactive. */

import { eventProducts } from '../data/product.js';
import { eventCart, addToEventCart } from '../data/eventcart.js';
import { formatCurrency } from './utils/money.js';

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
           RM ${formatCurrency(eventProduct.priceCents)}
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

function participantCounter(eventProductId, selectElement) {
  //Make Participant Selection Interactive
  let matchingProduct;

  eventProducts.forEach((product) => {
    if (eventProductId === product.id) {
      matchingProduct = product;
    }
  });

  if (matchingProduct) {
    matchingProduct.participant = Number(selectElement.value);

    let participantCounter = selectElement
      .closest('.event-product-container')
      .querySelector('.participant-counter');
    participantCounter.innerHTML = `Participants: ${matchingProduct.participant}`;
  }
}

document.querySelectorAll('.js-quantity-selector').forEach((selectElement) => {
  selectElement.addEventListener('change', function () {
    const eventProductId = this.dataset.eventProductId;
    participantCounter(eventProductId, this);
  });
});

function updateEventCartQuantity() {
  //Make Calendar Quantity Interactive
  let calendarQuantity = 0;

  eventCart.forEach((eventCartItem) => {
    calendarQuantity += eventCartItem.quantity;
  });

  document.querySelector('.js-calendar-quantity').innerHTML = calendarQuantity;
}

//Make add to event cart button interactive
document.querySelectorAll('.js-add-to-event-cart').forEach((button) => {
  button.addEventListener('click', () => {
    const eventProductId = button.dataset.eventProductId;
    addToEventCart(eventProductId, button);
    updateEventCartQuantity();
  });
});
