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
  // console.log('я в ACTIONS', retailsCity)
  return {
    type: 'FETCH_RETAILS_CITY_SUCCESS',
    payload: retailsCity
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

export {
  fetchCities, setIsCity, retailsCityLoaded, addedToCart, itemRemovedFromCart, allItemRemovedFromCart
}