import {promoItemsData} from "../testData/promoItemsData_04.21";
import {seasonPromoItems} from "../testData/seasonPromoItems";
import {popularPromoItems} from "../testData/popularPromoItems";

import {
    Action_closePopupLogin,
    Action_fetchCities,
    Action_fetchRetailsCity,
    Action_openPopupLogin,
    Action_setActiveBonusCard,
    Action_setCatalog,
    Action_setCity,
    Action_setIDfetchPromo,
    Action_setInternetSales,
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
    ActionItemsForPromoBlock,
    ActionLoadingFalse,
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
    ActionSetActivePromoGroup,
    ActionSetCountItemCart,
    ActionSetError,
    ActionSetFalseIsDelCartItems,
    ActionSetFavoritesToStore,
    ActionSetPredictor,
    ActionSetPromoItems,
    ActionSetStatusRequestOrder,
    ActionSetToken,
    ActionSetUserData,
    ActionsSetErrorAuth,
    ActionStatusRequestRepeatOrder,
    ActionType
} from "./actionType";

import {
    ActionTypes,
    CartItemType,
    CategoryElement,
    internetSale,
    Predictor,
    retailCity,
    TypeApiService,
    TypeProductInfo,
    TypePromoItems, UserBonusCardType, UserDataType,
} from "../types";
import {StateType} from "../store";
import {ThunkAction} from "redux-thunk";
import {Dispatch} from "redux";

export type ThunkType = ThunkAction<void | Promise<any>, StateType, TypeApiService, ActionType>

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

export const openPopupLogin = (): Action_openPopupLogin => {
    return {
        type: ActionTypes.OPEN_POPOP_LOGIN
    }
}

export const closePopupLogin = (): Action_closePopupLogin => {
    return {
        type: ActionTypes.CLOSE_POPOP_LOGIN
    }
}

// ставим загрузку
const loadingTrue = (): ActionLoadingTrue => {
    return {
        type: ActionTypes.LOADING,
    }
}

