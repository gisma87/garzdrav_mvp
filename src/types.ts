import apiService from "./service/ApiService";

export type TypeApiService = typeof apiService


export type ObjType = { [key: string]: string | number | ObjType | (number | string | ObjType)[] | null }

export enum ActionTypes {
    FETCH_FAILURE = 'FETCH_FAILURE',
    AUTH_FAILURE = 'AUTH_FAILURE',
    LOADING_RESET = 'LOADING_RESET',
    SET_ITEMS_FOR_PROMOBLOCK_1 = 'SET_ITEMS_FOR_PROMOBLOCK_1',
    SET_SEASON_ITEMS_FOR_PROMOBLOCK_2 = 'SET_SEASON_ITEMS_FOR_PROMOBLOCK_2',
    SET_POPULAR_ITEMS_FOR_PROMOBLOCK_3 = 'SET_POPULAR_ITEMS_FOR_PROMOBLOCK_3',
    SET_STATUS_REQUEST_REPEAT_ORDER = 'SET_STATUS_REQUEST_REPEAT_ORDER',
    CLEAR_ERROR = 'CLEAR_ERROR',
    LOADING = 'LOADING',
    LOADING_OFF = 'LOADING_OFF',
    DEL_CART_ITEM = 'DEL_CART_ITEM',
    SET_CART_ITEMS = 'SET_CART_ITEMS',
    ON_POPUP_LOCATION = 'ON_POPUP_LOCATION',
    SET_CITY = 'SET_CITY',
    FETCH_RETAILS_CITY_SUCCESS = 'FETCH_RETAILS_CITY_SUCCESS',
    ITEM_ADDED_TO_CART = 'ITEM_ADDED_TO_CART',
    ITEM_REMOVED_FROM_CART = 'ITEM_REMOVED_FROM_CART',
    ALL_ITEM_REMOVED_FROM_CART = 'ALL_ITEM_REMOVED_FROM_CART',
    SET_COUNT_ITEM_CART = 'SET_COUNT_ITEM_CART',
    REWRITE_CART = 'REWRITE_CART',
    FETCH_PRODUCTS_FROM_SEARCH_SUCCESS = 'FETCH_PRODUCTS_FROM_SEARCH_SUCCESS',
    LOADING_PRODUCT_INFO = 'LOADING_PRODUCT_INFO',
    ON_SELECT_RETAIL = 'ON_SELECT_RETAIL',
    CLEAR_CART = 'CLEAR_CART',
    TOKEN = 'TOKEN',
    SET_FAVORITES_TO_STORE = 'SET_FAVORITES_TO_STORE',
    ADD_FAVORITES_TO_STORE = 'ADD_FAVORITES_TO_STORE',
    DELETE_FAVORITES_TO_STORE = 'DELETE_FAVORITES_TO_STORE',
    LOADING_FAVORITES = 'LOADING_FAVORITES',
    LOGOUT = 'LOGOUT',
    SET_ACTIVE_CATEGORY = 'SET_ACTIVE_CATEGORY',
    SET_PRODUCTS_TO_CATEGORY = 'SET_PRODUCTS_TO_CATEGORY',
    USER_DATA = 'USER_DATA',
    SET_SALES = 'SET_SALES',
    REQUEST_INTERNET_SALES = 'REQUEST_INTERNET_SALES',
    SET_PROMO_ITEMS = 'SET_PROMO_ITEMS',
    ON_REQUEST_FROM_SEARCH_PANEL = 'ON_REQUEST_FROM_SEARCH_PANEL',
    OFF_REQUEST_FROM_SEARCH_PANEL = 'OFF_REQUEST_FROM_SEARCH_PANEL',
    FALSE_IS_DELETE_CART_ITEMS = 'FALSE_IS_DELETE_CART_ITEMS',
    SET_PREDICTOR = 'SET_PREDICTOR',
    SET_ACTIVE_PROMO_GROUP = 'SET_ACTIVE_PROMO_GROUP'
}

export type tCatalog = {
    guid: string,
    title: string,
    parent: null | string,
    child: tCatalog[],
    historyGuid: string[]
}
export type TypeSetCartItem = {
    guid: string,
    product: string,
    retails: {
        guid: string,
        brand: string,
        city: string,
        street: string,
        buildNumber: string,
        countLast: number,
        priceRetail: number,
        coordinates: number[],
        phone: string,
        weekDayTime: string,
        [key: string]: string | number | ObjType | (number | string | ObjType)[] | null
    }[],
    [key: string]: string | number | ObjType | (number | string | ObjType)[] | null
}

export type CartItemType = { itemId: string, count: number }
export type retailCity = { [key: string]: string | number | number[] | null }
export type productInfo = {
    guid: string,
    product: string,
    manufacturer: string,
    categoryGuid: string,
    [key: string]: string | ObjType[]
}
export type internetSale = {
    orderGuid: string,
    sum: number,
    status: string,
    dateCreated: string,
    number: string,
    retail: ObjType[],
    items: { [key: string]: string | number }[],
    [key: string]: string | number | null | ObjType | (string | number | ObjType)[]
}

export type TypeItemsForPromoBlock = { guid: string, product: string, manufacturer: string, categoryGuid: string, countLast: number, minPrice: number, img: string, [key: string]: any }[]

