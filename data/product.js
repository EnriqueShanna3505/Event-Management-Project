import { formatCurrency } from '../scripts/utils/money.js';

export function getProduct(eventProductId) {
  let matchingEventProduct;

  eventProducts.forEach((eventProduct) => {
    if (eventProduct.id === eventProductId && !matchingEventProduct) {
      matchingEventProduct = eventProduct;
    }
  });
  return matchingEventProduct;
}

class EventProduct {
  id;
  image;
  name;
  participant;
  priceCents;

  constructor(productDetails) {
    this.id = productDetails.id;
    this.image = productDetails.image;
    this.name = productDetails.name;
    this.participant = productDetails.participant;
    this.priceCents = productDetails.priceCents;
    this.keywords = productDetails.keywords;
    this.type = productDetails.type;
  }

  getPrice() {
    return `RM ${formatCurrency(this.priceCents)}`;
  }
}

export let eventProducts = [];

export function loadProductsFetch() {
  const promise = fetch(
    'https://event-management-project-pg6t.onrender.com/events'
  )
    .then((response) => {
      return response.json();
    })
    .then((eventsData) => {
      eventProducts = eventsData.map((productDetails) => {
        return new EventProduct(productDetails);
      });

      console.log('load products');
    })
    .catch(() => {
      console.log('Unexpected error.');
    });

  return promise;
}

/*
loadProductsFetch().then(() => {
  console.log('next step');
});
*/
export function loadProducts(fun) {
  const xhr = new XMLHttpRequest();

  xhr.addEventListener('load', () => {
    eventProducts = JSON.parse(xhr.response).map((productDetails) => {
      return new EventProduct(productDetails);
    });
    console.log('load products');
    fun();
  });

  xhr.addEventListener('error', () => {
    console.log('Unexpected error.');
  }); //Error Handling

  xhr.open('GET', 'https://event-management-project-pg6t.onrender.com/events');
  xhr.send();
}

/*
export const eventProducts = [
  {
    id: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
    image: 'images/flyers/event1.jpeg',
    name: 'Basketball Club',
    participant: 87,
    priceCents: 1090,
    keywords: ['basketballs'],
    type: 'sports,',
  },
  {
    id: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
    image: 'images/flyers/event2.jpeg',
    name: 'Music Festival Club',
    participant: 127,
    priceCents: 2050,
    keywords: ['festival'],
    type: 'music',
  },
  {
    id: '83d4ca15-0f35-48f5-b7a3-1ea210004f2e',
    image: 'images/flyers/event3.jpeg',
    name: 'Music Event',
    participant: 56,
    priceCents: 799,
    keywords: ['festival'],
    type: 'music',
  },
  {
    id: '54e0eccd-8f36-462b-b68a-8182611d9add',
    image: 'images/flyers/event4.jpeg',
    name: 'Business Club ',
    participant: 20,
    priceCents: 1899,
    keywords: ['business'],
    type: 'education',
  },
  {
    id: '3ebe75dc-64d2-4137-8860-1f5a963e534b',
    image: 'images/flyers/event5.jpeg',
    name: 'Church Event',
    participant: 38,
    priceCents: 2067,
    keywords: ['spiritual'],
    type: 'religion',
  },
  {
    id: '8c9c52b5-5a19-4bcb-a5d1-158a74287c53',
    image: 'images/flyers/event6.jpeg',
    name: 'Tech Meeting',
    participant: 100,
    priceCents: 3499,
    keywords: ['technology', 'AI'],
    type: 'education',
  },
  {
    id: 'dd82ca78-a18b-4e2a-9250-31e67412f98d',
    image: 'images/flyers/event7.jpeg',
    name: 'Summer Night Club',
    participant: 100,
    priceCents: 2400,
    keywords: ['festival'],
    type: 'music',
  },
  {
    id: '77919bbe-0e56-475b-adde-4f24dfed3a04',
    image: 'images/flyers/event8.jpeg',
    name: 'Musical Event',
    participant: 55,
    priceCents: 3599,
    keywords: ['festival'],
    type: 'music',
  },
  {
    id: '3fdfe8d6-9a15-4979-b459-585b0d0545b9',
    image: 'images/flyers/event9.jpeg',
    name: 'Annual Club',
    participant: 57,
    priceCents: 2899,
    keywords: ['knowledge'],
    type: 'education',
  },
  {
    id: '58b4fc92-e98c-42aa-8c55-b6b79996769a',
    image: 'images/flyers/event10.jpeg',
    name: 'College Sports Meet',
    participant: 30,
    priceCents: 3390,
    keywords: ['sporty'],
    type: 'sports',
  },
  {
    id: '5968897c-4d27-4872-89f6-5bcb052746d7',
    image: 'images/flyers/event11.jpeg',
    name: 'College Fair',
    participant: 40,
    priceCents: 2070,
    keywords: ['knowledge'],
    type: 'education',
  },
  {
    id: 'aad29d11-ea98-41ee-9285-b916638cac4a',
    image: 'images/flyers/event12.jpeg',
    name: 'College Fair Second',
    participant: 30,
    priceCents: 1560,
    keywords: ['knowledge'],
    type: 'education',
  },
  {
    id: '04701903-bc79-49c6-bc11-1af7e3651358',
    image: 'images/flyers/event13.jpeg',
    name: 'Badminton Club',
    participant: 27,
    priceCents: 2499,
    keywords: ['sporty'],
    type: 'sport',
  },
  {
    id: '901eb2ca-386d-432e-82f0-6fb1ee7bf969',
    image: 'images/flyers/event16 flyer.png',
    name: 'Jazz Club',
    participant: 21,
    priceCents: 4599,
    keywords: ['music'],
    type: 'art',
  },
  {
    id: '82bb68d7-ebc9-476a-989c-c78a40ee5cd9',
    image: 'images/flyers/event15.jpeg',
    name: 'Volleyball Club',
    participant: 25,
    priceCents: 1699,
    keywords: ['sporty'],
    type: 'sport',
  },
  {
    id: 'c2a82c5e-aff4-435f-9975-517cfaba2ece',
    image: 'images/flyers/event16.png',
    name: 'Night Jazz Music',
    participant: 30,
    priceCents: 3074,
    keywords: ['festival'],
    type: 'music',
  },
  {
    id: '6b07d4e7-f540-454e-8a1e-363f25dbae7d',
    image: 'images/flyers/event17.jpeg',
    name: 'Ballet Club',
    participant: 50,
    priceCents: 2374,
    keywords: ['sporty', 'musical'],
    type: 'sport',
  },
  {
    id: 'a82c6bac-3067-4e68-a5ba-d827ac0be010',
    image: 'images/flyers/event18.png',
    name: 'Running Club',
    participant: 200,
    priceCents: 2200,
    keywords: ['sporty'],
    type: 'sport',
  },
  {
    id: 'e4f64a65-1377-42bc-89a5-e572d19252e2',
    image: 'images/flyers/event19.jpeg',
    name: 'Chess Club',
    participant: 50,
    priceCents: 1799,
    keywords: ['sporty'],
    type: 'sport',
  },
  {
    id: 'b0f17cc5-8b40-4ca5-9142-b61fe3d98c85',
    image: 'images/flyers/event20.jpeg',
    name: 'Chef Club',
    participant: 40,
    priceCents: 1374,
    keywords: ['food'],
    type: 'education',
  },
].map((productDetails) => {
  return new EventProduct(productDetails);
});
*/
