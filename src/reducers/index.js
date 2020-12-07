const initialState = {
  cities: [],
  regions: [],
  loading: true,
  error: null,
  isCity: JSON.parse(localStorage.getItem("city")) ? JSON.parse(localStorage.getItem("city"))[0] : {
    guid: "c384a061-7641-4605-a340-afb825fdcb70",
    title: "Абакан"
  },
  retailsCity: [],
  cart: [],
  favorites: [],
  productsFromSearch: [],
  productInfo: '',
  cartItems: [],
  retailsArr: [],
  selectedRetail: null,
  isRetailAllProduct: true,
  isPopupLocation: false,
  TOKEN: null,
  userData: null,
  catalog: null,
  activeCategory: null,
  productsToCategory: [],
}

const upgradeRetailItems = (array, cart) => {
  const retailItems = array.map((item) => {
    const sum = item.product.reduce((accumulator, currentValue) => {
      const count = cart.find(item => item.itemId === currentValue.guid).count
      return ((currentValue.priceRetail * count) + accumulator)
    }, 0)
    return {
      ...item,
      sum: +sum.toFixed(2)
    }
  })
  return retailItems.sort((a, b) => a.sum > b.sum ? 1 : -1)
}

const updateCartItems = (cart, item, idx) => {
  if (item.count === 0) {
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

const updateCartItem = (itemId, item = {}, quantity) => {
  const {count = 0} = item;
  return {
    itemId,
    count: count + quantity
  }
};

const updateOrder = (state, itemId, quantity) => {
  // берём значения из localStorage, вносим изменения, записываем в cart и записываем опять в localStorage
  // таким образом у нас всегда при всех изменениях в localStorage актуальные значения, на которые можно опираться.
  let oldCart = [...state.cart]
  if (localStorage.getItem("cart")) {
    oldCart = JSON.parse(localStorage.getItem("cart"))
  }

  const itemIndex = oldCart.findIndex((item) => item.itemId === itemId);
  const item = oldCart[itemIndex];
  const newItem = updateCartItem(itemId, item, quantity);
  const cartOrder = updateCartItems(oldCart, newItem, itemIndex)
  localStorage.setItem('cart', JSON.stringify(cartOrder))
  return {
    ...state,
    cart: cartOrder
  }
};

function isEmpty(obj) {
  for (let key in obj) {
    return false;
  }
  return true;
}

const reducer = (state = initialState, action) => {

  console.log(action.type, action.payload);
  switch (action.type) {

    case 'SET_CATALOG':
      return {
        ...state,
        catalog: action.payload,
        loading: false,
        error: null
      }

    case 'ADDED_TO_FAVORITES':
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
        retailsCity: action.payload,
        loading: false,
        error: null
      };

    case 'SET_PRODUCTS_TO_CATEGORY':
      return {
        ...state,
        productsToCategory: action.payload,
        loading: false,
        error: null
      }

    case 'SET_CITY':
      return {
        ...state,
        isCity: action.payload,
        loading: false,
        error: null
      };

    case 'ON_POPUP_LOCATION':
      return {
        ...state,
        isPopupLocation: action.payload
      }

    case 'SET_ACTIVE_CATEGORY':
      return {
        ...state,
        activeCategory: action.payload
      }

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
        error: null
      };

    // подробная информация о товаре
    case 'LOADING_PRODUCT_INFO':
      return {
        ...state,
        productInfo: action.product,
        loading: false
      };

    case 'SET_CART_ITEMS':
      // Если запрос failure возвращается пустой массив - убираем их из массива
      const newCardItems = action.payload.filter(item => Boolean(item.length !== 0))
      const retailsArr = []
      if (newCardItems.length) {
        newCardItems.forEach((item, index) => {
          if (!isEmpty(item)) {
            item.retails.forEach(retail => {
              // копируем товар
              const productItem = {...item} // в итоге - это товар без списка аптек

              // удаляем из него список аптек
              delete productItem.retails

              // добавляем цену товара в текущей аптеке
              productItem.priceRetail = retail.priceRetail

              // добавляем количество товара из корзины в продукт
              productItem.count = state.cart.find(cartItem => cartItem.itemId === item.guid).count

              // копируем аптеку
              const retailItem = {...retail}

              // удаляем цену товара
              delete retailItem.priceRetail
              retailItem.weekDayTime = retailItem.weekDayTime.match(/\d\d:\d\d/g).join(' - ')

              // добавляем в аптеку данные товара без списка аптек
              retailItem.product = []
              retailItem.product.push(productItem)

              if (retailsArr.length) {

                // если это не первая итерация - проверяем, есть ли уже такая аптека в списке
                const someRetail = retailsArr.some(i => i.guid === retail.guid)
                if (someRetail) {

                  // если аптека уже есть, проверяем, есть ли в ней уже данный товар
                  const itemRetail = retailsArr.find(itemRetail => itemRetail.guid === retail.guid)
                  const someProduct = itemRetail.product.some(pdItem => pdItem.guid === item.guid)
                  if (someProduct) {

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
          } else newCardItems.splice(index, 1)
        })
      } else {
        return {
          ...state,
          cartItems: [],
          retailsArr: [],
          selectedRetail: null,
          isRetailAllProduct: true,
          loading: false,
          error: null
        }
      }
      const fullProductArr = retailsArr.filter(item => item.product.length === state.cart.length)
      let selectedRetail = null
      if (fullProductArr.length > 0) {
        selectedRetail = fullProductArr[0].guid
      }
      let isRetailAllProduct = selectedRetail !== null;
      if (retailsArr.length) {
        if (retailsArr.length > 1) {
          const retailsByNumberOfProducts = retailsArr.sort((a, b) => a.product.length < b.product.length ? 1 : -1)
          selectedRetail = retailsByNumberOfProducts[0].guid
        } else selectedRetail = retailsArr[0].guid
      }

      return {
        ...state,
        cartItems: newCardItems,
        retailsArr: [...upgradeRetailItems(retailsArr, state.cart)],
        selectedRetail,
        isRetailAllProduct,
        loading: false,
        error: null
      }

    case 'ON_SELECT_RETAIL':
      return {
        ...state,
        selectedRetail: action.payload,
        loading: false,
        error: null
      }

    case 'DEL_CART_ITEM':
      return {
        ...state,
        cartItems: [],
        retailsArr: [],
        error: null
      }

    //запрос списка продуктов из поисковой строки
    case 'FETCH_PRODUCTS_FROM_SEARCH_SUCCESS':
      return {
        ...state,
        productsFromSearch: action.payload,
        loading: false,
        error: null
      };

    //запрос списка городов
    case 'FETCH_CITIES_SUCCESS':

      const regions = [...state.regions]
      action.payload.forEach(itemCity => {
        const region = {}
        region.regionGuid = itemCity.regionGuid
        region.regionTitle = itemCity.regionTitle
        region.cities = [{guid: itemCity.guid, title: itemCity.title}]

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
            const indexCity = regions[indexRegions].cities.findIndex(cityEl => cityEl.guid === itemCity.guid)
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
        loading: false,
        error: null
      };

    case 'FETCH_FAILURE' :
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    case 'CLEAR_ERROR' :
      return {
        ...state,
        error: null
      }

    case 'CLEAR_CART':
      return {
        ...state,
        cart: []
      }

    case 'TOKEN':
      return {
        ...state,
        TOKEN: action.payload,
        loading: false,
        error: null
      }

    case 'USER_DATA':
      return {
        ...state,
        userData: action.payload,
        loading: false,
        error: null
      }

    case 'LOGOUT':
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