export interface StateTypes {
    cities: { guid: string, title: string, [key: string]: any }[],
    regions: any[],
    loading: number,
    loadingFavorites: number,
    error: null | string,
    errorAuth: null | string,
    isCity: { guid: string, title: string, [key: string]: any },
    retailsCity: retailCity[],
    cart: CartItemType[] | [],
    favorites: { guid: string, [key: string]: string | number | null }[],
    productsFromSearch: { guid: string, product: string, [key: string]: string | number }[],
    countProductsSearch: null | number,
    productInfo: string | productInfo,
    cartItems: {
        guid: string,
        product: string,
        retails: {
            guid: string,
            brand: string,
            city: string,
            street: string,
            buildNumber: string,
            countLast: number,
            priceRetail: number,
            coordinates: number[],
            phone: string,
            weekDayTime: string,
            [key: string]: string | number | ObjType | (number | string | ObjType)[] | null
        }[],
        [key: string]: string | number | ObjType | (number | string | ObjType)[] | null
    }[],
    retailsArr: {
        guid: string,
        product: { guid: string, priceRetail: number, count: number, [key: string]: string | number }[],
        priceRetail?: number,
        countLast?: number,
        weekDayTime?: string | null | undefined,
        [key: string]: string | number | number[] | ObjType | ObjType[] | undefined | null
    }[],
    selectedRetail: null | string
    isPopupLocation: boolean,
    TOKEN: null | { accessToken: string, refreshToken: string },
    userData: { [key: string]: string | number | boolean | null | ObjType[] } | null,
    catalog: null | tCatalog,
    activeCategory: null | tCatalog,
    productsToCategory: { guid: string, product: string, [key: string]: string | number | null }[],
    countProductsCategory: null | number,
    sales: any[],
    productSearch: string,
    requestFromSearchPanelThisTime: boolean,
    internetSales: internetSale[],
    statusRequestRepeatOrder: 'executed' | 'failure' | '',
    promoItems: null | string | any,
    isDelCartItem: boolean,
    predictor: null | { [key: string]: any },
    activePromoGroup: { name: string, arrPromo: { [key: string]: any }[] }

    itemsForPromoBlock1: TypeItemsForPromoBlock,
    seasonItemsForPromoBlock2: TypeItemsForPromoBlock,
    popularItemsForPromoBlock3: TypeItemsForPromoBlock,
}

interface ActionItemsForPromoBlock {
    type: ActionTypes.SET_ITEMS_FOR_PROMOBLOCK_1 | ActionTypes.SET_SEASON_ITEMS_FOR_PROMOBLOCK_2 | ActionTypes.SET_POPULAR_ITEMS_FOR_PROMOBLOCK_3,
    payload: TypeItemsForPromoBlock
}

interface ActionStatusRequestRepeatOrder {
    type: ActionTypes.SET_STATUS_REQUEST_REPEAT_ORDER,
    payload: string
}

interface ActionResetLoading {
    type: ActionTypes.LOADING_RESET
}

export type ActionType = ActionItemsForPromoBlock | ActionStatusRequestRepeatOrder | ActionResetLoading;

// подробная информация по товару - для записи в store
export type TypeProductInfo = {
    guid: string,
    product: string,
    manufacturer: string
    categoryGuid: string,
    retails: {
        guid: string,
        countLast: number,
        priceRetail: number,
        brand: string,
        buildNumber: string,
        city: string,
        coordinates: (number | string)[]
        phone: string,
        street: string,
        title: string,
        weekDayTime: string
    }[],
    [key: string]: string | number | ObjType | any[],
}

// подробная информация по товару - ответ сервера
export type TypeResponseProductInfo = {
    guid: string,
    product: string,
    manufacturer: string
    categoryGuid: string,
    retails: {
        countLast: number,
        priceRetail: number,

        retail: {
            guid: string,
            brand: string,
            buildNumber: string,
            city: string,
            coordinates: (number | string)[]
            phone: string,
            street: string,
            title: string,
            weekDayTime: string
        },

        [key: string]: string | number | ObjType | (number | string | ObjType)[]
    }[],
    [key: string]: string | number | ObjType | (number | string | ObjType)[],
}

export type TypeResponseCategories = { guid: string, parent: string | null, title: string }[]

export type TypeResponseSale = {
    items: {
        productTitle: string,
        productGuid: string,
        priceRetail: number,
        quantity: string | number,
        spendBonus: string | number,
        accumulationBonus: string | number,
        discount: string | number
    }[]
    retail: {
        guid: string,
        brand: string,
        buildNumber: string,
        city: string,
        coordinates: (number | string)[]
        phone: string,
        street: string,
        title: string,
        weekDayTime: string
    },

    [key: string]: string | number | ObjType | (number | string | ObjType)[]
}


export type TypeOrder = {
    retailGuid: string,
    sum: number,
    products: {
        productGuid: string,
        quantity: number,
        priceRetail: number
    }[]
}

export type Product = {
    guid: string,
    product: string,
    manufacturer: string,
    categoryGuid: string,
    categoryTitle: string
}

export type TypeComplexes = {
    complexes: {
        products: Product[],
        [key: string]: string | number | ObjType | ObjType[]
    }[],
    [key: string]: string | number | ObjType | ObjType[]
}

export type TypeAnalogues = {
    productGuid: string,
    analogues: {
        products: Product[],
        [key: string]: string | number | ObjType | ObjType[]
    }[],
    [key: string]: string | number | ObjType | ObjType[]
}

export interface CategoryElement {
    child: CategoryElement[],
    historyGuid: string[],
    guid: string,
    title: string,
    parent: string | null,

    getChildrens(): void
}
