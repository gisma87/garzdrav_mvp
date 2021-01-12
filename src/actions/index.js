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

// статус запроса о повторе заказа для Alert
const setStatusRequestOrder = (status) => {
  const result = typeof status === "string" ? status : ''
  return {
    type: 'SET_STATUS_REQUEST_REPEAT_ORDER',
    payload: result
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
      .then(allResponses => {
        const responseArray = allResponses.filter(item => Boolean(item.length !== 0))
        if (responseArray.length) {
          const resultArr = responseArray.map(item => {
            const retails = item.retails.map(retailItem => {
              return {
                countLast: retailItem.countLast,
                priceRetail: retailItem.priceRetail,
                brand: retailItem.retail.brand,
                buildNumber: retailItem.retail.buildNumber,
                city: retailItem.retail.city,
                coordinates: retailItem.retail.coordinates,
                guid: retailItem.retail.guid,
                phone: retailItem.retail.phone,
                street: retailItem.retail.street,
                title: retailItem.retail.title,
                weekDayTime: retailItem.retail.weekDayTime
              }
            })
            return {
              ...item,
              retails
            }
          })

          // нужный ФОРМАТ ДАННЫХ
          // [{
          //    guid: string,
          //    product: string,
          //    manufacturer: string,
          //    categoryGuid: string,
          //    categoryTitle: string,
          //    retails: [{
          //      countLast: number,
          //      priceRetail: number,
          //      brand: string,
          //      buildNumber: string,
          //      city: string,
          //      coordinates: [56.034496, 92.884345],
          //      guid: string,
          //      phone: string,
          //      street: string,
          //      title: string,
          //      weekDayTime: "09:00:00 - 18:00:00",
          //    }]
          // }]
          dispatch(setCartItems(resultArr))
        }
      })
      .catch(allError => dispatch(setError(allError)))
  }
}

