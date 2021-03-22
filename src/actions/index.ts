import {promoItemsData} from "../testData/promoItemsData";
import {seasonPromoItems} from "../testData/seasonPromoItems";
import {popularPromoItems} from "../testData/popularPromoItems";

import {
    Action_fetchRetailsCity,
    Action_setProductsToCategory,
    Action_setSales,
    ActionAddedToCart,
    ActionAddFavoritesToStore,
    ActionAllItemRemovedFromCart,
    ActionClearCart,
    ActionClearError,
    ActionDelCartItems,
    ActionDelFavoritesToStore,
    ActionItemRemovedFromCart,
    ActionLoadingFavorites,
    ActionLoadingProductInfo,
    ActionLoadingTrue,
    ActionLogout,
    ActionOffRequestFromSearchPanel,
    ActionOnPopupLocation,
    ActionOnRequestFromSearchPanel,
    ActionOnSelectRetail,
    ActionProductsFromSearchLoaded,
    ActionResetLoading,
    ActionRewriteCart,
    ActionSetActiveCategory,
    ActionSetCountItemCart,
    ActionSetError,
    ActionSetFavoritesToStore,
    ActionSetPromoItems,
    ActionSetStatusRequestOrder,
    ActionSetToken,
    ActionSetUserData,
    ActionsSetErrorAuth,
    ActionStatusRequestRepeatOrder
} from "./actionType";

import {
    ActionTypes,
    CartItemType,
    internetSale,
    ObjType,
    productInfo,
    retailCity,
    tCatalog,
    TypeApiService,
    TypeSetCartItem,
} from "../types";
import {AnyAction} from "redux";
import {StateType} from "../store";
import {ThunkAction} from "redux-thunk";

type ThunkType = ThunkAction<any, StateType, TypeApiService, AnyAction>

const setError = (error: any): ActionSetError => {
    return {
        type: ActionTypes.FETCH_FAILURE,
        payload: error
    }
}

const setErrorAuth = (error: any): ActionsSetErrorAuth => {
    return {
        type: ActionTypes.AUTH_FAILURE,
        payload: error
    }
}

//  очищаем ошибку
const clearError = (): ActionClearError => {
    return {
        type: ActionTypes.CLEAR_ERROR
    }
}

// ставим загрузку
const loadingTrue = (): ActionLoadingTrue => {
    return {
        type: ActionTypes.LOADING,
    }
}

const loadingFalse = () => {
    return {
        type: ActionTypes.LOADING_OFF
    }
}

const loadingReset = (): ActionResetLoading => {
    return {
        type: ActionTypes.LOADING_RESET
    }
}

// очищаем массив CartItems
const delCartItems = (): ActionDelCartItems => {
    return {
        type: ActionTypes.DEL_CART_ITEM
    }
}


// собираем массивы cartItems и retailsArr
const setCartItems = (cartItems: TypeSetCartItem[]): ActionSetStatusRequestOrder => {
    return {
        type: ActionTypes.SET_CART_ITEMS,
        payload: cartItems
    }
}

// статус запроса о повторе заказа для Alert
const setStatusRequestOrder = (status: 'executed' | 'failure' | ''): ActionStatusRequestRepeatOrder => {
    return {
        type: ActionTypes.SET_STATUS_REQUEST_REPEAT_ORDER,
        payload: status
    }
}

// серия запросов подробной информации о товаре из списка корзины - по IDproduct и IDcity.
// Формируется массив cartItems - список товаров со списком аптек в нём, где этот товар есть.
// Из массива cartItems формируется массив retailsArr - список аптек, со списком товаров из корзины имеющихся в этой аптеке.
const fetchCartItems = (city: string | null = null): ThunkType => (dispatch, getState, apiService) => {
    const {cart, isCity} = getState()
    const cityId = city || isCity.guid
    dispatch(clearError())
    dispatch(delCartItems())

    if (cart.length > 0) {
        dispatch(loadingTrue())
        const arrFetch = cart.map((product: CartItemType) => {
            return apiService.getProductInfo(product.itemId, cityId)
        })
        Promise.allSettled([...arrFetch])
            .then(allResponses => {
                const fulfilledArray = allResponses.filter(item => item.status === 'fulfilled').map(item => (item as { value: TypeSetCartItem }).value)
                const responseArray = fulfilledArray.filter(item => Boolean(item.length !== 0))
                if (responseArray.length) {
                    dispatch(setCartItems(responseArray))
                }
            })
            .catch(error => {
                dispatch(setError(error))
            })
            .finally(() => dispatch(loadingFalse()))
    }
}

