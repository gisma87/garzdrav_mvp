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
  cartItems: [],
  retailsArr: [],
  selectedRetail: null
}

const upgradeRetailItems = (array) => {
  const retailItems = array.map((item) => {
    return {
      ...item,
      sum: item.product.reduce((accumulator, currentValue) => {
        return currentValue.priceRetail + accumulator
      }, 0)
    }
  })
  return retailItems.sort((a, b) => a.sum > b.sum ? 1 : -1)
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

    case 'SET_CART_ITEMS':

      const retailsArr = [...state.retailsArr]
      action.payload.forEach(item => {
        item.retails.forEach(retail => {
          // копируем товар
          const productItem = {...item} // в итоге - это товар без списка аптек

          // удаляем из него список аптек
          delete productItem.retails

          // добавляем цену товара текущей аптеке
          productItem.priceRetail = retail.priceRetail

          // копируем аптеку
          const retailItem = {...retail}

          // удаляем цену товара
          delete retailItem.priceRetail
          retailItem.weekDayTime = retailItem.weekDayTime.match(/\d\d:\d\d/g).join(' - ')

          // добавляем в аптеку данные товара без списка аптек
          retailItem.product = []
          retailItem.product.push(productItem)

          if (retailsArr.length > 0) {
            // если это не первая итерация - проверяем, есть ли уже такая аптека в списке
            const some = retailsArr.some(i => i.guid === retail.guid)
            if (some) {
              // если аптека уже есть, проверяем, есть ли в ней уже данный товар
              let a = false
              retailsArr.forEach(retailArrItem => {
                if (retailArrItem.product.some(pdItem => pdItem.guid === item.guid)) {
                  a = true
                }
              })
              if (a) {
                // если товар есть в этой аптеке, выходим
                return
              } else {
                // если товара ещё нет в этой аптеке - добавляем
                const index = retailsArr.findIndex((i => i.guid === retail.guid))
                retailsArr[index].product.push(productItem)
              }

            } else {
              retailsArr.push(retailItem)
            }
          } else {
            retailsArr.push(retailItem)
          }
        })
      })
      const fullProductArr = retailsArr.filter(item => item.product.length === state.cart.length)
      let selectedRetail = null
      if (fullProductArr.length > 0) {
        selectedRetail = fullProductArr[0].guid
      }

      return {
        ...state,
        cartItems: action.payload,
        retailsArr: [...upgradeRetailItems(retailsArr)],
        selectedRetail,
        loading: false
      }

    case 'ON_SELECT_RETAIL':
      return {
        ...state,
        selectedRetail: action.payload
      }

    // записать в массив cartItems объекты товаров из cart
    case 'SET_CART_ITEM':
    // const itemInCart = state.cartItems.findIndex((item) => item.guid === action.product.guid);
    // if (itemInCart >= 0) {
    //   return {
    //     ...state,
    //     loading: false
    //   }
    // } else {
    // const retailsArr = [...state.retailsArr]
    // action.payload.forEach((item => {
    //   item.retails.forEach(retail => {
    //     // копируем товар
    //     const productItem = {...item} // в итоге - это товар без списка аптек
    //     // удаляем из него список аптек
    //     delete productItem.retails
    //     // добавляем цену товара текущей аптеке
    //     productItem.priceRetail = retail.priceRetail
    //     // копируем аптеку
    //     const retailItem = {...retail}
    //     // удаляем цену товара
    //     delete retailItem.priceRetail
    //
    //     // добавляем в аптеку данные товара без списка аптек
    //     retailItem.product = []
    //     retailItem.product.push(productItem)
    //
    //     if (retailsArr.length > 0) {
    //       // если это не первая итерация - проверяем, есть ли уже такая аптека в списке
    //       const some = retailsArr.some(i => i.guid === retail.guid)
    //       if (some) {
    //         // если аптека уже есть, проверяем, есть ли в ней уже данный товар
    //         let a = false
    //         retailsArr.forEach(retailArrItem => {
    //           if (retailArrItem.product.some(pdItem => pdItem.guid === item.guid)) {
    //             a = true
    //           }
    //         })
    //         if (a) {
    //           // если товар есть в этой аптеке, выходим
    //           return
    //         } else {
    //           // если товара ещё нет в этой аптеке - добавляем
    //           const index = state.retailsArr.findIndex((i => i.guid === retail.guid))
    //           retailsArr[index].product.push(productItem)
    //         }
    //
    //       } else {
    //         retailsArr.push(retailItem)
    //       }
    //     } else {
    //       retailsArr.push(retailItem)
    //     }
    //   })
    // }))

    // }

    // записать массив аптек с товаром
    case 'SET_RETAILS_ARR':
      return {
        ...state,
        retailsArr: action.payload
      }

    case 'DEL_CART_ITEM':
      return {
        ...state,
        cartItems: [],
        retailsArr: []
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