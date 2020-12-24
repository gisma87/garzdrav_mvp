import axios from "axios";

class ApiService {

  constructor() {
    this.URL = 'http://172.16.17.7:5000'
  }

  //подробная информация по товару - нужен id товара и id города
  async getProductInfo(productId, cityId) {
    const result = await axios.get(`${this.URL}/Products/byGuid?productGuid=${productId}&cityGuid=${cityId}`)
    return result.data
  }

  // запрос списка городов
  async getCities() {
    const result = await axios.get(`${this.URL}/Cities`)
    return result.data
  }

  // определение города и IP пользователя
  async getUserCity() {
    const resIP = await axios.get('https://api.ipify.org?format=json')
    const ip = resIP.data.ip
    const response = await axios.get(`https://suggestions.dadata.ru/suggestions/api/4_1/rs/iplocate/address?ip=${ip}&token=3403f978625b46f2052d4e9dbbf08eb6fa06ee19`)

    if (
      {}.hasOwnProperty.call(response.data, 'family') &&
      response.data.family.toLowerCase().indexOf('err')
    ) {
      throw new Error('Error: ', response.data)
    }

    const {location: {data: {city}}} = response.data;

    return {city, ip}
  }

  // Список торговых точек в городе
  async getRetailsCity(cityId) {
    const result = await axios.get(`${this.URL}/Retails/${cityId}`)
    return result.data
  }

  // запрос информации о пользователе по TOKEN из LocalStorage
  async getUserData(accessToken) {
    const response = await axios.get(`${this.URL}/Users`, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    })
    return response.data
  }

  // POST запрос TOKEN по паролю
  async authentication() {
    const result = await axios.post(`${this.URL}/Authentication/password`,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        phone: "9131996226",
        password: "password"
      })

    return result.data
  }

  // POST запрос refreshTOKEN
  async refreshToken(TOKEN) {
    const response = await axios.post(`${this.URL}/Authentication/refresh`,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        accessToken: TOKEN.accessToken,
        refreshToken: TOKEN.refreshToken
      })

    return response.data
  }

  // запрос категорий
  async getCategories() {
    const result = await axios.get(`${this.URL}/Categories`)
    return result.data
  }

  // строим каталог из списка категорий
  async buildCatalog() {
    const Categories = await this.getCategories()

    class NodeCategories {
      constructor(guid, title, parent = null, historyGuid = []) {
        this.guid = guid
        this.title = title
        this.parent = parent
        this.child = []
        this.historyGuid = [...historyGuid, guid]
        this.getChildrens()
      }

      getChildrens() {
        Categories.forEach(cat => {
          if (cat.parent === this.guid) {
            this.child.push(new NodeCategories(cat.guid, cat.title, cat.parent, this.historyGuid))
          }
        })
      }
    }

    const firstEl = Categories.find(item => item.parent == null)
    const grandNode = new NodeCategories(firstEl.guid, firstEl.title)
    console.log('grandNode', grandNode)
    return grandNode
  }

  // запрос списка покупок
  async getSales(TOKEN) {
    const response = await axios.get(`${this.URL}/Sales`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${TOKEN}`
        }
      })
    return response.data
  }

  // POST запрос сформированный заказ (отправка заказа)
  async sendOrder(order, TOKEN) {
    const response = await axios({
      method: 'post',
      url: `${this.URL}/Orders`,
      data: order,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKEN}`
      }
    })
    return response.data
  }

  // запрос списка интернет заказов
  async getOrder(TOKEN) {
    const response = await axios.get(`${this.URL}/Orders`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${TOKEN}`
        }
      })
    return response.data
  }

  // запрос товаров по параметрам
  async getProducts(options) {
    let {
      productName = null,
      cityId,
      quantity = 32,
      page = 1,
      order = null,
      categoryId = null
    } = options

    if (productName) productName = `str=${productName}`;
    if (categoryId) categoryId = `categoryGuid=${categoryId}`;
    if (order) order = `order=${order}`;
    cityId = `cityGuid=${cityId}`;
    quantity = `limit=${quantity}`;
    page = `page=${page}`;

    const optional = () => {
      let optionalParameters = []
      if (productName) optionalParameters.push(productName)
      if (order) optionalParameters.push(order)
      if (categoryId) optionalParameters.push(categoryId)
      if (optionalParameters.length) return `&${optionalParameters.join('&')}`
      return null
    }

    const url = this.URL + '/Products/byName?' + cityId + '&' + quantity + '&' + page + (optional() ? optional() : '')

    const res = await axios.get(url)
    return await res.data;
  }

  // отмена заказа
  async cancelOrder(orderGuid, TOKEN) {
    return await axios.delete(`${this.URL}/Orders?orderGuid=${orderGuid}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${TOKEN}`
        }
      })
  }
}

const apiService = new ApiService()

export default apiService


// getUserCity1() {
//   return new Promise((resolve, reject) => {
//     fetch('https://api.ipify.org?format=json')
//       .then(res => res.json())
//       .then(({ip}) => {
//         fetch(
//           `https://suggestions.dadata.ru/suggestions/api/4_1/rs/iplocate/address?ip=${ip}&token=3403f978625b46f2052d4e9dbbf08eb6fa06ee19`
//         )
//           .then(res => res.json())
//           .then(json => {
//             if (
//               {}.hasOwnProperty.call(json, 'family') &&
//               json.family.toLowerCase().indexOf('err')
//             ) {
//               return reject(json);
//             }
//             const {
//               location: {
//                 data: {city},
//               },
//             } = json;
//             resolve({city, ip});
//           });
//       });
//   });
// }

//======= РАБОТАЕТ ===================================================================
// sendOrderTEST = async (order, TOKEN) => {
//   const response = await axios.post(`${this.URL}/Orders`, order, {
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${TOKEN}`
//     }
//   })
//   return response.data
// }
//=====================================================================================

// // поисковый запрос всех товаров по названию
// async getProductsFromSearch(productName, cityId) {
//   const res = await fetch(`${this.URL}/Products/byName?str=${productName}&cityGuid=${cityId}`,
//     {
//       method: 'GET',
//       headers: {
//         accept: 'application/json'
//       }
//     }
//   )
//   if (!res.ok) {
//     throw new Error(`Не могу выполнить fetch, статус ошибки: ${res.status}`)
//   }
//   return await res.json();
// }

// // поисковый запрос порционно с указанием количества элементов и страницы
// async getProductsFromSearchLimit(productName, cityId, quantity = 32, page = 1, order = 'TitleAscending') {
//   const res = await axios.get(`${this.URL}/Products/byName?str=${productName}&cityGuid=${cityId}&limit=${quantity}&page=${page}&order=${order}`)
//   return await res.data;
// }

// // запрос товаров по категории
// async getProductToCategory(cityId, categoryId) {
//   const result = await axios.get(`${this.URL}/Products/byName?cityGuid=${cityId}&categoryGuid=${categoryId}`)
//   return result.data
// }