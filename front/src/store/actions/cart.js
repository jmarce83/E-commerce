import axios from 'axios';

import store from '../index'
import { ADD_CART, DEL_CART, INC_CART, DEC_CART, GET_CART, EMPTY_CART } from "../constants";

const addToCart = book => ({
  type: ADD_CART,
  book
});

const delFromCart = id => ({
  type: DEL_CART,
  id
});

const incrementarCart = id => ({
  type: INC_CART,
  id
});

const decrementarCart = id => ({
  type: DEC_CART,
  id
});

const fetchCart = cart => ({
  type: GET_CART,
  cart
})

const destroyCart = () => ({
  type: EMPTY_CART
})


export const getCart = (userId, refreshedCart = null) => dispatch => {
  if(refreshedCart) return dispatch(fetchCart(refreshedCart))
  if(!userId) return undefined
  axios.get(`/api/carts/${userId}`)
  .then((cart) =>{ 
  return dispatch(fetchCart(cart.data))})
};

export const addCart = (book, userId) => dispatch => {
  if(userId){
    axios.post('/api/carts', { bookId: book.id, userId})
  }
  return dispatch(addToCart(book));
};

export const delCart = (id, userId) => dispatch => {
  if(userId){
    axios.patch('/api/carts', { bookId: id, userId, operacion: 'eliminar'})
  }
  return dispatch(delFromCart(id));
};

export const incCart = (id, userId) => dispatch => {
  if(userId){
    axios.patch('/api/carts', { bookId: id, userId, operacion: 'sumar'})
  }
  return dispatch(incrementarCart(id));
};

export const decCart = (id, userId) => dispatch => {
  if(userId){
    axios.patch('/api/carts', {bookId: id, userId, operacion: 'restar'})
  }
  return dispatch(decrementarCart(id));
};

export const emptyCart = (justState = false) => dispatch => {
  if(justState){ return dispatch(destroyCart())}
  axios.delete(`/api/carts/`)
  .then(res => {
    dispatch(destroyCart())
  })
}

export const syncCart = () => dispatch => {
    const cart = store.getState();
    return axios.put('/api/carts', cart.cart)
    .then((userCart) => dispatch(getCart(0, userCart.data)))

}