// повторить заказ - серия запросов подробной инф. о товаре, если res.ok тогда добавляем в корзину
const repeatOrder = (arrayProducts) => (dispatch, getState, apiService) => {
  const {isCity} = getState()
  dispatch(clearError())
  dispatch(delCartItems())

  if (arrayProducts.length > 0) {
    dispatch(loadingTrue('repeatOrder'))
    const arrFetch = arrayProducts.map(product => {
      return apiService.getProductInfo(product.idProduct, isCity.guid)
    })
    Promise.all([...arrFetch])
      .then(allResponses => {
        const responseArray = allResponses.filter(item => Boolean(item.length !== 0))
        if (responseArray.length) {
          const resultArr = responseArray.map(item => {
            const retails = item.retails.map(retailItem => {
              return {
                countLast: retailItem.countLast,
                priceRetail: retailItem.priceRetail,
                brand: retailItem.retail.brand,
                buildNumber: retailItem.retail.buildNumber,
                city: retailItem.retail.city,
                coordinates: retailItem.retail.coordinates,
                guid: retailItem.retail.guid,
                phone: retailItem.retail.phone,
                street: retailItem.retail.street,
                title: retailItem.retail.title,
                weekDayTime: retailItem.retail.weekDayTime
              }
            })
            return {
              ...item,
              retails
            }
          })

          // нужный ФОРМАТ ДАННЫХ
          // [{
          //    guid: string,
          //    product: string,
          //    manufacturer: string,
          //    categoryGuid: string,
          //    categoryTitle: string,
          //    retails: [{
          //      countLast: number,
          //      priceRetail: number,
          //      brand: string,
          //      buildNumber: string,
          //      city: string,
          //      coordinates: [56.034496, 92.884345],
          //      guid: string,
          //      phone: string,
          //      street: string,
          //      title: string,
          //      weekDayTime: "09:00:00 - 18:00:00",
          //    }]
          // }]

          resultArr.forEach(item => {
            const index = arrayProducts.findIndex(el => el.idProduct === item.guid)
            if (index >= 0) {
              const count = arrayProducts[index].count
              for (let i = 0; i < count; i++) {
                dispatch(addedToCart(item.guid))
              }
            }
          })

          dispatch(setStatusRequestOrder('executed'))
        } else dispatch(setStatusRequestOrder('failure'))
      })
      .catch(allError => dispatch(setError(allError)))
    dispatch(loadingFalse('repeatOrder'))
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

const setCountItemCart = (idProduct, delta) => {
  return {
    type: 'SET_COUNT_ITEM_CART',
    payload: {idProduct, delta}
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

// устанавливаем доп.инфу о товаре - который смотрим на страницу CardPage
const loadingProductInfo = (product) => {
  return {
    type: 'LOADING_PRODUCT_INFO',
    product
  }
}

// дополнительная(подробная) информация о продукте
const fetchProductInfo = (productId) => {
  return async (dispatch, getState, apiService) => {
    dispatch(loadingTrue('fetchProductInfo'))
    try {
      const response = await apiService.getProductInfo(productId, getState().isCity.guid)
      // нужный ФОРМАТ ДАННЫХ - response должен быть:
      // {
      //    guid: string,
      //    product: string,
      //    manufacturer: string,
      //    categoryGuid: string,
      //    categoryTitle: string,
      //    retails: [{
      //      countLast: number,
      //      priceRetail: number,
      //      brand: string,
      //      buildNumber: string,
      //      city: string,
      //      coordinates: [56.034496, 92.884345],
      //      guid: string,
      //      phone: string,
      //      street: string,
      //      title: string,
      //      weekDayTime: "09:00:00 - 18:00:00",
      //    }]
      // }

      const retails = response.retails.map(retailItem => {
        return {
          countLast: retailItem.countLast,
          priceRetail: retailItem.priceRetail,
          brand: retailItem.retail.brand,
          buildNumber: retailItem.retail.buildNumber,
          city: retailItem.retail.city,
          coordinates: retailItem.retail.coordinates,
          guid: retailItem.retail.guid,
          phone: retailItem.retail.phone,
          street: retailItem.retail.street,
          title: retailItem.retail.title,
          weekDayTime: retailItem.retail.weekDayTime
        }
      })
      const resultProduct = {
        ...response,
        retails
      }
      dispatch(loadingProductInfo(resultProduct))
    } catch (e) {
      dispatch(setError(e))
    }
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
    dispatch(getToFavorites())
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
    dispatch(getToFavorites())
  } catch (e) {
    dispatch(setError(e))
    dispatch(logout())
  }
}

// POST запрос TOKEN
const authentication = (phone, password) => async (dispatch, getState, apiService) => {
  dispatch(loadingTrue('authentication'))
  try {
    const response = await apiService.authentication(phone, password)
    dispatch({type: 'TOKEN', payload: response})
    localStorage.setItem('TOKEN', JSON.stringify(response))
    console.log('access_TOKEN')
    dispatch(fetchUserData(response.accessToken))
  } catch (e) {
    dispatch(setError(e))
  }
}

// авторизация по паролю или СМС
const authorizedByPassOrSMS = (phone, passOrSms) => async (dispatch, getState, apiService) => {
  dispatch(loadingTrue('authorizedByPassOrSMS'))
  apiService.authentication(phone, passOrSms)
    .then(response => {
      dispatch({type: 'TOKEN', payload: response})
      localStorage.setItem('TOKEN', JSON.stringify(response))
      console.log('access_TOKEN')
      dispatch(fetchUserData(response.accessToken))
    })
    .catch(err => {
      if (err.response) {
        // client received an error response (5xx, 4xx)
        console.log('err.response: ', err.response)
        apiService.postSmsCode(phone, passOrSms)
          .then(response => {
            dispatch({type: 'TOKEN', payload: response})
            localStorage.setItem('TOKEN', JSON.stringify(response))
            console.log('access_TOKEN')
            dispatch(fetchUserData(response.accessToken))
          })
          .catch(err => {
            if (err.response) {
              // client received an error response (5xx, 4xx)
              console.log('err.response: ', err.response)
            } else if (err.request) {
              // client never received a response, or request never left
              console.log('err.request ', err.request)
            } else {
              // anything else
              console.log('ошибка запроса')
            }
          })
      } else if (err.request) {
        // client never received a response, or request never left
        console.log('err.request ', err.request)
      } else {
        // anything else
        console.log('ошибка запроса')
      }
    })
  dispatch(loadingFalse('authorizedByPassOrSMS - вручную'))
}

// записываем избранное в store
const setFavoritesToStore = (favoritesObject) => {
  return {
    type: 'SET_FAVORITES_TO_STORE',
    payload: favoritesObject
  }
}

// добавляем элемент favorites в store
function addFavoritesToStore(favoritesElement) {
  return {
    type: 'ADD_FAVORITES_TO_STORE',
    payload: favoritesElement
  }
}

// удаляем элемент favorites из store
function delFavoritesToStore(favoritesElement) {
  return {
    type: 'DELETE_FAVORITES_TO_STORE',
    payload: favoritesElement
  }
}

function getToFavorites() {
  return async (dispatch, getState, apiService) => {
    try {
      const response = await apiService.getToFavorites(getState().TOKEN.accessToken)
      dispatch(setFavoritesToStore(response))
    } catch (e) {
      dispatch(setError(e))
    }
  }
}

function addToFavorites(productGuid) {
  return async (dispatch, getState, apiService) => {
    try {
      const response = await apiService.addToFavorites(getState().TOKEN.accessToken, productGuid)
      dispatch(addFavoritesToStore(response))
    } catch (e) {
      dispatch(setError(e))
    }
  }
}

function delToFavorites(productGuid) {
  return async (dispatch, getState, apiService) => {
    try {
      const response = await apiService.delToFavorites(getState().TOKEN.accessToken, productGuid)
      if (response === 200) {
        dispatch(delFavoritesToStore(productGuid))
      }
    } catch (e) {
      dispatch(setError(e))
    }
  }
}

function logout() {
  localStorage.removeItem("TOKEN")
  return {
    type: 'LOGOUT'
  }
}

function setActiveCategory(categoryItem) {
  return {
    type: 'SET_ACTIVE_CATEGORY',
    payload: categoryItem
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
    dispatch(setActiveCategory(response))
  } catch (e) {
    dispatch(setError(e))
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
  delToFavorites,
  addToFavorites,
  authorizedByPassOrSMS,
  setStatusRequestOrder,
  setCountItemCart,
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
  loadingTrue,
  loadingFalse,
  ProductsFromSearchLoaded,
  fetchProductInfo,
  fetchCartItems,
  onSelectRetail,
  fetchRetailsCity,
  getProductsFromSearchLimit,
  repeatOrder
}