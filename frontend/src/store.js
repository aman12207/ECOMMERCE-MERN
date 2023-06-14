import { applyMiddleware, combineReducers, createStore } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension';
import { productDetailsReducer, productsReducer } from './reducers/productReducer';
import { profileReducer, userReducer,forgotPasswordReducer } from './reducers/userReducer';
import { cartReducer } from './reducers/cartReducer';

const reducer = combineReducers({
  products : productsReducer,
  productDetails : productDetailsReducer,
  user : userReducer,
  profile : profileReducer,
  forgotPassword : forgotPasswordReducer,
  cart: cartReducer,
  // newOrder: newOrderReducer,
  // myOrders: myOrdersReducer,
  // orderDetails: orderDetailsReducer,
  // newReview: newReviewReducer,
  // newProduct: newProductReducer,
  // product: productReducer,
  // allOrders: allOrdersReducer,
  // order: orderReducer,
  // allUsers: allUsersReducer,
  // userDetails: userDetailsReducer,
  // productReviews: productReviewsReducer,
  // review: reviewReducer,
});

let initialState = {
  cart: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    shippingInfo: localStorage.getItem("shippingInfo")
      ? JSON.parse(localStorage.getItem("shippingInfo"))
      : {},
  },

};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
)

export default store;