import {
    ActionTypes,
    CartItemType, internetSale, ObjType,
    productInfo,
    retailCity,
    tCatalog,
    TypeItemsForPromoBlock,
    TypeSetCartItem
} from "../types";

export interface ActionItemsForPromoBlock {
    type: ActionTypes.SET_ITEMS_FOR_PROMOBLOCK_1 | ActionTypes.SET_SEASON_ITEMS_FOR_PROMOBLOCK_2 | ActionTypes.SET_POPULAR_ITEMS_FOR_PROMOBLOCK_3,
    payload: TypeItemsForPromoBlock
}

export interface ActionStatusRequestRepeatOrder {
    type: ActionTypes.SET_STATUS_REQUEST_REPEAT_ORDER,
    payload: string
}

export interface ActionResetLoading {
    type: ActionTypes.LOADING_RESET
}

export interface ActionSetError {
    type: ActionTypes.FETCH_FAILURE,
    payload: any
}

export interface ActionsSetErrorAuth {
    type: ActionTypes.AUTH_FAILURE,
    payload: any
}

export interface ActionClearError {
    type: ActionTypes.CLEAR_ERROR
}

export interface ActionLoadingTrue {
    type: ActionTypes.LOADING
}

export interface ActionLoadingFalse {
    type: ActionTypes.LOADING_OFF
}

export interface ActionDelCartItems {
    type: ActionTypes.DEL_CART_ITEM
}

export interface ActionSetStatusRequestOrder {
    type: ActionTypes.SET_CART_ITEMS,
    payload: TypeSetCartItem[]
}

export interface ActionOnPopupLocation {
    type: ActionTypes.ON_POPUP_LOCATION,
    payload: boolean
}


export interface Action_setCity {
    type: ActionTypes.SET_CITY,
    payload: { guid: string, title: string, [key: string]: any }
}

export interface Action_fetchRetailsCity {
    type: ActionTypes.FETCH_RETAILS_CITY_SUCCESS,
    payload: retailCity[]
}

export interface ActionAddedToCart {
    type: ActionTypes.ITEM_ADDED_TO_CART,
    payload: string
}

export interface ActionItemRemovedFromCart {
    type: ActionTypes.ITEM_REMOVED_FROM_CART,
    payload: string
}

export interface ActionAllItemRemovedFromCart {
    type: ActionTypes.ITEM_REMOVED_FROM_CART,
    payload: string
}

export interface ActionSetCountItemCart {
    type: ActionTypes.SET_COUNT_ITEM_CART,
    payload: { idProduct: string, delta: number }
}

export interface ActionRewriteCart {
    type: ActionTypes.REWRITE_CART,
    payload: CartItemType[]
}

export interface ActionProductsFromSearchLoaded {
    type: ActionTypes.FETCH_PRODUCTS_FROM_SEARCH_SUCCESS,
    payload: {
        products: { guid: string, product: string, [key: string]: string | number }[],
        count: null | number,
        productSearch: string
    }
}

export interface ActionLoadingProductInfo {
    type: ActionTypes.LOADING_PRODUCT_INFO,
    payload: productInfo
}

export interface ActionOnSelectRetail {
    type: ActionTypes.ON_SELECT_RETAIL,
    payload: string
}

export interface ActionClearCart {
    type: ActionTypes.CLEAR_CART,
}

export interface ActionSetToken {
    type: ActionTypes.TOKEN,
    payload: { accessToken: string, refreshToken: string }
}

export interface ActionSetFavoritesToStore {
    type: ActionTypes.SET_FAVORITES_TO_STORE,
    payload: { guid: string, [key: string]: string | number | null }[]
}

export interface ActionAddFavoritesToStore {
    type: ActionTypes.ADD_FAVORITES_TO_STORE,
    payload: { guid: string, [key: string]: string | number | null }
}

export interface ActionDelFavoritesToStore {
    type: ActionTypes.DELETE_FAVORITES_TO_STORE,
    payload: string
}

export interface ActionLoadingFavorites {
    type: ActionTypes.LOADING_FAVORITES,
}

export interface ActionLogout {
    type: ActionTypes.LOGOUT,
}

export interface ActionSetActiveCategory {
    type: ActionTypes.SET_ACTIVE_CATEGORY,
    payload: tCatalog
}

export interface Action_setProductsToCategory {
    type: ActionTypes.SET_PRODUCTS_TO_CATEGORY,
    payload: {
        products: { guid: string, product: string, [key: string]: string | number | null }[],
        count: number,
    }
}

export interface ActionSetUserData {
    type: ActionTypes.USER_DATA,
    payload: { [key: string]: string | number | boolean | null | ObjType[] }
}

export interface Action_setSales {
    type: ActionTypes.SET_SALES,
    payload: any[]
}

export interface Action_setInternetSales{
    type: ActionTypes.REQUEST_INTERNET_SALES,
    payload: internetSale[]
}

export interface ActionSetPromoItems{
    type: ActionTypes.SET_PROMO_ITEMS,
    payload: any
}

export interface ActionOnRequestFromSearchPanel{
    type: ActionTypes.ON_REQUEST_FROM_SEARCH_PANEL,
}

export interface ActionOffRequestFromSearchPanel{
    type: ActionTypes.OFF_REQUEST_FROM_SEARCH_PANEL,
}

export type ActionType = (
    ActionItemsForPromoBlock
    | ActionStatusRequestRepeatOrder
    | ActionResetLoading
    | ActionsSetErrorAuth
    | ActionClearError
    | ActionLoadingTrue
    | ActionLoadingFalse
    | ActionDelCartItems
    | ActionSetStatusRequestOrder
    | ActionOnPopupLocation
    | Action_setCity
    | Action_fetchRetailsCity
    | ActionAddedToCart
    | ActionItemRemovedFromCart
    | ActionAllItemRemovedFromCart
    | ActionSetCountItemCart
    | ActionRewriteCart
    | ActionProductsFromSearchLoaded
    | ActionLoadingProductInfo
    | ActionOnSelectRetail
    | ActionClearCart
    | ActionSetToken
    | ActionSetFavoritesToStore
    | ActionAddFavoritesToStore
    | ActionDelFavoritesToStore
    | ActionLoadingFavorites
    | ActionLogout
    | ActionSetActiveCategory
    | Action_setProductsToCategory
    | ActionSetUserData
    | Action_setSales
    | Action_setInternetSales
    | ActionSetPromoItems
    | ActionOnRequestFromSearchPanel
    | ActionOffRequestFromSearchPanel
    )