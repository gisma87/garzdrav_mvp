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

const delCartItems = () => {
  return {
    type: 'DEL_CART_ITEM'
  }
}

const setCartItems = (cartItems) => {
  return {
    type: 'SET_CART_ITEMS',
    payload: cartItems
  }
}

const fetchCartItems = () => {
  return (dispatch, getState) => {
    const {cart, isCity} = getState()
    dispatch(delCartItems())

    if (cart.length > 0) {
      dispatch(loadingTrue())
      const arrFetch = cart.map(product => {
        return axios.get(`http://172.16.17.7:5000/Products/byGuid?productGuid=${product.itemId}&cityGuid=${isCity.guid}`)
      })

      Promise.all([
        ...arrFetch
      ]).then(allResponses => {
        const cartItems = allResponses.map(item => item.data)
        dispatch(setCartItems(cartItems))
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

const onSelectRetail = (id) => {
  return {
    type: 'ON_SELECT_RETAIL',
    payload: id
  }
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
  fetchCartItems,
  onSelectRetail
}