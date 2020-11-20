export default class StoreService {

  // Список городов
  async getCities() {
    const res = await fetch('http://172.16.17.7:5000/Cities',
      {
        method: 'GET',
        headers: {
          accept: 'application/json'
        }
      }
    )
    if (!res.ok) {
      throw new Error(`Не могу выполнить fetch, статус ошибки: ${res.status}`)
    }
    return await res.json();
  }


  // Список торговых точек в городе
  async getRetailsCity(cityId) {
    const res = await fetch(`http://172.16.17.7:5000/Retails/${cityId}`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json'
        }
      }
    )
    if (!res.ok) {
      throw new Error(`Не могу выполнить fetch, статус ошибки: ${res.status}`)
    }
    return await res.json();
  }


  // список позиций из поискового запроса
  async getProductsFromSearch(productName, cityId) {
    const res = await fetch(`http://172.16.17.7:5000/Products/byName?str=${productName}&cityGuid=${cityId}`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json'
        }
      }
    )
    if (!res.ok) {
      throw new Error(`Не могу выполнить fetch, статус ошибки: ${res.status}`)
    }
    return await res.json();
  }

  // подробная информация о товаре
  async getProductInfo(productId, cityId) {
    const res = await fetch(`http://172.16.17.7:5000/Products/byGuid?productGuid=${productId}&cityGuid=${cityId}`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json'
        }
      }
    )
    if (!res.ok) {
      throw new Error(`Не могу выполнить fetch, статус ошибки: ${res.status}`)
    }
    return await res.json();
  }
}