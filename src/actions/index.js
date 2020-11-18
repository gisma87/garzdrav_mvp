import axios from "axios";

const pillsLoaded = (cities) => {
  return {
    type: 'FETCH_CITIES_SUCCESS',
    payload: cities
  }
}

const pillsRequested = () => {
  return {
    type: 'FETCH_CITIES_REQUESTED'
  }
}

const pillsError = (error) => {
  return {
    type: 'FETCH_CITIES_FAILURE',
    payload: error
  }
}

const setIsCity = (isCity) => {
  return {
    type: 'SET_CITY',
    payload: isCity
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

const retailsCityLoaded = (retailsCity) => {
  return {
    type: 'FETCH_RETAILS_CITY_SUCCESS',
    payload: retailsCity
  }
}

const rewriteCart = (cart) => {
  return {
    type: 'REWRITE_CART',
    payload: cart
  }
}

const addedToFavorits = (item) => {
  return {
    type: 'ADDED_TO_FAVORITS',
    payload: item
  }
}

// const fetchRetailsCity = (storeService, dispatch, cityId) => () => {
//   // console.log('я в ACTIONS')
//   storeService.getRetailsCity(cityId)
//     .then((data) => dispatch(retailsCityLoaded(data)))
//     .catch((error) => console.log('ОШИБКА в fetchRetailsCity ', error));
// }

const fetchCities = (storeService, dispatch) => () => {
  dispatch(pillsRequested());
  storeService.getCities()
    .then((data) => dispatch(pillsLoaded(data)))
    .catch((error) => dispatch(pillsError(error)));
}


//запрос ProductsFromSearch
const loadingTrue = () => {
  return {
    type: 'LOADING'
  }
}

const ProductsFromSearchLoaded = (products) => {
  return {
    type: 'FETCH_PRODUCTS_FROM_SEARCH_SUCCESS',
    payload: products
  }
}

const fetchProductInfo = (productId, cityId) => {
  return async dispatch => {
    dispatch(loadingTrue())
    try {
      const response = await axios.get(`http://172.16.17.7:5000/Products/byGuid?productGuid=${productId}&cityGuid=${cityId}`)

      dispatch(loadingProductInfo(response.data))
    } catch (e) {
      console.log(e)
    }
  }
}

const setRetailsArr = (retailsArr) => {
  return {
    type: 'SET_RETAILS_ARR',
    payload: retailsArr
  }
}

const setCartItem = (product) => {
  return {
    type: 'SET_CART_ITEM',
    product
  }
}

const fetchCartItem = (productId) => {
  return async (dispatch, getState) => {
    dispatch(loadingTrue())
    const {isCity} = getState()
    try {
      const response = await axios.get(`http://172.16.17.7:5000/Products/byGuid?productGuid=${productId}&cityGuid=${isCity.guid}`)
      dispatch(setCartItem(response.data))
    } catch (e) {
      console.log(e)
    }
  }
}

const delCartItems = () => {
  return {
    type: 'DEL_CART_ITEM'
  }
}

const fetchCartItems = (funcSetStateToCart) => {
  return (dispatch, getState) => {
    const {cart} = getState()
    dispatch(delCartItems())

    if (cart.length > 0) {
      cart.forEach(product => {
        dispatch(fetchCartItem(product.itemId))
      })
    }
  }
}

const convertRetailsArrFromCartItems = () => {
  return (dispatch, getState) => {
    const {cartItems} = getState()
    console.log('cardItems: равно: ', cartItems)
    const retailsArr = []
    cartItems.forEach(cartItem => {
      cartItem.retails.forEach(retail => {
        // копируем товар
        const productItem = {...cartItem} // в итоге - это товар без списка аптек
        // удаляем из него список аптек
        delete productItem.retails
        // копируем аптеку
        const retailItem = {...retail}

        // добавляем в аптеку данные товара без списка аптек
        retailItem.product = []
        retailItem.product.push(productItem)

        if (retailsArr.length > 0) {
          // если это не первая итерация - проверяем, есть ли уже такая аптека в списке
          const some = retailsArr.some(i => i.guid === retail.guid)
          if (some) {
            // если аптека уже есть, проверяем, есть ли в ней уже данный товар
            // const productSome = retail.product.some(i => i.guid === item.guid)
            let a = false
            retailsArr.forEach(retailArrItem => {
              if (retailArrItem.product.some(pdItem => pdItem.guid === cartItem.guid)) {
                a = true
              }
            })

            // const productSome = newArr.some(i => i.guid === item.guid)
            if (a) {
              // если товар есть в этой аптеке, выходим
              return
            } else {
              // если товара ещё нет в этой аптеке - добавляем
              // retail.product.push(productItem)
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

    dispatch(setRetailsArr(retailsArr))
  }
}

const loadingProductInfo = (product) => {
  return {
    type: 'LOADING_PRODUCT_INFO',
    product
  }
}

const fetchProductsFromSearch = (storeService, dispatch) => () => {
  dispatch(loadingTrue());
  storeService.getProductsFromSearch()
    .then((data) => dispatch(ProductsFromSearchLoaded(data)))
    .catch((error) => console.log(error));
}

export {
  fetchCities,
  setIsCity,
  retailsCityLoaded,
  addedToCart,
  itemRemovedFromCart,
  allItemRemovedFromCart,
  rewriteCart,
  addedToFavorits,
  fetchProductsFromSearch,
  loadingTrue,
  ProductsFromSearchLoaded,
  fetchProductInfo,
  fetchCartItems,
}