// повторить заказ - серия запросов подробной инф. о товаре, если res.ok тогда добавляем в корзину
const repeatOrder = (arrayProducts: { idProduct: string, count: number }[]): ThunkType => (dispatch, getState, apiService) => {
    const {isCity} = getState()
    dispatch(clearError())
    dispatch(delCartItems())

    if (arrayProducts.length > 0) {
        dispatch(loadingTrue())
        const arrFetch = arrayProducts.map(product => {
            return apiService.getProductInfo(product.idProduct, isCity.guid)
        })
        Promise.all([...arrFetch])
            .then(allResponses => {
                const responseArray = allResponses.filter(item => Boolean(item.length !== 0))
                if (responseArray.length) {
                    responseArray.forEach(item => {
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
        dispatch(loadingFalse())
    }
}

// открывает/закрывает popup подтверждения города
const onPopupLocation = (boolean: boolean): ActionOnPopupLocation => {
    return {
        type: ActionTypes.ON_POPUP_LOCATION,
        payload: boolean
    }
}

const _setCity = (isCity: { guid: string, title: string, [key: string]: any }) => {
    return {
        type: ActionTypes.SET_CITY,
        payload: isCity
    }
}


// устанавливает объект текущего города и записывает его в LocalStorage
const setIsCity = (isCity: { guid: string, title: string, [key: string]: any }): ThunkType => (dispatch) => {
    dispatch(loadingTrue())
    const item = [isCity]
    localStorage.setItem("city", JSON.stringify(item))
    // устанавливаем город
    dispatch(_setCity(isCity))
    // запрашиваем инф. о товарах в корзине по новому городу
    dispatch(fetchCartItems(isCity.guid))
}

// запрос списка городов
const fetchCities = (): ThunkType => async (dispatch, getState, apiService) => {
    try {
        dispatch(loadingTrue())
        const response = await apiService.getCities()
        dispatch({type: 'FETCH_CITIES_SUCCESS', payload: response})

        // если в localStorage есть город - устанавливаем его
        if (localStorage.getItem("city")) {
            const cityItem = JSON.parse(<string>localStorage.getItem("city"))[0]
            dispatch(setIsCity(cityItem))
        } else {

            // иначе определяем город по IP, устанавливаем его и открываем popup подтверждения выбранного города
            apiService.getUserCity()
                .then(res => {
                    const {city} = res;
                    const cityItem = response.find((item: { title: string; }) => city === item.title)
                    dispatch(setIsCity(cityItem))
                    dispatch(onPopupLocation(true))
                })
                .catch(e => {
                    // если что-то не получилось, всё равно открываем popup выбора города.
                    dispatch(onPopupLocation(true))
                })
        }
    } catch (e) {
        dispatch(setError(e))
    }
}


// записываем все аптеки города
const _fetchRetailsCity = (payload: retailCity[]): Action_fetchRetailsCity => {
    return {type: ActionTypes.FETCH_RETAILS_CITY_SUCCESS, payload}
}

// Список торговых точек в городе
const fetchRetailsCity = (): ThunkType => async (dispatch, getState, apiService) => {
    try {
        const cityId = getState().isCity.guid
        dispatch(loadingTrue())
        const response = await apiService.getRetailsCity(cityId)
        dispatch(_fetchRetailsCity(response))
    } catch (e) {
        dispatch(setError(e))
    }
}

const addedToCart = (ItemId: string): ActionAddedToCart => {
    return {
        type: ActionTypes.ITEM_ADDED_TO_CART,
        payload: ItemId
    }
}

// уменьшает count объекта с ItemId на 1.
const itemRemovedFromCart = (ItemId: string): ActionItemRemovedFromCart => {
    return {
        type: ActionTypes.ITEM_REMOVED_FROM_CART,
        payload: ItemId
    }
}

// уменьшает count объекта с ItemId на count - т.е. обнуляет, и объект удаляется из cart.
const allItemRemovedFromCart = (ItemId: string): ActionAllItemRemovedFromCart => {
    return {
        type: ActionTypes.ITEM_REMOVED_FROM_CART,
        payload: ItemId
    }
}

const setCountItemCart = (idProduct: string, delta: number): ActionSetCountItemCart => {
    return {
        type: ActionTypes.SET_COUNT_ITEM_CART,
        payload: {idProduct, delta}
    }
}

// перезаписываем корзину - обычно из значения localStorage
const rewriteCart = (cart: CartItemType[]): ActionRewriteCart => {
    return {
        type: ActionTypes.REWRITE_CART,
        payload: cart
    }
}

// список позиций из поискового запроса
const _productsFromSearchLoaded = (
    products: { products: { guid: string, product: string, [key: string]: string | number }[], count: null | number },
    productSearch: string
): ActionProductsFromSearchLoaded => {
    const result = {...products, productSearch}
    return {
        type: ActionTypes.FETCH_PRODUCTS_FROM_SEARCH_SUCCESS,
        payload: result
    }
}

// поисковый запрос порционно с указанием количества элементов и страницы
function getProductsFromSearchLimit(options: {
    productName?: string,
    quantity?: number
    page?: number,
    order?: string,
    categoryId?: string | number
}): ThunkType {
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
        dispatch(loadingTrue())
        try {
            const response = await apiService.getProducts(parameters)
            dispatch(_productsFromSearchLoaded(response, productName || ''))
        } catch (e) {
            dispatch(setError(e))
        }
    }
}

// устанавливаем доп.инфу о товаре - который смотрим на страницу CardPage
const loadingProductInfo = (product: productInfo): ActionLoadingProductInfo => {
    return {
        type: ActionTypes.LOADING_PRODUCT_INFO,
        payload: product
    }
}

// дополнительная(подробная) информация о продукте
const fetchProductInfo = (productId: string): ThunkType => {
    return async (dispatch, getState, apiService) => {
        dispatch(loadingTrue())
        try {
            const response = await apiService.getProductInfo(productId, getState().isCity.guid)
            dispatch(loadingProductInfo(response))
        } catch (e) {
            dispatch(setError(e))
        }
    }
}

const onSelectRetail = (id: string): ActionOnSelectRetail => {
    return {
        type: ActionTypes.ON_SELECT_RETAIL,
        payload: id
    }
}

const clearCart = (): ActionClearCart => {
    localStorage.removeItem("cart")
    return {
        type: ActionTypes.CLEAR_CART
    }
}

const setToken = (token: { accessToken: string, refreshToken: string }): ActionSetToken => {
    localStorage.setItem('TOKEN', JSON.stringify(token))
    return {
        type: ActionTypes.TOKEN,
        payload: token
    }
}

// POST запрос refreshTOKEN
const refreshAuthentication = (): ThunkType => async (dispatch, getState, apiService) => {
    const TOKEN = getState().TOKEN || JSON.parse(<string>localStorage.getItem('TOKEN'))
    dispatch(loadingTrue())
    try {
        const response = await apiService.refreshToken(TOKEN)
        dispatch(setToken(response))
        dispatch(getDataProfile())
        dispatch(getToFavorites())
        return Promise.resolve(response)
    } catch (e) {
        console.log(e)
        dispatch(logout())
    }
}

// POST запрос TOKEN
const authentication = (phone: string, password: string): ThunkType => async (dispatch, getState, apiService) => {
    dispatch(loadingTrue())
    try {
        const response = await apiService.authentication(phone, password)
        dispatch(setToken(response))
        console.log('access_TOKEN')
    } catch (e) {
        console.log(e)
        dispatch(setError(e))
    }
}

// авторизация по паролю или СМС
const authorizedByPassOrSMS = (phone: string, passOrSms: string, callback: null | (() => void) = null): ThunkType => async (dispatch, getState, apiService) => {
    dispatch(loadingTrue())
    apiService.authentication(phone, passOrSms)
        .then(response => {
            dispatch({type: 'TOKEN', payload: response})
            localStorage.setItem('TOKEN', JSON.stringify(response))
            console.log('access_TOKEN')
            dispatch(getToFavorites())
            dispatch(getDataProfile())
            dispatch(setErrorAuth(null))
            // запускаю callback для которого нужна авторизация.
            if (callback) callback();
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
                        dispatch(getToFavorites())
                        dispatch(getDataProfile())
                        dispatch(setErrorAuth(null))
                        // запускаю callback для которого нужна авторизация.
                        if (callback) callback();
                    })
                    .catch(e => {
                        if (e.response) {
                            // client received an error response (5xx, 4xx)
                            console.log('err.response: ', e.response)
                            dispatch(setErrorAuth(e.response))
                        } else if (e.request) {
                            // client never received a response, or request never left
                            console.log('err.request ', e.request)
                            dispatch(setErrorAuth(e.request))
                        } else {
                            // anything else
                            dispatch(setErrorAuth(e))
                            console.log('ошибка запроса')
                        }
                    })
            } else if (err.request) {
                // client never received a response, or request never left
                console.log('err.request ', err.request)
                dispatch(setErrorAuth(err.request))
            } else {
                // anything else
                dispatch(setErrorAuth(err))
                console.log('ошибка запроса')
            }
        })
    dispatch(loadingFalse())
}

// авторизация сначала по СМС, потом паролю
const authorizedBySMSorPassword = (phone: string, passOrSms: string, callback: null | (() => void) = null): ThunkType => async (dispatch, getState, apiService) => {
    dispatch(loadingTrue())
    apiService.postSmsCode(phone, passOrSms)
        .then(response => {
            dispatch({type: 'TOKEN', payload: response})
            localStorage.setItem('TOKEN', JSON.stringify(response))
            console.log('access_TOKEN')
            dispatch(getToFavorites())
            dispatch(getDataProfile())
            dispatch(setErrorAuth(null))
            // запускаю callback для которого нужна авторизация.
            if (callback) callback();
        })
        .catch(err => {
            if (err.response) {
                // client received an error response (5xx, 4xx)
                console.log('err.response: ', err.response)
                apiService.authentication(phone, passOrSms)
                    .then(response => {
                        dispatch({type: 'TOKEN', payload: response})
                        localStorage.setItem('TOKEN', JSON.stringify(response))
                        console.log('access_TOKEN')
                        dispatch(getToFavorites())
                        dispatch(getDataProfile())
                        dispatch(setErrorAuth(null))
                        // запускаю callback для которого нужна авторизация.
                        if (callback) callback();
                    })
                    .catch(e => {
                        if (e.response) {
                            // client received an error response (5xx, 4xx)
                            console.log('err.response: ', e.response)
                            dispatch(setErrorAuth(e.response))
                        } else if (e.request) {
                            // client never received a response, or request never left
                            console.log('err.request ', e.request)
                            dispatch(setErrorAuth(e.request))
                        } else {
                            // anything else
                            dispatch(setErrorAuth(e))
                            console.log('ошибка запроса')
                        }
                    })
            } else if (err.request) {
                // client never received a response, or request never left
                console.log('err.request ', err.request)
                dispatch(setErrorAuth(err.request))
            } else {
                // anything else
                dispatch(setErrorAuth(err))
                console.log('ошибка запроса')
            }
        })
    dispatch(loadingFalse())
}

const authorizedByEmail = (email: string, code: string, callback: null | (() => void) = null): ThunkType => async (dispatch, getState, apiService) => {
    dispatch(loadingTrue())
    try {
        const response = await apiService.authenticationByEmail(email, code)
        dispatch(setToken(response))
        dispatch(getDataProfile())
        dispatch(getToFavorites())
        // запускаю callback для которого нужна авторизация.
        if (callback) callback();
    } catch (e) {
        console.log(e)
        dispatch(setError(e))
    }
}

// записываем избранное в store
const setFavoritesToStore = (favoritesArray: { guid: string, [key: string]: string | number | null }[]): ActionSetFavoritesToStore => {
    return {
        type: ActionTypes.SET_FAVORITES_TO_STORE,
        payload: favoritesArray
    }
}

// добавляем элемент favorites в store
function addFavoritesToStore(favoritesElement: { guid: string, [key: string]: string | number | null }): ActionAddFavoritesToStore {
    return {
        type: ActionTypes.ADD_FAVORITES_TO_STORE,
        payload: favoritesElement
    }
}

// удаляем элемент favorites из store
function delFavoritesToStore(IDfavoritesElement: string): ActionDelFavoritesToStore {
    return {
        type: ActionTypes.DELETE_FAVORITES_TO_STORE,
        payload: IDfavoritesElement
    }
}

function getToFavorites(): ThunkType {
    return async (dispatch, getState, apiService) => {
        try {
            const cityId = getState().isCity.guid;
            const response = await apiService.getToFavorites(getState().TOKEN?.accessToken, cityId)
            dispatch(setFavoritesToStore(response))
        } catch (e) {
            dispatch(setError(e))
        }
    }
}

function loadingFavorites(): ActionLoadingFavorites {
    return {type: ActionTypes.LOADING_FAVORITES}
}

function addToFavorites(productGuid: string): ThunkType {
    return async (dispatch, getState, apiService) => {
        try {
            dispatch(loadingFavorites())
            const response = await apiService.addToFavorites(getState().TOKEN?.accessToken, productGuid)
            dispatch(addFavoritesToStore(response))
        } catch (e) {
            dispatch(setError(e))
            return Promise.reject('failed addToFavorites')
        }
    }
}

function delToFavorites(productGuid: string): ThunkType {
    return async (dispatch, getState, apiService) => {
        try {
            dispatch(loadingFavorites())
            const response = await apiService.delToFavorites(getState().TOKEN?.accessToken, productGuid)
            if (response === 200) {
                dispatch(delFavoritesToStore(productGuid))
            }
        } catch (e) {
            dispatch(setError(e))
            return Promise.reject('failed delToFavorites')
        }
    }
}

function logout(): ActionLogout {
    localStorage.removeItem("TOKEN")
    return {type: ActionTypes.LOGOUT}
}

function setActiveCategory(categoryItem: tCatalog): ActionSetActiveCategory {
    return {
        type: ActionTypes.SET_ACTIVE_CATEGORY,
        payload: categoryItem
    }
}

const setCatalog = (): ThunkType => async (dispatch, getState, apiService) => {
    dispatch(loadingTrue())
    try {
        const response = await apiService.buildCatalog()
        dispatch({
            type: 'SET_CATALOG',
            payload: response
        })
        if (!getState().activeCategory) dispatch(setActiveCategory(response));
    } catch (e) {
        dispatch(setError(e))
    }
}

function _setProductsToCategory(productsToCategory: {
    products: { guid: string, product: string, [key: string]: string | number | null }[],
    count: number,
}): Action_setProductsToCategory {
    return {
        type: ActionTypes.SET_PRODUCTS_TO_CATEGORY,
        payload: productsToCategory
    }
}

// запрос товаров по категории для каталога
const setProductsToCategory = (options: {
    productName?: string,
    quantity?: number
    page?: number,
    order?: string,
    categoryId?: string | number
}): ThunkType => async (dispatch, getState, apiService) => {
    dispatch(loadingTrue())
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
        dispatch(_setProductsToCategory(response))
    } catch (e) {
        dispatch(setError(e))
    }
}