const loadingFalse = (): ActionLoadingFalse => {
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
const setCartItems = (cartItems: TypeProductInfo[]): ActionSetStatusRequestOrder => {
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

    if (cart.length > 0) {
        dispatch(loadingTrue())
        const arrFetch = cart.map((product: CartItemType) => {
            return apiService.getProductInfo(product.itemId, cityId)
        })
        return Promise.allSettled([...arrFetch])
            .then(allResponses => {
                const fulfilledArray = allResponses.filter(item => item.status === 'fulfilled').map(item => (item as { value: TypeProductInfo }).value)
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
        return Promise.allSettled([...arrFetch])
            .then(allResponses => {
                // собираем массив из успешно выполненных запросов
                const fulfilledArray = allResponses
                    .filter(item => item.status === 'fulfilled')
                    .map(item => (item as { value: TypeProductInfo | null }).value)
                    .filter(item => Boolean(item)) // сервер может вернуть null если ничего не нашёл
                if (fulfilledArray.length) {
                    fulfilledArray.forEach(item => {
                        const index = arrayProducts.findIndex(el => el.idProduct === item!.guid)
                        if (index >= 0) {
                            const count = arrayProducts[index].count
                            for (let i = 0; i < count; i++) {
                                dispatch(addedToCart(item!.guid))
                            }
                        }
                    })

                    dispatch(setStatusRequestOrder('executed'))
                } else dispatch(setStatusRequestOrder('failure'))
            })
            .catch(_ => dispatch(setStatusRequestOrder('failure')))
            .finally(() => dispatch(loadingFalse()))

    }
}

// открывает/закрывает popup подтверждения города
const onPopupLocation = (boolean: boolean): ActionOnPopupLocation => {
    return {
        type: ActionTypes.ON_POPUP_LOCATION,
        payload: boolean
    }
}

const _setCity = (isCity: { guid: string, title: string, [key: string]: any }): Action_setCity => {
    return {
        type: ActionTypes.SET_CITY,
        payload: isCity
    }
}


// устанавливает объект текущего города и записывает его в LocalStorage / loadingFalse - ставится в reducer
const setIsCity = (isCity: { guid: string, title: string, [key: string]: any }): ThunkType => (dispatch) => {
    dispatch(loadingTrue())
    const item = [isCity]
    localStorage.setItem("city", JSON.stringify(item))
    // устанавливаем город
    dispatch(_setCity(isCity)) // loadingFalse - ставится в reducer
    // запрашиваем инф. о товарах в корзине по новому городу
    return dispatch(fetchCartItems(isCity.guid))
}

const _fetchCities = (cities: {
    regionGuid: string;
    regionTitle: string;
    guid: string;
    title: string;
}[]): Action_fetchCities => {
    return {type: ActionTypes.FETCH_CITIES_SUCCESS, payload: cities}
}

// запрос списка городов
const fetchCities = (): ThunkType => async (dispatch, getState, apiService) => {
    try {
        dispatch(loadingTrue())
        const response = await apiService.getCities()
        dispatch(_fetchCities(response))

        const getCityLocalStorage = () => {
            if (localStorage.getItem("city")) {
                const cityItem = JSON.parse(localStorage.getItem("city") as string)[0]
                if (cityItem && cityItem?.guid) {
                    return cityItem
                }
                return null
            }
        }
        const cityItem = getCityLocalStorage()

        // если в localStorage есть город - устанавливаем его
        if (cityItem) {
            dispatch(setIsCity(cityItem)) // loadingFalse - ставится в reducer
        } else {
            // иначе определяем город по IP, устанавливаем его и открываем popup подтверждения выбранного города
            apiService.getUserCity()
                .then(res => {
                    let {city} = res;
                    city = (city === 'Москва') ? 'Подольск' : city;
                    const cityItem = response.find((item: { title: string; }) => city === item.title)
                    if (cityItem && cityItem.guid) {
                        dispatch(setIsCity(cityItem)) // loadingFalse - ставится в reducer
                    } else {
                        dispatch(loadingFalse())
                    }
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


// записываем все аптеки города / loadingFalse - ставится в reducer
const _fetchRetailsCity = (payload: retailCity[]): Action_fetchRetailsCity => {
    return {type: ActionTypes.FETCH_RETAILS_CITY_SUCCESS, payload}
}

// Список торговых точек в городе
const fetchRetailsCity = (): ThunkType => async (dispatch, getState, apiService) => {
    try {
        const cityId = getState().isCity.guid
        dispatch(loadingTrue())
        const response = await apiService.getRetailsCity(cityId)
        dispatch(_fetchRetailsCity(response)) // loadingFalse - ставится в reducer
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
        type: ActionTypes.ALL_ITEM_REMOVED_FROM_CART,
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
const loadingProductInfo = (product: TypeProductInfo): ActionLoadingProductInfo => {
    return {
        type: ActionTypes.LOADING_PRODUCT_INFO,
        payload: product
    }
}

// подробная информация о продукте
const fetchProductInfo = (productId: string): ThunkType => {
    return async (dispatch, getState, apiService) => {
        dispatch(loadingTrue())
        try {
            const response = await apiService.getProductInfo(productId, getState().isCity.guid)
            if (response) dispatch(loadingProductInfo(response));
        } catch (e) {
            dispatch(setError(e))
        }
    }
}

const onSelectRetail = (id: string | null): ActionOnSelectRetail => {
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
    const TOKEN = getState().TOKEN || JSON.parse(localStorage.getItem('TOKEN') as string)
    if (!TOKEN) {
        dispatch(logout())
        return
    }
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
    } finally {
        dispatch(loadingFalse())
    }
}

// POST запрос TOKEN
const authentication = (phone: string, password: string, callback: null | (() => void) = null): ThunkType => async (dispatch, getState, apiService) => {
    dispatch(loadingTrue())
    try {
        const response = await apiService.authentication(phone, password)
        dispatch(setToken(response))
        localStorage.setItem('TOKEN', JSON.stringify(response))
        dispatch(getToFavorites())
        dispatch(getDataProfile())
        dispatch(setErrorAuth(null))
        // запускаю callback для которого нужна авторизация.
        if (callback) callback();


    } catch (e) {
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
    } finally {
        dispatch(loadingFalse())
    }
}

export const postSmsCode = (phone: string, passOrSms: string, callback: null | (() => void) = null): ThunkType => async (dispatch, getState, apiService) => {
    dispatch(loadingTrue())
    try {
        const responseToken = await apiService.postSmsCode(phone, passOrSms)
        dispatch(setToken(responseToken))
        localStorage.setItem('TOKEN', JSON.stringify(responseToken))
        dispatch(getToFavorites())
        dispatch(getDataProfile())
        dispatch(setErrorAuth(null))
        // запускаю callback для которого нужна авторизация.
        if (callback) callback();
    } catch (e) {
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
    }
    dispatch(loadingFalse())
}

// авторизация по паролю или СМС
const authorizedByPassOrSMS = (phone: string, passOrSms: string, callback: null | (() => void) = null): ThunkType => async (dispatch, getState, apiService) => {
    dispatch(loadingTrue())
    try {
        const authToken = await apiService.authentication(phone, passOrSms);
        dispatch(setToken(authToken))
        localStorage.setItem('TOKEN', JSON.stringify(authToken))
        dispatch(getToFavorites())
        dispatch(getDataProfile())
        dispatch(setErrorAuth(null))
        // запускаю callback для которого нужна авторизация.
        if (callback) callback();
    } catch (err) {
        if (err.response) {
            // client received an error response (5xx, 4xx)
            console.log('err.response: ', err.response)
            dispatch(postSmsCode(phone, passOrSms, callback))
        } else if (err.request) {
            // client never received a response, or request never left
            console.log('err.request ', err.request)
            dispatch(setErrorAuth(err.request))
        } else {
            // anything else
            dispatch(setErrorAuth(err))
            console.log('ошибка запроса')
        }
    }
    dispatch(loadingFalse())
}

// авторизация сначала по СМС, потом паролю
const authorizedBySMSorPassword = (phone: string, passOrSms: string, callback: null | (() => void) = null): ThunkType => async (dispatch, getState, apiService) => {
    dispatch(loadingTrue())
    try {
        const response = await apiService.postSmsCode(phone, passOrSms)
        dispatch(setToken(response))
        localStorage.setItem('TOKEN', JSON.stringify(response))
        dispatch(getToFavorites())
        dispatch(getDataProfile())
        dispatch(setErrorAuth(null))
        // запускаю callback для которого нужна авторизация.
        if (callback) callback();
    } catch (err) {
        if (err.response) {
            // client received an error response (5xx, 4xx)
            console.log('err.response: ', err.response)
            dispatch(authentication(phone, passOrSms, callback))
        } else if (err.request) {
            // client never received a response, or request never left
            console.log('err.request ', err.request)
            dispatch(setErrorAuth(err.request))
        } else {
            // anything else
            dispatch(setErrorAuth(err))
            console.log('ошибка запроса')
        }
    }

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
            const accessToken = getState().TOKEN?.accessToken
            const cityId = getState().isCity.guid;
            if (accessToken) {
                const response = await apiService.getToFavorites(accessToken, cityId)
                dispatch(setFavoritesToStore(response))
            }
        } catch (e) {
            // dispatch(setError(e))
        }
    }
}

function loadingFavorites(): ActionLoadingFavorites {
    return {type: ActionTypes.LOADING_FAVORITES}
}

function addToFavorites(productGuid: string): ThunkType {
    return async (dispatch, getState, apiService) => {
        try {
            const accessToken = getState().TOKEN?.accessToken
            if (accessToken) {
                dispatch(loadingFavorites())
                const response = await apiService.addToFavorites(accessToken, productGuid)
                dispatch(addFavoritesToStore(response))
            }
        } catch (e) {
            // dispatch(setError(e))
            return Promise.reject('failed addToFavorites')
        }
    }
}

function delToFavorites(productGuid: string): ThunkType {
    return async (dispatch, getState, apiService) => {
        try {
            const accessToken = getState().TOKEN?.accessToken
            if (accessToken) {
                dispatch(loadingFavorites())
                const response = await apiService.delToFavorites(accessToken, productGuid)
                if (response === 200) {
                    dispatch(delFavoritesToStore(productGuid))
                }
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

function setActiveCategory(categoryItem: CategoryElement): ActionSetActiveCategory {
    return {
        type: ActionTypes.SET_ACTIVE_CATEGORY,
        payload: categoryItem
    }
}

const _setCatalog = (catalog: CategoryElement): Action_setCatalog => {
    return {
        type: ActionTypes.SET_CATALOG,
        payload: catalog
    }
}

const setCatalog = (): ThunkType => async (dispatch, getState, apiService) => {
    dispatch(loadingTrue())
    try {
        const response = await apiService.buildCatalog()
        dispatch(_setCatalog(response))
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

const setUserData = (data: UserDataType): ActionSetUserData => {
    return {type: ActionTypes.USER_DATA, payload: data}
}

// запрос информации о пользователе по TOKEN из LocalStorage
const fetchUserData = (): ThunkType => async (dispatch, getState, apiService) => {
    const accessToken = getState().TOKEN?.accessToken || JSON.parse(localStorage.getItem('TOKEN') as string).accessToken
    dispatch(loadingTrue())
    try {
        const response = await apiService.getUserData(accessToken)
        dispatch(setUserData(response))
        // если бонусная карта по умолчания не выбрана - ставим ту, где больше баланс.
        if (!getState().activeBonusCard) {
            if (response.cards.length) {
                const cards = [...response.cards]
                cards.sort((a, b) => a.currentBalance < b.currentBalance ? 1 : -1)
                dispatch(setActiveBonusCard(response.cards[0]))
            }
        }
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
        const accessToken = getState().TOKEN?.accessToken
        if (accessToken) {
            const response = await apiService.getSales(accessToken)
            dispatch(_setSales(response))
        }
    } catch (e) {
        dispatch(setError(e))
    }
}

function _setInternetSales(internetSales: internetSale[]): Action_setInternetSales {
    return {
        type: ActionTypes.REQUEST_INTERNET_SALES,
        payload: internetSales
    }
}

// запрос истории интернет заказов
const getInternetSales = (): ThunkType => async (dispatch, getState, apiService) => {
    dispatch(loadingTrue())
    try {
        const accessToken = getState().TOKEN?.accessToken
        if (accessToken) {
            const response = await apiService.getOrder(accessToken)
            dispatch(_setInternetSales(response))
        }
    } catch (e) {
        dispatch(setError(e))
    }
}

// получить данные необходимы для личного кабинета
function getDataProfile(): ThunkType {
    return async (dispatch, getState, apiService) => {
        const TOKEN = getState().TOKEN || JSON.parse(localStorage.getItem('TOKEN') as string)
        const accessToken = TOKEN.accessToken
        dispatch(loadingTrue())
        try {
            // запрашиваем userData
            const response = await apiService.getUserData(accessToken)
            //если всё хорошо, то записываем данные в store и запрашиваем интернет заказы и историю покупок
            dispatch(setUserData(response))
            dispatch(getInternetSales())
            dispatch(setSales())
        } catch (e) {
            dispatch(setError(e))
            dispatch(loadingTrue())
            try {
                // если запрос userData failed, то обновляем токен
                const response = await apiService.refreshToken(TOKEN)
                dispatch(setToken(response))
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

function setIDfetchPromo(IDfetch: number): Action_setIDfetchPromo {
    return {type: ActionTypes.SET_ID_FETCH_PROMO, payload: IDfetch}
}

function setPromoItems(promoItems: TypePromoItems): ActionSetPromoItems {
    return {type: ActionTypes.SET_PROMO_ITEMS, payload: promoItems}
}

// доп.продажи complexes для отображения в блоке "Вам пригодится"
const getPromoItem = (productGuid: string[]): ThunkType => async (dispatch, getState, apiService) => {
    const IDfetch = Math.random()
    dispatch(setIDfetchPromo(IDfetch))
    const cityGuid = getState().isCity.guid
    // сначала запрашиваем комплексные товары
    const len = productGuid.length;
    let count = len;

    // подтягиваем доп.продажи по id товаров, если нет, берём следующий товар из массива.
    const getPromoItemIteration = (productID: string) => {
        apiService.getComplexes(productID, cityGuid)
            .then(response => {
                // если в ответе не пустой массив - круто - записываем в state.promoItems
                if (response.promoItems.length > 0) {
                    if (getState().idFetchPromo === IDfetch) {
                        dispatch(setPromoItems(response))
                    }
                } else {
                    if (count > 1) {
                        --count
                        getPromoItemIteration(productGuid[Math.min(len - count, len - 1)])
                    }
                }
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
    }

    getPromoItemIteration(productGuid[Math.min(len - count, len - 1)])
}

// true, когда происходит запрос от панели поиска - для сброса страниц на первую в Cards
const onRequestFromSearchPanel = (): ActionOnRequestFromSearchPanel => {
    return {type: ActionTypes.ON_REQUEST_FROM_SEARCH_PANEL}
}
const offRequestFromSearchPanel = (): ActionOffRequestFromSearchPanel => {
    return {type: ActionTypes.OFF_REQUEST_FROM_SEARCH_PANEL}
}

const setFalseIsDelCartItems = (): ActionSetFalseIsDelCartItems => {
    return {
        type: ActionTypes.FALSE_IS_DELETE_CART_ITEMS
    }
}

const _setItemsForPromoBlock1 = (itemsForPromoBlock: TypeProductInfo[]): ActionItemsForPromoBlock => {
    return {
        type: ActionTypes.SET_ITEMS_FOR_PROMOBLOCK_1,
        payload: itemsForPromoBlock
    }
}

const _setItemsForPromoBlock2 = (itemsForPromoBlock: TypeProductInfo[]): ActionItemsForPromoBlock => {
    return {
        type: ActionTypes.SET_SEASON_ITEMS_FOR_PROMOBLOCK_2,
        payload: itemsForPromoBlock
    }
}

const _setItemsForPromoBlock3 = (itemsForPromoBlock: TypeProductInfo[]): ActionItemsForPromoBlock => {
    return {
        type: ActionTypes.SET_POPULAR_ITEMS_FOR_PROMOBLOCK_3,
        payload: itemsForPromoBlock
    }
}

const getFullItemForPromoBlock = (allResponses: { status: string, value: TypeProductInfo | null }[],
                                  promoItems: any[],
                                  callback: (arr: TypeProductInfo[]) => ActionItemsForPromoBlock,
                                  dispatch: Dispatch) => {
    const fulfilledArray = allResponses
        .filter(item => item.status === 'fulfilled')
        .map(item => item.value)
        .filter(item => Boolean(item))
    if (fulfilledArray.length) {
        const resultArr = fulfilledArray.filter(item => promoItems.some(itemData => itemData.guid === item!.guid))
        if (resultArr.length) {
            (resultArr as TypeProductInfo[]).forEach(resultItem => {
                const arrCountLast = resultItem.retails.map(retail => retail.countLast);
                const arrMinPrice = resultItem.retails.map(retail => retail.priceRetail);
                const img = promoItems.find(dataEl => dataEl.guid === resultItem.guid)?.img;
                resultItem.img = img ? img : null;
                resultItem.countLast = Math.max(...arrCountLast)
                resultItem.minPrice = Math.min(...arrMinPrice)
            })
        }
        dispatch(callback((resultArr as TypeProductInfo[])))
    }
}


// Запрос по списку из promoItemsData(акции на главной стр.) - запрашиваются недостающие данные, и собирается массив из общих данных.
const setItemsForPromoBlock1 = (): ThunkType => (dispatch, getState, apiService) => {
    const arrIdItems = promoItemsData.map(item => item.guid)
    const cityId = getState().isCity.guid
    dispatch(clearError())

    dispatch(loadingTrue())
    const arrFetch = arrIdItems.map(productID => {
        return apiService.getProductInfo(productID, cityId)
    })
    return Promise.allSettled([...arrFetch])
        .then(allResponses => {
            getFullItemForPromoBlock((allResponses as { status: string, value: TypeProductInfo | null }[]), promoItemsData, _setItemsForPromoBlock1, dispatch)
        })
        .catch(error => console.log(error))
        .finally(() => dispatch(loadingFalse()))
}

const setSeasonItemsForPromoBlock2 = (): ThunkType => (dispatch, getState, apiService) => {
    const arrIdItems = seasonPromoItems.map(item => item.guid)
    const {isCity} = getState()
    const cityId = isCity.guid
    dispatch(clearError())

    dispatch(loadingTrue())
    const arrFetch = arrIdItems.map(product => {
        return apiService.getProductInfo(product, cityId)
    })
    return Promise.allSettled([...arrFetch])
        .then(allResponses => {
            getFullItemForPromoBlock((allResponses as { status: string, value: TypeProductInfo | null }[]), seasonPromoItems, _setItemsForPromoBlock2, dispatch)
        })
        .catch(error => console.log(error))
        .finally(() => dispatch(loadingFalse()))
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
    return Promise.allSettled([...arrFetch])
        .then(allResponses => {
            getFullItemForPromoBlock((allResponses as { status: string, value: TypeProductInfo | null }[]), popularPromoItems, _setItemsForPromoBlock3, dispatch)
        })
        .catch(error => console.log(error))
        .finally(() => dispatch(loadingFalse()))
}

const setPredictor = (value: Predictor): ActionSetPredictor => {
    return {
        type: ActionTypes.SET_PREDICTOR,
        payload: value
    }
}

const setActivePromoGroup = (promo: { name: string, arrPromo: { [key: string]: any }[] }): ActionSetActivePromoGroup => {
    return {
        type: ActionTypes.SET_ACTIVE_PROMO_GROUP,
        payload: promo
    }
}

export const setActiveBonusCard = (bonusCard: UserBonusCardType): Action_setActiveBonusCard => {
    return {
        type: ActionTypes.SET_ACTIVE_BONUS_CARD,
        payload: bonusCard
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