import {ActionTypes, CartItemType, StateTypes} from "../types";
import {ActionType} from "../actions/actionType";
import {sortAndFilterCartItems} from "./utilsForReducer";

let cityLocalStorage = null

if (localStorage.getItem("city")) {
    const result = JSON.parse(localStorage.getItem("city") as string)
    if (result.length) {
        cityLocalStorage = result[0]
    }
}

const initialState: StateTypes = {
    cities: [], // список всех городов
    regions: [], // список всех регионов
    loading: 0,
    loadingFavorites: 0,
    error: null,
    errorAuth: null,
    isCity: cityLocalStorage ? cityLocalStorage : {
        guid: "c384a061-7641-4605-a340-afb825fdcb70",
        title: "Абакан"
    },
    retailsCity: [], // торговые точки города
    cart: [], // корзина
    favorites: [],
    productsFromSearch: [], // товары из текущего запроса
    countProductsSearch: null, // число товаров по текущему запросу
    productInfo: '',
    cartItems: [], // товары в корзине
    retailsArr: [], // массив аптек - формируется из cartItems
    selectedRetail: null, // текущая выбранная аптека
    // isRetailAllProduct: true, // есть ли аптеки с полным ассортиментом товара из корзины
    isPopupLocation: false, // статус popup о подтверждении автовыбора города
    TOKEN: null,
    userData: null,
    activeBonusCard: null,
    catalog: null,
    activeCategory: null, // текущая категория в каталоге
    productsToCategory: [], // товары из текущей категории каталога
    countProductsCategory: null, // число товаров в категории
    sales: [], // история покупок
    productSearch: '', // string - значение последнего поискового запроса
    requestFromSearchPanelThisTime: false, // true, если запрос сделан из searchPanel
    internetSales: [], // интернет заказы
    statusRequestRepeatOrder: '',
    promoItems: null,
    isDelCartItem: false, // ставиться в true, если удалены item's из cart из-за того, что сервер по ним не ответил.
    itemsForPromoBlock1: [], // собранный массив, из наших картинок и данных с базы - акционные товары
    seasonItemsForPromoBlock2: [], // собранный массив, из наших картинок и данных с базы - сезонные товары
    popularItemsForPromoBlock3: [],
    predictor: null,
    activePromoGroup: {name: 'Акционные товары', arrPromo: []},
    idFetchPromo: null,
    isPopupLogin: false
}

const updateCartItems = (cart: CartItemType[], item: CartItemType, idx: number) => {
    if ((idx === -1) && (item.count < 1)) {
        return [...cart]
    }

    if (item.count < 1) {
        return [
            ...cart.slice(0, idx),
            ...cart.slice(idx + 1)
        ]
    }

    if (idx === -1) {
        return [
            ...cart,
            item
        ];
    }

    return [
        ...cart.slice(0, idx),
        item,
        ...cart.slice(idx + 1)
    ];
}

const updateCartItem = (itemId: string, item: CartItemType | null, quantity: number): CartItemType => {
    const count = item ? item.count : 0;
    return {
        itemId,
        count: count + quantity
    }
};

const updateOrder = (state: StateTypes, itemId: string, quantity: number) => {
    // берём значения из localStorage, вносим изменения, записываем в cart и записываем опять в localStorage
    // таким образом у нас всегда при всех изменениях в localStorage актуальные значения, на которые можно опираться.
    let oldCart = [...state.cart]
    if (localStorage.getItem("cart")) {
        oldCart = JSON.parse(localStorage.getItem("cart") as string)
    }

    const itemIndex = oldCart.findIndex((item) => item.itemId === itemId);
    const item = oldCart[itemIndex] ?? null;
    const newItem = updateCartItem(itemId, item, quantity);
    const cartOrder = updateCartItems(oldCart, newItem, itemIndex)
    localStorage.setItem('cart', JSON.stringify(cartOrder))
    return {
        ...state,
        cart: cartOrder
    }
};

