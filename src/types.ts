import apiService from "./service/ApiService";
import React from "react";

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
    SET_ACTIVE_PROMO_GROUP = 'SET_ACTIVE_PROMO_GROUP',
    SET_CATALOG = 'SET_CATALOG',
    FETCH_CITIES_SUCCESS = 'FETCH_CITIES_SUCCESS',
    SET_ID_FETCH_PROMO = 'SET_ID_FETCH_PROMO',
    OPEN_POPOP_LOGIN = 'OPEN_POPOP_LOGIN',
    CLOSE_POPOP_LOGIN = 'CLOSE_POPOP_LOGIN'
}

export type CartItemType = { itemId: string, count: number }
export type retailCity = {
    guid: string,
    brand: string,
    city: string,
    street: string,
    buildNumber: string,
    phone: string,
    weekDayTime: string,
    coordinates: number[],
    [key: string]: string | number | number[] | null
}
export type productInfo = {
    guid: string,
    product: string,
    manufacturer: string,
    categoryGuid: string,
    [key: string]: string | ObjType[]
}

// подробная информация по товару - для записи в store
export type TypeProductInfo = {
    img?: string | null | undefined
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
        weekDayTime: string,
        [key: string]: string | number | ObjType | (number | string | ObjType)[] | null
    }[],
    [key: string]: string | number | ObjType | (number | string | ObjType)[] | null | undefined,
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

export type TypeSale = {
    sumDocument: string | number,
    accumulationBonus: string | number
    spendBonus: string | number,
    cash: string | number,
    cashless: string | number,
    dateDocument: string | number,
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
    }
    products: {
        productTitle: string,
        productGuid: string,
        priceRetail: number,
        quantity: string | number,
        spendBonus: string | number,
        accumulationBonus: string | number,
        discount: string | number
    }[]
}

export type TypeRetailItem = {
    guid: string,
    product: { guid: string, priceRetail: number, count: number, [key: string]: string | number }[],
    priceRetail?: number,
    countLast?: number,
    weekDayTime?: string | null | undefined,
    [key: string]: string | number | number[] | ObjType | ObjType[] | undefined | null
}

export type TypeisCity = {
    guid: string,
    title: string,
    [key: string]: string | number | null | ObjType | (string | number | ObjType)[]
}

export type TypePromoItems = { type: string, courses?: any[], promoItems: Product[] }

export type Predictor = { endOfWord: boolean | string, pos: number | string, text: string[] }

export interface StateTypes {
    cities: TypeisCity[],
    regions: {
        regionGuid: string,
        regionTitle: string,
        cities: { guid: string, title: string }[]
    }[],
    loading: number,
    loadingFavorites: number,
    error: null | string,
    errorAuth: null | string,
    isCity: TypeisCity,
    retailsCity: retailCity[],
    cart: CartItemType[],
    favorites: { guid: string, [key: string]: string | number | null }[],
    productsFromSearch: { guid: string, product: string, [key: string]: string | number }[],
    countProductsSearch: null | number,
    productInfo: string | TypeProductInfo,
    cartItems: TypeProductInfo[],
    retailsArr: TypeRetailItem[],
    selectedRetail: null | string
    isPopupLocation: boolean,
    TOKEN: null | { accessToken: string, refreshToken: string },
    userData: { [key: string]: string | number | boolean | null | ObjType[] } | null,
    catalog: null | CategoryElement,
    activeCategory: null | CategoryElement,
    productsToCategory: { guid: string, product: string, [key: string]: string | number | null }[],
    countProductsCategory: null | number,
    sales: TypeSale[],
    productSearch: string,
    requestFromSearchPanelThisTime: boolean,
    internetSales: internetSale[],
    statusRequestRepeatOrder: 'executed' | 'failure' | '',
    promoItems: null | TypePromoItems,
    isDelCartItem: boolean,
    predictor: null | Predictor,
    activePromoGroup: { name: string, arrPromo: { [key: string]: any }[] }

    itemsForPromoBlock1: TypeProductInfo[],
    seasonItemsForPromoBlock2: TypeProductInfo[],
    popularItemsForPromoBlock3: TypeProductInfo[],
    idFetchPromo: null | number,
    isPopupLogin: boolean
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

export type TypeResponseCategoriesElement = { guid: string, parent: string | null, title: string }

export type TypeResponseSale = {
    sumDocument: string | number,
    accumulationBonus: string | number
    spendBonus: string | number,
    cash: string | number,
    cashless: string | number,
    dateDocument: string | number,

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
    analogues: Product[],
    [key: string]: string | number | ObjType | ObjType[]
}

export interface CategoryElement {
    child: CategoryElement[],
    historyGuid: string[],
    guid: string,
    title: string,
    parent: string | null,

    _getChildrens(): void
}

export type PromoItemsForCart = {
    isBuy: boolean,
    count?: number,
    countLast: number,
    id: string | number,
    title: string,
    maker: string,
    img: any,
    minPrice: number | null,
    classStyle?: string,

    onIncrement(event?: React.MouseEvent): void,
    onDecrement(event?: React.MouseEvent): void
    promo: boolean,
}
