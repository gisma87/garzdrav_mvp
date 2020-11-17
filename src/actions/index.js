import axios from "axios";

const pillsLoaded = (cities) => {
  return {
    type: 'FETCH_CITIES_SUCCESS',
    payload: cities
  }
}

const pillsRequested = () => {
  return {
    type: 'FETCH_CITIES_REQUESTED'
  }
}

const pillsError = (error) => {
  return {
    type: 'FETCH_CITIES_FAILURE',
    payload: error
  }
}

const setIsCity = (isCity) => {
  return {
    type: 'SET_CITY',
    payload: isCity
  }
}

const addedToCart = (ItemId) => {
  return {
    type: 'ITEM_ADDED_TO_CART',
    payload: ItemId
  }
}

const itemRemovedFromCart = (ItemId) => {
  return {
    type: 'ITEM_REMOVED_FROM_CART',
    payload: ItemId
  }
}

const allItemRemovedFromCart = (ItemId) => {
  return {
    type: 'ALL_ITEM_REMOVED_FROM_CART',
    payload: ItemId
  }
}

const retailsCityLoaded = (retailsCity) => {
  return {
    type: 'FETCH_RETAILS_CITY_SUCCESS',
    payload: retailsCity
  }
}

const rewriteCart = (cart) => {
  return {
    type: 'REWRITE_CART',
    payload: cart
  }
}

const addedToFavorits = (item) => {
  return {
    type: 'ADDED_TO_FAVORITS',
    payload: item
  }
}

// const fetchRetailsCity = (storeService, dispatch, cityId) => () => {
//   // console.log('я в ACTIONS')
//   storeService.getRetailsCity(cityId)
//     .then((data) => dispatch(retailsCityLoaded(data)))
//     .catch((error) => console.log('ОШИБКА в fetchRetailsCity ', error));
// }

const fetchCities = (storeService, dispatch) => () => {
  dispatch(pillsRequested());
  storeService.getCities()
    .then((data) => dispatch(pillsLoaded(data)))
    .catch((error) => dispatch(pillsError(error)));
}


//запрос ProductsFromSearch
const loadingTrue = () => {
  return {
    type: 'LOADING'
  }
}

const ProductsFromSearchLoaded = (products) => {
  return {
    type: 'FETCH_PRODUCTS_FROM_SEARCH_SUCCESS',
    payload: products
  }
}

const fetchProductInfo = (productId, cityId) => {
  return async dispatch => {
    dispatch(loadingTrue())
    try {
      const response = await axios.get(`http://172.16.17.7:5000/Products/byGuid?productGuid=${productId}&cityGuid=${cityId}`)

      dispatch(loadingProductInfo(response.data))
    } catch (e) {
      console.log(e)
    }
  }
}

const setCartItem = (product) => {
  return {
    type: 'SET_CART_ITEM',
    product
  }
}

const fetchCartItem = (productId) => {
  return async (dispatch, getState) => {
    dispatch(loadingTrue())
    const {isCity, cartItems} = getState()
    try {
      const response = await axios.get(`http://172.16.17.7:5000/Products/byGuid?productGuid=${productId}&cityGuid=${isCity.guid}`)
      // const index = cartItems.findIndex((item) => item.guid === response.data.guid)
      // let data;
      // index >= 0 ? data = cartItems : data = [...cartItems, response.data];
      dispatch(setCartItem(response.data))
    } catch (e) {
      console.log(e)
    }
  }
}
const fetchCartItems = () => {
  return (dispatch, getState) => {
    const {cart} = getState()

    if (cart.length > 0) {
      cart.forEach(product => {
        dispatch(fetchCartItem(product.itemId))
      })
    }
  }
}

const loadingProductInfo = (product) => {
  return {
    type: 'LOADING_PRODUCT_INFO',
    product
  }
}

const fetchProductsFromSearch = (storeService, dispatch) => () => {
  dispatch(loadingTrue());
  storeService.getProductsFromSearch()
    .then((data) => dispatch(ProductsFromSearchLoaded(data)))
    .catch((error) => console.log(error));
}

export {
  fetchCities,
  setIsCity,
  retailsCityLoaded,
  addedToCart,
  itemRemovedFromCart,
  allItemRemovedFromCart,
  rewriteCart,
  addedToFavorits,
  fetchProductsFromSearch,
  loadingTrue,
  ProductsFromSearchLoaded,
  fetchProductInfo,
  fetchCartItems
}