const setUserData = (data: { [key: string]: string | number | boolean | null | ObjType[] }): ActionSetUserData => {
    return {type: ActionTypes.USER_DATA, payload: data}
}

// запрос информации о пользователе по TOKEN из LocalStorage
const fetchUserData = (): ThunkType => async (dispatch, getState, apiService) => {
    const accessToken = getState().TOKEN?.accessToken || JSON.parse(<string>localStorage.getItem('TOKEN')).accessToken
    dispatch(loadingTrue())
    try {
        const response = await apiService.getUserData(accessToken)
        dispatch(setUserData(response))
    } catch (e) {
        dispatch(setError(e))
    }
}

function _setSales(sales: any[]): Action_setSales {
    return {
        type: ActionTypes.SET_SALES,
        payload: sales
    }
}

// запрос истории покупок
const setSales = (): ThunkType => async (dispatch, getState, apiService) => {
    dispatch(loadingTrue())
    try {
        const response = await apiService.getSales(getState().TOKEN?.accessToken)
        dispatch(_setSales(response))
    } catch (e) {
        dispatch(setError(e))
    }
}

function _setInternetSales(internetSales: internetSale[]) {
    return {
        type: 'REQUEST_INTERNET_SALES',
        payload: internetSales
    }
}

// запрос истории интернет заказов
const getInternetSales = (): ThunkType => async (dispatch, getState, apiService) => {
    dispatch(loadingTrue())
    try {
        const response = await apiService.getOrder(getState().TOKEN?.accessToken)
        dispatch(_setInternetSales(response))
    } catch (e) {
        dispatch(setError(e))
    }
}

