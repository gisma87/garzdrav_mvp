import axios from "axios";
import apiServise from "../service/StoreService";

const setError = (error) => {
  return {
    type: 'FETCH_FAILURE',
    payload: error
  }
}

const setIsCity = (isCity) => {
  return {
    type: 'SET_CITY',
    payload: isCity
  }
}

// запрос списка городов
const fetchCities = () => async dispatch => {
  try {
    dispatch(loadingTrue())
    const response = await axios.get('http://172.16.17.7:5000/Cities')
    dispatch({type: 'FETCH_CITIES_SUCCESS', payload: response.data})


    apiServise.getUserCity()
      .then(({city, ip}) => {
        console.log(city, ip);

        const cityItem = response.data.find(item => city === item.title)
        dispatch(setIsCity(cityItem))

      })
      .catch(err => {
        console.log(err);
      });


  } catch (e) {
    dispatch(setError(e))
  }
}

// Список торговых точек в городе
const fetchRetailsCity = (cityId) => async dispatch => {
  try {
    dispatch(loadingTrue())
    const response = await axios.get(`http://172.16.17.7:5000/Retails/${cityId}`)
    dispatch({type: 'FETCH_RETAILS_CITY_SUCCESS', payload: response.data})
  } catch (e) {
    dispatch(setError(e))
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

// серия запросов подробной информации о товаре из списка корзины - по IDproduct и IDcity.
// Формируется массив cartItems - список товаров со списком аптек в нём, где этот товар есть.
// Из массива cartItems формируется массив retailsArr - список аптек, со списком товаров из корзины имеющихся в этой аптеке.
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
      }).catch(allError => {
        console.log(allError)
        dispatch(setError((allError)))
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

const onSelectRetail = (id) => {
  return {
    type: 'ON_SELECT_RETAIL',
    payload: id
  }
}

const clearCart = () => {
  localStorage.removeItem("cart")
  return {
    type: 'CLEAR_CART'
  }
}

export {
  clearCart,
  setError,
  fetchCities,
  setIsCity,
  retailsCityLoaded,
  addedToCart,
  itemRemovedFromCart,
  allItemRemovedFromCart,
  rewriteCart,
  addedToFavorits,
  loadingTrue,
  ProductsFromSearchLoaded,
  fetchProductInfo,
  fetchCartItems,
  onSelectRetail,
  fetchRetailsCity
}