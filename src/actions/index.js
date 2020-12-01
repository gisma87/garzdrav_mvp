import axios from "axios";
import apiServise from "../service/StoreService";

// ставим ошибку
const setError = (error) => {
  return {
    type: 'FETCH_FAILURE',
    payload: error
  }
}

//  очищаем ошибку
const clearError = () => {
  return {
    type: 'CLEAR_ERROR'
  }
}

// ставим загрузку
const loadingTrue = () => {
  return {
    type: 'LOADING'
  }
}

// очищаем массив CartItems
const delCartItems = () => {
  return {
    type: 'DEL_CART_ITEM'
  }
}


// собираем массивы cartItems и retailsArr
const setCartItems = (cartItems) => {
  return {
    type: 'SET_CART_ITEMS',
    payload: cartItems
  }
}

// серия запросов подробной информации о товаре из списка корзины - по IDproduct и IDcity.
// Формируется массив cartItems - список товаров со списком аптек в нём, где этот товар есть.
// Из массива cartItems формируется массив retailsArr - список аптек, со списком товаров из корзины имеющихся в этой аптеке.
const fetchCartItems = (city = null) => (dispatch, getState) => {
  const {cart, isCity} = getState()
  dispatch(delCartItems())

  if (cart.length > 0) {
    dispatch(loadingTrue())
    const arrFetch = cart.map(product => {
      return axios.get(`http://172.16.17.7:5000/Products/byGuid?productGuid=${product.itemId}&cityGuid=${city || isCity.guid}`)
    })
    Promise.all([
      ...arrFetch
    ]).then(allResponses => {
      const cartItems = allResponses.map(item => item.data)
      dispatch(setCartItems(cartItems))
    }).catch(allError => {
      dispatch(setError((allError)))
    })
  }
}

// открывает/закрывает popup подтверждения города
const onPopupLocation = (boolean) => {
  return {
    type: 'ON_POPUP_LOCATION',
    payload: boolean
  }
}


// устанавливает объект текущего города и записывает его в LocalStorage
const setIsCity = (isCity) => (dispatch) => {
  dispatch(loadingTrue())
  const item = [isCity]
  console.log(item);
  localStorage.setItem("city", JSON.stringify(item))
  // устанавливаем город
  dispatch({
    type: 'SET_CITY',
    payload: isCity
  })
  // запрашиваем инф. о товарах в корзине по новому городу
  dispatch(fetchCartItems(isCity.guid))
}

// запрос списка городов
const fetchCities = () => async dispatch => {
  try {
    dispatch(loadingTrue())
    const response = await axios.get('http://172.16.17.7:5000/Cities')
    dispatch({type: 'FETCH_CITIES_SUCCESS', payload: response.data})
    dispatch(loadingTrue())
    // если в localStorage есть город - устанавливаем его
    if (localStorage.getItem("city")) {
      const cityItem = JSON.parse(localStorage.getItem("city"))[0]
      dispatch(setIsCity(cityItem))
    } else {
      // иначе определяем город по IP, устанавливаем его и открываем popup подтверждения выбранного города
      apiServise.getUserCity()
        .then(({city, ip}) => {
          console.log(city, ip);
          const cityItem = response.data.find(item => city === item.title)
          dispatch(setIsCity(cityItem))
          dispatch(onPopupLocation(true))
        })
        .catch(err => {
          console.log(err);
        });
    }
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

// все аптеки города
const retailsCityLoaded = (retailsCity) => {
  return {
    type: 'FETCH_RETAILS_CITY_SUCCESS',
    payload: retailsCity
  }
}

// перезаписываем корзину - обычно из значения localStorage
const rewriteCart = (cart) => {
  return {
    type: 'REWRITE_CART',
    payload: cart
  }
}

const addedToFavorits = (item) => {
  return {
    type: 'ADDED_TO_FAVORITES',
    payload: item
  }
}

// список позиций из поискового запроса
const ProductsFromSearchLoaded = (products) => {
  return {
    type: 'FETCH_PRODUCTS_FROM_SEARCH_SUCCESS',
    payload: products
  }
}

// дополнительная(подробная) информация о продукте
const fetchProductInfo = (productId, cityId) => {
  return async dispatch => {
    dispatch(loadingTrue())
    try {
      const response = await axios.get(`http://172.16.17.7:5000/Products/byGuid?productGuid=${productId}&cityGuid=${cityId}`)

      dispatch(loadingProductInfo(response.data))
    } catch (e) {
      dispatch(setError(e))
    }
  }
}

// устанавливаем доп.инфу о товаре - который смотрим на страницу CardPage
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
  clearError,
  onPopupLocation,
  setCartItems,
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