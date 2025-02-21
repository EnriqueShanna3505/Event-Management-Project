//Here we're using module
import { eventCart } from '../data/eventcart.js';
import { eventProducts } from '../data/product.js';

let eventCartSummaryHTML = '';

eventCart.forEach((eventItem) => {
  const eventProductId = eventItem.eventProductId;

  let matchingEventProduct;

  eventProducts.forEach((eventProduct) => {
    if (eventProduct.id === eventProductId) {
      matchingEventProduct = eventProduct;
    }
  });

  eventCartSummaryHTML += `
       <div class="event-cart-item-container">
                    <div class="commence-date">
                        Commence date: Tuesday, June 21
                    </div>

                    <div class="event-cart-item-details-grid">
                        <img src="${
                          matchingEventProduct.image
                        }" alt="" class="event-product-image">
                    </div>

                    <div class="event-cart-item-details">
                        <div class="event-product-name">
                           ${matchingEventProduct.name}
                        </div>

                        <div class="event-product-price">
                            RM ${matchingEventProduct.priceCents / 100}
                        </div>
                        
                        <div class="event-participant-quantity">
                            <span>
                                Participant: <span class="quantity-label">${
                                  eventItem.participant
                                }</span>
                            </span>

                            <span class="update-participant-quantity-link link-primary" >
                                Update
                            </span>  
                            <span class="delete-participant-quantity-link link-primary" >
                                Delete
                            </span>  
                        </div>
                    </div>

                    <div class="session-options">
                        <div class="session-options-title">
                            Choose your session:
                        </div>
                        <div class="session-option">
                            <input type="radio" checked
                              class="session-option-input"
                              name="session-option-1">
                            <div>
                              <div class="session-option-date">
                                Tuesday, June 21
                              </div>
                              <div class="session-option-price">
                                FREE Shipping
                              </div>
                            </div>
                          </div>
                        
                          <div class="session-option">
                            <input type="radio" checked
                              class="session-option-input"
                              name="session-option-1">
                            <div>
                              <div class="session-option-date">
                                Wednesday, June 22
                              </div>
                              <div class="session-option-price">
                                RM 4.99 - Second Session
                              </div>
                            </div>
                          </div>

                          <div class="session-option">
                            <input type="radio" checked
                              class="session-option-input"
                              name="session-option-1">
                            <div>
                              <div class="session-option-date">
                                Thursday, June 23
                              </div>
                              <div class="session-option-price">
                                RM 10.00
                              </div>
                            </div>
                          </div>
                </div>
            </div>
            `;
});

document.querySelector('.js-event-order-summary').innerHTML =
  eventCartSummaryHTML;

console.log(eventCartSummaryHTML);
console.log('Event Cart:', eventCart);
