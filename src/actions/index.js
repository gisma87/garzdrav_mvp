import axios from "axios";
import apiService from "../service/ApiService";


const URL = apiService.URL

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
const fetchCartItems = (city = null) => (dispatch, getState, apiService) => {
  const {cart, isCity} = getState()
  const cityId = city || isCity.guid
  dispatch(delCartItems())

  if (cart.length > 0) {
    dispatch(loadingTrue())
    const arrFetch = cart.map(product => {
      return apiService.getProductInfo(product.itemId, cityId)
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
    const response = await axios.get(`${URL}/Cities`)
    dispatch({type: 'FETCH_CITIES_SUCCESS', payload: response.data})
    dispatch(loadingTrue())
    // если в localStorage есть город - устанавливаем его
    if (localStorage.getItem("city")) {
      const cityItem = JSON.parse(localStorage.getItem("city"))[0]
      dispatch(setIsCity(cityItem))
    } else {
      // иначе определяем город по IP, устанавливаем его и открываем popup подтверждения выбранного города
      apiService.getUserCity()
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
    const response = await axios.get(`${URL}/Retails/${cityId}`)
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
  return async (dispatch, getState, apiService) => {
    dispatch(loadingTrue())
    try {
      const response = await apiService.getProductInfo(productId, cityId)
      dispatch(loadingProductInfo(response.data))
      // apiService.buildCatalog()
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

// запрос информации о пользователе по TOKEN из LocalStorage
const fetchUserData = (accessToken = JSON.parse(localStorage.getItem('TOKEN')).accessToken) => async (dispatch) => {
  dispatch(loadingTrue())
  try {
    const response = await axios.get(`${URL}/Users`, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    })
    dispatch({type: 'USER_DATA', payload: response.data})
  } catch (e) {

  }
}

// POST запрос refreshTOKEN
const refreshAuthentication = () => async (dispatch) => {
  dispatch(loadingTrue())
  try {
    const response = await axios.post(`${URL}/Authentication/refresh`,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        accessToken: JSON.parse(localStorage.getItem("TOKEN")).accessToken,
        refreshToken: JSON.parse(localStorage.getItem("TOKEN")).refreshToken
      })
    dispatch({type: 'TOKEN', payload: response.data})
    localStorage.setItem('TOKEN', JSON.stringify(response.data))
    console.log('refresh_TOKEN')
  } catch (e) {
    dispatch(setError(e))
    dispatch(logout())
  }
}

// POST запрос TOKEN
const authentication = () => async (dispatch) => {
  dispatch(loadingTrue())
  try {
    const response = await axios.post(`${URL}/Authentication`,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        phone: "9131996226",
        password: "password"
      })
    dispatch({type: 'TOKEN', payload: response.data})
    localStorage.setItem('TOKEN', JSON.stringify(response.data))
    console.log('access_TOKEN')
    dispatch(fetchUserData(response.data.accessToken))

    // const response = async () => await fetch(`${URL}/Authentication`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     "phone": "9131996226",
    //     "password": "password"
    //   })
    // })
    //
    // response()
    //   .then(response => response.json())
    //   .then(result => {
    //     console.log("AUTHENTICATION ", result)
    //     dispatch({type: 'TOKEN', payload: result})
    //   })
  } catch (e) {
    dispatch(setError(e))
  }
}


function logout() {
  localStorage.removeItem("TOKEN")
  return {
    type: 'LOGOUT'
  }
}

const setCatalog = () => async (dispatch, getState, apiService) => {
  dispatch(loadingTrue())
  try {
    const response = await apiService.buildCatalog()
    dispatch({
      type: 'SET_CATALOG',
      payload: response
  })
  } catch (e) {
    dispatch(setError(e))
  }
}


export {
  setCatalog,
  logout,
  fetchUserData,
  refreshAuthentication,
  authentication,
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