import { renderOrderSummary } from './checkout/orderSummary.js';
import { renderPaymentSummary } from './checkout/paymentSummary.js';
import { loadProducts } from '../data/product.js';
import '../data/eventcart-class.js';

loadProducts(() => {
  renderOrderSummary();
  renderPaymentSummary();
});