// получить данные необходимы для личного кабинета
function getDataProfile(): ThunkType {
    return async (dispatch, getState, apiService) => {
        const TOKEN = getState().TOKEN || JSON.parse(<string>localStorage.getItem('TOKEN'))
        const accessToken = TOKEN.accessToken
        dispatch(loadingTrue())
        try {
            // запрашиваем userData
            const response = await apiService.getUserData(accessToken)
            //если всё хорошо, то записываем данные в store и запрашиваем интернет заказы и историю покупок
            dispatch({type: 'USER_DATA', payload: response})
            dispatch(getInternetSales())
            dispatch(setSales())
        } catch (e) {
            dispatch(setError(e))
            dispatch(loadingTrue())
            try {
                // если запрос userData failed, то обновляем токен
                const response = await apiService.refreshToken(TOKEN)
                dispatch(setToken(response))
                console.log('refresh_TOKEN')
                // затем опять запрашиваем все данные для Profile
                dispatch(getToFavorites())
                dispatch(fetchUserData())
                dispatch(getInternetSales())
                dispatch(setSales())
            } catch (e) {
                dispatch(setError(e))
                dispatch(logout())
            }
        }
    }
}


function setPromoItems(promoItems: any): ActionSetPromoItems {
    return {type: ActionTypes.SET_PROMO_ITEMS, payload: promoItems}
}