const reducer = (state = initialState, action: ActionType): StateTypes => {

    switch (action.type) {

        case ActionTypes.OPEN_POPOP_LOGIN:
            return {
                ...state,
                isPopupLogin: true
            }

        case ActionTypes.SET_ACTIVE_BONUS_CARD:
            return {
                ...state,
                activeBonusCard: action.payload
            }

        case ActionTypes.CLOSE_POPOP_LOGIN:
            return {
                ...state,
                isPopupLogin: false
            }

        case ActionTypes.SET_STATUS_REQUEST_REPEAT_ORDER:
            return (action.payload === ('executed' || 'failure' || ''))
                ? {
                    ...state,
                    statusRequestRepeatOrder: action.payload
                }
                : {...state, statusRequestRepeatOrder: ''}

        case ActionTypes.SET_ITEMS_FOR_PROMOBLOCK_1:

            return {
                ...state,
                itemsForPromoBlock1: action.payload
            }

        case ActionTypes.SET_SEASON_ITEMS_FOR_PROMOBLOCK_2:
            return {
                ...state,
                seasonItemsForPromoBlock2: action.payload
            }

        case ActionTypes.SET_POPULAR_ITEMS_FOR_PROMOBLOCK_3:
            return {
                ...state,
                popularItemsForPromoBlock3: action.payload
            }

        case ActionTypes.SET_ACTIVE_PROMO_GROUP:
            return {
                ...state,
                activePromoGroup: {name: action.payload.name, arrPromo: action.payload.arrPromo}
            }

        case ActionTypes.SET_PREDICTOR:
            return {
                ...state,
                predictor: action.payload
            }

        case ActionTypes.REQUEST_INTERNET_SALES:
            return {
                ...state,
                internetSales: action.payload,
                loading: (state.loading > 0) ? (state.loading - 1) : 0,
                error: null
            }

        case ActionTypes.ON_REQUEST_FROM_SEARCH_PANEL:
            return {
                ...state,
                requestFromSearchPanelThisTime: true
            }

        case ActionTypes.OFF_REQUEST_FROM_SEARCH_PANEL:
            return {
                ...state,
                requestFromSearchPanelThisTime: false
            }

        case ActionTypes.SET_CATALOG:
            return {
                ...state,
                catalog: action.payload,
                loading: (state.loading > 0) ? (state.loading - 1) : 0,
                error: null
            }

        case ActionTypes.SET_FAVORITES_TO_STORE:
            return {
                ...state,
                favorites: action.payload
            };

        case ActionTypes.ADD_FAVORITES_TO_STORE:
            const copyFavorites = [...state.favorites]
            copyFavorites.push(action.payload)
            return {
                ...state,
                favorites: copyFavorites,
                loadingFavorites: 0
            };

        case ActionTypes.SET_PROMO_ITEMS:
            return {
                ...state,
                promoItems: action.payload
            };

        case ActionTypes.DELETE_FAVORITES_TO_STORE:
            const copyFavoritesFromDelete = [...state.favorites]
            const delIndex = copyFavoritesFromDelete.findIndex(item => item.guid === action.payload)
            copyFavoritesFromDelete.splice(delIndex, 1)
            return {
                ...state,
                favorites: copyFavoritesFromDelete,
                loadingFavorites: 0,
            };

        case ActionTypes.FETCH_RETAILS_CITY_SUCCESS:
            return {
                ...state,
                retailsCity: action.payload,
                loading: (state.loading > 0) ? (state.loading - 1) : 0,
                error: null
            };

        case ActionTypes.SET_PRODUCTS_TO_CATEGORY:
            return {
                ...state,
                productsToCategory: action.payload.products,
                countProductsCategory: action.payload.count,
                loading: (state.loading > 0) ? (state.loading - 1) : 0,
                error: null
            }

        case ActionTypes.SET_SALES:
            return {
                ...state,
                sales: action.payload,
                loading: (state.loading > 0) ? (state.loading - 1) : 0,
                error: null
            }

        case ActionTypes.SET_CITY:
            return {
                ...state,
                isCity: action.payload,
                loading: (state.loading > 0) ? (state.loading - 1) : 0,
                error: null
            };

        case ActionTypes.ON_POPUP_LOCATION:
            return {
                ...state,
                isPopupLocation: action.payload
            }

        case ActionTypes.SET_ACTIVE_CATEGORY:
            return {
                ...state,
                activeCategory: action.payload
            }

        case ActionTypes.ITEM_ADDED_TO_CART:
            return updateOrder(state, action.payload, 1);

        case ActionTypes.ITEM_REMOVED_FROM_CART:
            return updateOrder(state, action.payload, -1);

        case ActionTypes.ALL_ITEM_REMOVED_FROM_CART:
            const item = state.cart.find(({itemId}) => itemId === action.payload);
            return item ? updateOrder(state, action.payload, -item.count) : state;

        case ActionTypes.SET_COUNT_ITEM_CART:
            return updateOrder(state, action.payload.idProduct, -action.payload.delta);

        case ActionTypes.REWRITE_CART:
            return {
                ...state,
                cart: action.payload
            };

        case ActionTypes.LOADING_FAVORITES :
            return {
                ...state,
                loadingFavorites: state.loadingFavorites + 1
            };

        case ActionTypes.LOADING :
            return {
                ...state,
                loading: state.loading + 1,
                error: null
            };

        case ActionTypes.LOADING_OFF:
            return {
                ...state,
                loading: (state.loading > 0) ? (state.loading - 1) : 0,
                error: null
            }

        case ActionTypes.LOADING_RESET:
            return {
                ...state,
                loading: 0
            }

        // подробная информация о товаре
        case ActionTypes.LOADING_PRODUCT_INFO:
            return {
                ...state,
                productInfo: action.payload,
                loading: (state.loading > 0) ? (state.loading - 1) : 0
            };

        case ActionTypes.SET_CART_ITEMS:
            return sortAndFilterCartItems(state, action.payload)

        case ActionTypes.FALSE_IS_DELETE_CART_ITEMS:
            return {
                ...state,
                isDelCartItem: false
            }

        case ActionTypes.SET_ID_FETCH_PROMO:
            return {
                ...state,
                idFetchPromo: action.payload
            }

        case ActionTypes.ON_SELECT_RETAIL:
            return {
                ...state,
                selectedRetail: action.payload,
                loading: (state.loading > 0) ? (state.loading - 1) : 0,
                error: null
            }

        case ActionTypes.DEL_CART_ITEM:
            return {
                ...state,
                cartItems: [],
                retailsArr: [],
                error: null
            }

        //запрос списка продуктов из поисковой строки
        case ActionTypes.FETCH_PRODUCTS_FROM_SEARCH_SUCCESS:
            return {
                ...state,
                productsFromSearch: action.payload.products,
                countProductsSearch: action.payload.count,
                productSearch: action.payload.productSearch,
                loading: (state.loading > 0) ? (state.loading - 1) : 0,
                error: null
            };

        //запрос списка городов
        case ActionTypes.FETCH_CITIES_SUCCESS:
            const regions = [...state.regions]
            action.payload.forEach((itemCity: {
                regionGuid: string;
                regionTitle: string;
                guid: string;
                title: string;
            }) => {
                const region = {
                    regionGuid: itemCity.regionGuid,
                    regionTitle: itemCity.regionTitle,
                    cities: [{guid: itemCity.guid, title: itemCity.title}]
                }

                // если массив ещё пуст
                if (!regions.length) {
                    regions.push(region)
                } else {
                    // иначе проверяем, есть ли элемент в массиве
                    const indexRegions = regions.findIndex(itemRegion => itemRegion.regionGuid === itemCity.regionGuid)
                    // если элемента нет - добавляем
                    if (indexRegions < 0) {
                        regions.push(region)
                    } else {
                        // иначе проверяем есть ли в данном элементе текущий город
                        const indexCity = regions[indexRegions].cities.findIndex((cityEl: { guid: string, title: string }) => cityEl.guid === itemCity.guid)
                        // если города нет - добавляем
                        if (indexCity < 0) {
                            regions[indexRegions].cities.push({guid: itemCity.guid, title: itemCity.title})
                        } else {
                            // иначе выходим - и город в регионе и регион в regions есть.
                            return
                        }
                    }
                }
            })

            return {
                ...state,
                cities: action.payload,
                regions,
                loading: (state.loading > 0) ? (state.loading - 1) : 0,
                error: null
            };

        case ActionTypes.FETCH_FAILURE :
            return {
                ...state,
                loading: (state.loading > 0) ? (state.loading - 1) : 0,
                error: action.payload
            };

        case ActionTypes.AUTH_FAILURE :
            return {
                ...state,
                loading: (state.loading > 0) ? (state.loading - 1) : 0,
                errorAuth: action.payload
            };

        case ActionTypes.CLEAR_ERROR :
            return {
                ...state,
                error: null
            }

        case ActionTypes.CLEAR_CART:
            return {
                ...state,
                cart: []
            }

        case ActionTypes.TOKEN:
            return {
                ...state,
                TOKEN: action.payload,
                loading: (state.loading > 0) ? (state.loading - 1) : 0,
                error: null
            }

        case ActionTypes.USER_DATA:
            return {
                ...state,
                userData: action.payload,
                loading: (state.loading > 0) ? (state.loading - 1) : 0,
                error: null
            }

        case ActionTypes.LOGOUT:
            return {
                ...state,
                TOKEN: null,
                userData: null
            }

        default:
            return state;
    }
}

export default reducer;