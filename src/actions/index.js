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
const loadingTrue = (info) => {
  const INFO = typeof info === 'string' ? info : 'loading'
  return {
    type: 'LOADING',
    payload: INFO
  }
}

const loadingFalse = (info) => {
  const INFO = typeof info === 'string' ? info : 'loading'
  return {
    type: 'LOADING_OFF',
    payload: INFO
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
  dispatch(clearError())
  dispatch(delCartItems())

  if (cart.length > 0) {
    dispatch(loadingTrue('fetchCartItems'))
    const arrFetch = cart.map(product => {
      return apiService.getProductInfo(product.itemId, cityId)
    })
    Promise.all([...arrFetch])
      .then(allResponses => dispatch(setCartItems(allResponses)))
      .catch(allError => dispatch(setError(allError)))
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
  dispatch(loadingTrue('setIsCity'))
  const item = [isCity]
  console.log('Город: ', item);
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
const fetchCities = () => async (dispatch, getState, apiService) => {
  try {
    dispatch(loadingTrue('fetchCities'))
    const response = await apiService.getCities()
    dispatch({type: 'FETCH_CITIES_SUCCESS', payload: response})

    // если в localStorage есть город - устанавливаем его
    if (localStorage.getItem("city")) {
      const cityItem = JSON.parse(localStorage.getItem("city"))[0]
      dispatch(setIsCity(cityItem))
    } else {

      // иначе определяем город по IP, устанавливаем его и открываем popup подтверждения выбранного города
      dispatch(loadingTrue('apiService.getUserCity'))
      const {city, ip} = await apiService.getUserCity()
      console.log(city, ip);
      const cityItem = response.find(item => city === item.title)
      dispatch(setIsCity(cityItem))
      dispatch(onPopupLocation(true))
    }
  } catch (e) {
    dispatch(setError(e))
  }
}

// Список торговых точек в городе
const fetchRetailsCity = () => async (dispatch, getState, apiService) => {
  try {
    const cityId = getState().isCity.guid
    dispatch(loadingTrue('fetchRetailsCity'))
    const response = await apiService.getRetailsCity(cityId)
    dispatch({type: 'FETCH_RETAILS_CITY_SUCCESS', payload: response})
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
const ProductsFromSearchLoaded = (products, productSearch) => {
  products.productSearch = productSearch
  return {
    type: 'FETCH_PRODUCTS_FROM_SEARCH_SUCCESS',
    payload: products
  }
}

// поисковый запрос порционно с указанием количества элементов и страницы
function getProductsFromSearchLimit(options) {
  return async (dispatch, getState, apiService) => {
    const productName = options.productName === 'undefined' ? null : options.productName
    const parameters = {
      productName: productName,
      cityId: getState().isCity.guid,
      quantity: options.quantity || 32,
      page: options.page || 1,
      order: options.order || null,
      categoryId: options.categoryId || null
    }
    dispatch(loadingTrue('getProductsFromSearchLimit'))
    try {
      const response = await apiService.getProducts(parameters)
      dispatch(ProductsFromSearchLoaded(response, productName || ''))
    } catch (e) {
      dispatch(setError(e))
    }
  }
}

// дополнительная(подробная) информация о продукте
const fetchProductInfo = (productId, cityId) => {
  return async (dispatch, getState, apiService) => {
    dispatch(loadingTrue('fetchProductInfo'))
    try {
      const response = await apiService.getProductInfo(productId, cityId)
      dispatch(loadingProductInfo(response))
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
const fetchUserData = () => async (dispatch, getState, apiService) => {
  const accessToken = getState().TOKEN.accessToken || JSON.parse(localStorage.getItem('TOKEN')).accessToken
  dispatch(loadingTrue('fetchUserData'))
  try {
    const response = await apiService.getUserData(accessToken)
    dispatch({type: 'USER_DATA', payload: response})
  } catch (e) {
    dispatch(setError(e))
  }
}

// POST запрос refreshTOKEN
const refreshAuthentication = () => async (dispatch, getState, apiService) => {
  const TOKEN = getState().TOKEN || JSON.parse(localStorage.getItem('TOKEN'))
  dispatch(loadingTrue('refreshAuthentication'))
  try {
    const response = await apiService.refreshToken(TOKEN)
    dispatch({type: 'TOKEN', payload: response})
    localStorage.setItem('TOKEN', JSON.stringify(response))
    console.log('refresh_TOKEN')
  } catch (e) {
    dispatch(setError(e))
    dispatch(logout())
  }
}

// POST запрос TOKEN
const authentication = () => async (dispatch, getState, apiService) => {
  dispatch(loadingTrue('authentication'))
  try {
    const response = await apiService.authentication()
    dispatch({type: 'TOKEN', payload: response})
    localStorage.setItem('TOKEN', JSON.stringify(response))
    console.log('access_TOKEN')
    dispatch(fetchUserData(response.accessToken))
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
  dispatch(loadingTrue('setCatalog'))
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

function setActiveCategory(categoryItem) {
  return {
    type: 'SET_ACTIVE_CATEGORY',
    payload: categoryItem
  }
}

// запрос товаров по категории для каталога
const setProductsToCategory = (options) => async (dispatch, getState, apiService) => {
  dispatch(loadingTrue('setProductsToCategory'))
  try {
    const parameters = {
      productName: options.productName || null,
      cityId: getState().isCity.guid,
      quantity: options.quantity || 32,
      page: options.page || 1,
      order: options.order || null,
      categoryId: options.categoryId || null
    }

    const response = await apiService.getProducts(parameters)
    dispatch({
      type: 'SET_PRODUCTS_TO_CATEGORY',
      payload: response
    })
  } catch (e) {
    dispatch(setError(e))
  }
}

const setSales = () => async (dispatch, getState, apiService) => {
  dispatch(loadingTrue('setSales'))
  try {
    const response = await apiService.getSales(getState().TOKEN.accessToken)
    dispatch({
      type: 'SET_SALES',
      payload: response
    })
  } catch (e) {
    dispatch(setError(e))
  }
}

// true, когда происходит запрос от панели поиска - для сброса страниц на первую в Cards
const onRequestFromSearchPanel = () => {
  return {type: 'ON_REQUEST_FROM_SEARCH_PANEL'}
}
const offRequestFromSearchPanel = () => {
  return {type: 'OFF_REQUEST_FROM_SEARCH_PANEL'}
}

// запрос истории интернет заказов
const getInternetSales = () => async (dispatch, getState, apiService) => {
  dispatch(loadingTrue('getInternetSales'))
  try {
    const response = await apiService.getOrder(getState().TOKEN.accessToken)
    dispatch({
      type: 'REQUEST_INTERNET_SALES',
      payload: response
    })
  } catch (e) {
    dispatch(setError(e))
  }
}

// отмена заказа
const cancelOrder = (orderGuid) => async (dispatch, getState, apiService) => {
  dispatch(loadingTrue('cancelOrder'))
  try {
    const response = await apiService.cancelOrder(orderGuid, getState().TOKEN.accessToken)
    dispatch({
      type: 'CANCEL_ORDER',
      payload: response
    })
  } catch (e) {
    dispatch(setError(e))
  }
}


export {
  cancelOrder,
  getInternetSales,
  onRequestFromSearchPanel,
  offRequestFromSearchPanel,
  setSales,
  setProductsToCategory,
  setActiveCategory,
  setCatalog,
  logout,
  fetchUserData,
  refreshAuthentication,
  authentication,
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
  loadingFalse,
  ProductsFromSearchLoaded,
  fetchProductInfo,
  fetchCartItems,
  onSelectRetail,
  fetchRetailsCity,
  getProductsFromSearchLimit
}