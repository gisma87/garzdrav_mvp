const initialState = {
  cities: [],
  loading: true,
  error: null,
  isCity: {
    "guid": "c384a061-7641-4605-a340-afb825fdcb70",
    "title": "Абакан"
  },
  retailsCity: [],
  cart: [],
  favorites: [5, 6],
  productsFromSearch: [],
  productInfo: '',
  cartItems: []
}

const updateCartItems = (cart, item, idx) => {
  if (item.count === 0) {
    return [
      ...cart.slice(0, idx),
      ...cart.slice(idx + 1)
    ];
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

const updateCartItem = (itemId, item = {}, quantity) => {
  const {count = 0} = item;
  return {
    itemId,
    count: count + quantity
  }
};

const updateOrder = (state, itemId, quantity) => {
  const itemIndex = state.cart.findIndex((item) => item.itemId === itemId);
  const item = state.cart[itemIndex];
  const newItem = updateCartItem(itemId, item, quantity);
  return {
    ...state,
    cart: updateCartItems(state.cart, newItem, itemIndex)
  }
};

const reducer = (state = initialState, action) => {

  console.log(action.type, action.payload);
  switch (action.type) {

    case 'ADDED_TO_FAVORITS':
      return {
        ...state,
        favorites: [
          ...state.favorites,
          action.payload
        ]
      };

    case 'FETCH_RETAILS_CITY_SUCCESS':
      return {
        ...state,
        retailsCity: action.payload
      };
    case 'SET_CITY':
      return {
        ...state,
        isCity: action.payload
      };
    // case 'ITEM_ADDED_TO_CART':
    //   const itemId = action.payload;
    //   const itemIndex = state.cart.findIndex((item) => item.itemId === itemId);
    //   const item = state.cart[itemIndex];
    //   let newItem;
    //   if (item) {
    //     newItem = {
    //       ...item,
    //       count: item.count + 1
    //     }
    //   } else {
    //     newItem = {
    //       itemId,
    //       count: 1
    //     }
    //   }
    //
    //   if (itemIndex < 0) {
    //     return {
    //       ...state,
    //       cart: [
    //         ...state.cart,
    //         newItem
    //       ]
    //     };
    //   } else {
    //     return {
    //       ...state,
    //       cart: [
    //         ...state.cart.slice(0, itemIndex),
    //         newItem,
    //         ...state.cart.slice(itemIndex + 1)
    //       ]
    //     };
    //   }


    case 'ITEM_ADDED_TO_CART':
      return updateOrder(state, action.payload, 1);

    case 'ITEM_REMOVED_FROM_CART':
      return updateOrder(state, action.payload, -1);

    case 'ALL_ITEM_REMOVED_FROM_CART':
      const item = state.cart.find(({itemId}) => itemId === action.payload);
      return updateOrder(state, action.payload, -item.count);

    case 'REWRITE_CART':
      return {
        ...state,
        cart: action.payload
      };

    case 'LOADING' :
      return {
        ...state,
        loading: true,
      };

    // подробная информация о товаре
    case 'LOADING_PRODUCT_INFO':
      return {
        ...state,
        productInfo: action.product,
        loading: false
      };

    // записать в массив cartItems объекты товаров из cart
    case 'SET_CART_ITEM':
      const itemInCart = state.cartItems.findIndex((item) => item.guid === action.product.guid);
      if (itemInCart >= 0) {
        return {
          ...state,
          loading: false
        }
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, action.product],
          loading: false
        }
      }

    //запрос списка продуктов из поисковой строки
    case 'FETCH_PRODUCTS_FROM_SEARCH_SUCCESS':
      return {
        ...state,
        productsFromSearch: action.payload,
        loading: false,
      };

    //запрос списка городов
    case 'FETCH_CITIES_SUCCESS':
      return {
        ...state,
        cities: action.payload,
        loading: false,
        error: null
      };
    case 'FETCH_CITIES_REQUESTED' :
      return {
        ...state,
        cities: [],
        loading: true,
        error: null
      };
    case 'FETCH_CITIES_FAILURE' :
      return {
        ...state,
        cities: [],
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
}

export default reducer;