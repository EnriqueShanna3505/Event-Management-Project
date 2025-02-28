import { renderOrderSummary } from './checkout/orderSummary.js';
import { renderPaymentSummary } from './checkout/paymentSummary.js';
import { loadProducts, loadProductsFetch } from '../data/product.js';
import '../data/eventcart-class.js';
import { loadCart } from '../data/eventcart.js';

async function loadPage() {
  //async returns a promise
  try {
    // throw 'error1';
    await loadProductsFetch();

    const value = await new Promise((resolve, reject) => {
      // throw 'error2';
      loadCart(() => {
        //reject('error3');
        resolve('value3');
      });
    });
  } catch (error) {
    console.log('error');
  }

  renderOrderSummary();
  renderPaymentSummary();
}

loadPage();

/*
Promise.all([
  loadProductsFetch(),
  new Promise((resolve) => {
    loadProducts(() => {
      resolve();
    });
  }),
  new Promise((resolve) => {
    loadCart(() => {
      resolve();
    });
  }),
]).then((values) => {
  console.log(values);
  renderOrderSummary();
  renderPaymentSummary();
});
*/

/*
new Promise((resolve) => {
  loadProducts(() => {
    resolve('value1');
  });
})
  .then((value) => {
    console.log(value);
    return new Promise((resolve) => {
      loadCart(() => {
        resolve();
      });
    });
  })
  .then(() => {
    renderOrderSummary();
    renderPaymentSummary();
  });
  */

/*
loadProducts(() => {
  loadCart(() => {
    renderOrderSummary();
    renderPaymentSummary();
  });
});
*/