// для отображения в блоке "Вам пригодится"
const getPromoItem = (productGuid: string | string[]): ThunkType => async (dispatch, getState, apiService) => {
    const cityGuid = getState().isCity.guid
// сначала запрашиваем комплексные товары
    if (productGuid instanceof Array) {
        const len = productGuid.length;
        let count = len;

        const getPromoItemIteration = (productID: string) => {
            apiService.getComplexes(productID, cityGuid)
                .then(response => {
                    // если в ответе не пустой массив - круто - записываем в state.promoItems
                    if (response.promoItems.length > 0) {
                        dispatch(setPromoItems(response))
                    } else {
                        // если массив пустой, то запрашиваем аналоги
                        apiService.getAnalogues(productID)
                            .then(response => {
                                // если в ответе не пустой массив - круто - записываем в state.promoItems
                                if (response.promoItems.length) {
                                    dispatch(setPromoItems(response))
                                } else {
                                    // если массив пустой - у нас ничего нет - записываем это для дальнейших действий
                                    dispatch(setPromoItems('NOT_FOUND'))
                                    if (count > 1) {
                                        --count
                                        getPromoItemIteration(productGuid[Math.min(len - count, len - 1)])
                                    }
                                }
                            })
                            .catch(e => {
                                // если ошибка, тоже записываем, для дальнейшей работы
                                dispatch(setPromoItems('ERROR'))
                                if (e.response) {
                                    // client received an error response (5xx, 4xx)
                                    console.log('err.response: ', e.response)
                                } else if (e.request) {
                                    // client never received a response, or request never left
                                    console.log('err.request ', e.request)
                                } else {
                                    // anything else
                                    console.log('ошибка запроса')
                                }
                            })
                    }

                })
                .catch(err => {
                    apiService.getAnalogues(productID)
                        .then(response => {
                            // если в ответе не пустой массив - круто - записываем в state.promoItems
                            if (response.promoItems.length) {
                                dispatch(setPromoItems(response))
                            } else {
                                // если массив пустой - у нас ничего нет - записываем это для дальнейших действий
                                dispatch(setPromoItems('NOT_FOUND'))
                            }
                        })
                        .catch(e => {
                            // если ошибка, тоже записываем, для дальнейшей работы
                            dispatch(setPromoItems('ERROR'))
                            if (e.response) {
                                // client received an error response (5xx, 4xx)
                                console.log('err.response: ', e.response)
                            } else if (e.request) {
                                // client never received a response, or request never left
                                console.log('err.request ', e.request)
                            } else {
                                // anything else
                                console.log('ошибка запроса')
                            }
                            return Promise.reject('failed getPromoItem')
                        })

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
        }

        getPromoItemIteration(productGuid[Math.min(len - count, len - 1)])
    } else {
        apiService.getComplexes(productGuid, cityGuid)
            .then(response => {
                // если в ответе не пустой массив - круто - записываем в state.promoItems
                if (response.promoItems.length > 0) {
                    dispatch(setPromoItems(response))
                } else {
                    // если массив пустой, то запрашиваем аналоги
                    apiService.getAnalogues(productGuid)
                        .then(response => {
                            // если в ответе не пустой массив - круто - записываем в state.promoItems
                            if (response.promoItems.length) {
                                dispatch(setPromoItems(response))
                            } else {
                                // если массив пустой - у нас ничего нет - записываем это для дальнейших действий
                                dispatch(setPromoItems('NOT_FOUND'))
                            }
                        })
                        .catch(e => {
                            // если ошибка, тоже записываем, для дальнейшей работы
                            dispatch(setPromoItems('ERROR'))
                            if (e.response) {
                                // client received an error response (5xx, 4xx)
                                console.log('err.response: ', e.response)
                            } else if (e.request) {
                                // client never received a response, or request never left
                                console.log('err.request ', e.request)
                            } else {
                                // anything else
                                console.log('ошибка запроса')
                            }
                        })
                }

            })
            .catch(err => {
                apiService.getAnalogues(productGuid)
                    .then(response => {
                        // если в ответе не пустой массив - круто - записываем в state.promoItems
                        if (response.promoItems.length) {
                            dispatch(setPromoItems(response))
                        } else {
                            // если массив пустой - у нас ничего нет - записываем это для дальнейших действий
                            dispatch(setPromoItems('NOT_FOUND'))
                        }
                    })
                    .catch(e => {
                        // если ошибка, тоже записываем, для дальнейшей работы
                        dispatch(setPromoItems('ERROR'))
                        if (e.response) {
                            // client received an error response (5xx, 4xx)
                            console.log('err.response: ', e.response)
                        } else if (e.request) {
                            // client never received a response, or request never left
                            console.log('err.request ', e.request)
                        } else {
                            // anything else
                            console.log('ошибка запроса')
                        }
                        return Promise.reject('failed getPromoItem')
                    })

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
    }
}

// true, когда происходит запрос от панели поиска - для сброса страниц на первую в Cards
const onRequestFromSearchPanel = (): ActionOnRequestFromSearchPanel => {
    return {type: ActionTypes.ON_REQUEST_FROM_SEARCH_PANEL}
}
const offRequestFromSearchPanel = (): ActionOffRequestFromSearchPanel => {
    return {type: ActionTypes.OFF_REQUEST_FROM_SEARCH_PANEL}
}

function _cancelOrder() {

}

// отмена заказа
const cancelOrder = (orderGuid: string): ThunkType => async (dispatch, getState, apiService) => {
    dispatch(loadingTrue())
    try {
        const response = await apiService.cancelOrder(orderGuid, getState().TOKEN?.accessToken)
        dispatch({
            type: 'CANCEL_ORDER',
            payload: response
        })
    } catch (e) {
        dispatch(setError(e))
        return Promise.reject('failed cancelOrder')
    }
}

const setFalseIsDelCartItems = () => {
    return {
        type: 'FALSE_IS_DELETE_CART_ITEMS'
    }
}


// Запрос по списку из promoItemsData = запрашиваются недостающие данные, и собирается массив и общих данных.
const setItemsForPromoBlock1 = (): ThunkType => (dispatch, getState, apiService) => {
    const arrIdItems = promoItemsData.map(item => item.guid)
    const {isCity} = getState()
    const cityId = isCity.guid
    dispatch(clearError())

    dispatch(loadingTrue())
    const arrFetch = arrIdItems.map(product => {
        return apiService.getProductInfo(product, cityId)
    })
    Promise.allSettled([...arrFetch])
        .then(allResponses => {
            const fulfilledArray = allResponses.filter(item => item.status === 'fulfilled').map(item => item.value)
            if (fulfilledArray.length) {
                const resultArr = fulfilledArray.filter(item => promoItemsData.some(itemData => itemData.guid === item.guid))
                if (resultArr.length) {
                    resultArr.forEach(resultItem => {
                        const arrCountLast = resultItem.retails.map(retail => retail.countLast);
                        const arrMinPrice = resultItem.retails.map(retail => retail.priceRetail);
                        const countLast = Math.max(...arrCountLast)
                        const minPrice = Math.min(...arrMinPrice)
                        const img = promoItemsData.find(dataEl => dataEl.guid === resultItem.guid).img;
                        resultItem.img = img;
                        resultItem.countLast = countLast;
                        resultItem.minPrice = minPrice
                    })
                }
                dispatch({type: ActionTypes.SET_ITEMS_FOR_PROMOBLOCK_1, payload: resultArr})
            }
        })
        .catch(error => dispatch(setError(error)))
    dispatch(loadingFalse())
}

const setSeasonItemsForPromoBlock2 = () => (dispatch, getState, apiService) => {
    const arrIdItems = seasonPromoItems.map(item => item.guid)
    const {isCity} = getState()
    const cityId = isCity.guid
    dispatch(clearError())

    dispatch(loadingTrue())
    const arrFetch = arrIdItems.map(product => {
        return apiService.getProductInfo(product, cityId)
    })
    Promise.allSettled([...arrFetch])
        .then(allResponses => {
            const fulfilledArray = allResponses.filter(item => item.status === 'fulfilled').map(item => item.value)
            if (fulfilledArray.length) {
                const resultArr = fulfilledArray.filter(item => seasonPromoItems.some(itemData => itemData.guid === item.guid))
                if (resultArr.length) {
                    resultArr.forEach(resultItem => {
                        const arrCountLast = resultItem.retails.map(retail => retail.countLast);
                        const arrMinPrice = resultItem.retails.map(retail => retail.priceRetail);
                        const countLast = Math.max(...arrCountLast)
                        const minPrice = Math.min(...arrMinPrice)
                        const img = seasonPromoItems.find(dataEl => dataEl.guid === resultItem.guid).img;
                        resultItem.img = img;
                        resultItem.countLast = countLast;
                        resultItem.minPrice = minPrice
                    })
                }
                dispatch({type: ActionTypes.SET_SEASON_ITEMS_FOR_PROMOBLOCK_2, payload: resultArr})
            }
        })
        .catch(error => dispatch(setError(error)))
    dispatch(loadingFalse())
}

const setPopularItemsForPromoBlock3 = (): ThunkType => (dispatch, getState, apiService) => {
    const arrIdItems = popularPromoItems.map(item => item.guid)
    const {isCity} = getState()
    const cityId = isCity.guid
    dispatch(clearError())

    dispatch(loadingTrue())
    const arrFetch = arrIdItems.map(product => {
        return apiService.getProductInfo(product, cityId)
    })
    Promise.allSettled([...arrFetch])
        .then(allResponses => {
            const fulfilledArray = allResponses.filter(item => item.status === 'fulfilled').map(item => item.value)
            if (fulfilledArray.length) {
                const resultArr = fulfilledArray.filter(item => popularPromoItems.some(itemData => itemData.guid === item.guid))
                if (resultArr.length) {
                    resultArr.forEach(resultItem => {
                        const arrCountLast = resultItem.retails.map(retail => retail.countLast);
                        const arrMinPrice = resultItem.retails.map(retail => retail.priceRetail);
                        const countLast = Math.max(...arrCountLast)
                        const minPrice = Math.min(...arrMinPrice)
                        const img = popularPromoItems.find(dataEl => dataEl.guid === resultItem.guid).img;
                        resultItem.img = img;
                        resultItem.countLast = countLast;
                        resultItem.minPrice = minPrice
                    })
                }
                dispatch({type: ActionTypes.SET_POPULAR_ITEMS_FOR_PROMOBLOCK_3, payload: resultArr})
            }
        })
        .catch(error => dispatch(setError(error)))
    dispatch(loadingFalse())
}

const setPredictor = (value) => {
    return {
        type: 'SET_PREDICTOR',
        payload: value
    }
}

const setActivePromoGroup = (promo: { name: string, arrPromo: { [key: string]: any }[] }) => {
    return {
        type: 'SET_ACTIVE_PROMO_GROUP',
        payload: promo
    }
}

export {
    setActivePromoGroup,
    setPredictor,
    setItemsForPromoBlock1,
    setSeasonItemsForPromoBlock2,
    setPopularItemsForPromoBlock3,
    setFalseIsDelCartItems,
    loadingReset,
    getPromoItem,
    setUserData,
    setToken,
    delToFavorites,
    addToFavorites,
    authorizedByPassOrSMS,
    authorizedBySMSorPassword,
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
    fetchProductInfo,
    fetchCartItems,
    onSelectRetail,
    fetchRetailsCity,
    getProductsFromSearchLimit,
    repeatOrder,
    getDataProfile,
    authorizedByEmail
}