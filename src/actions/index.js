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
  dispatch(clearError())
  dispatch(delCartItems())

  if (cart.length > 0) {
    dispatch(loadingTrue())
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
  dispatch(loadingTrue())
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
    dispatch(loadingTrue())
    const response = await apiService.getCities()
    dispatch({type: 'FETCH_CITIES_SUCCESS', payload: response})
    dispatch(loadingTrue())

    // если в localStorage есть город - устанавливаем его
    if (localStorage.getItem("city")) {
      const cityItem = JSON.parse(localStorage.getItem("city"))[0]
      dispatch(setIsCity(cityItem))
    } else {

      // иначе определяем город по IP, устанавливаем его и открываем popup подтверждения выбранного города
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
    dispatch(loadingTrue())
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
function getProductsFromSearchLimit(productSearch, quantity, page, methodSort) {
  console.log('methodSort', methodSort)
  return async (dispatch, getState, apiService) => {
    const cityId = getState().isCity.guid
    dispatch(loadingTrue())
    try {
      const response = await apiService.getProductsFromSearchLimit(productSearch, cityId, quantity, page, methodSort)
      dispatch(ProductsFromSearchLoaded(response, productSearch))
    } catch (e) {
      dispatch(setError(e))
    }
  }
}


// дополнительная(подробная) информация о продукте
const fetchProductInfo = (productId, cityId) => {
  return async (dispatch, getState, apiService) => {
    dispatch(loadingTrue())
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
  dispatch(loadingTrue())
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
  dispatch(loadingTrue())
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
  dispatch(loadingTrue())
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

function setActiveCategory(categoryItem) {
  return {
    type: 'SET_ACTIVE_CATEGORY',
    payload: categoryItem
  }
}

const setProductsToCategory = (categoryId) => async (dispatch, getState, apiService) => {
  dispatch(loadingTrue())
  try {
    const response = await apiService.getProductToCategory(getState().isCity.guid, categoryId)
    dispatch({
      type: 'SET_PRODUCTS_TO_CATEGORY',
      payload: response
    })
  } catch (e) {
    dispatch(setError(e))
  }
}

const setSales = () => async (dispatch, getState, apiService) => {
  dispatch(loadingTrue())
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


export {
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
  ProductsFromSearchLoaded,
  fetchProductInfo,
  fetchCartItems,
  onSelectRetail,
  fetchRetailsCity,
  getProductsFromSearchLimit
}