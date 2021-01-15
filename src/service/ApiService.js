import axios from "axios";

class ApiService {

  constructor() {
    this.URL = 'http://172.16.17.7:5000'
  }

  //подробная информация по товару - нужен id товара и id города
  async getProductInfo(productId, cityId) {
    const result = await axios.get(`${this.URL}/Products/byGuid?productGuid=${productId}&cityGuid=${cityId}`)

    return this._transformProductInfo(result.data)
  }

  _transformProductInfo(product) {
    const retails = product.retails.map(retailItem => {
      return {
        countLast: retailItem.countLast,
        priceRetail: retailItem.priceRetail,
        brand: retailItem.retail.brand,
        buildNumber: retailItem.retail.buildNumber,
        city: retailItem.retail.city,
        coordinates: retailItem.retail.coordinates,
        guid: retailItem.retail.guid,
        phone: retailItem.retail.phone,
        street: retailItem.retail.street,
        title: retailItem.retail.title,
        weekDayTime: retailItem.retail.weekDayTime
      }
    })
    return {...product, retails}
    // нужный ФОРМАТ ДАННЫХ - response должен быть:
    // {
    //    guid: string,
    //    product: string,
    //    manufacturer: string,
    //    categoryGuid: string,
    //    categoryTitle: string,
    //    retails: [{
    //      countLast: number,
    //      priceRetail: number,
    //      brand: string,
    //      buildNumber: string,
    //      city: string,
    //      coordinates: [56.034496, 92.884345],
    //      guid: string,
    //      phone: string,
    //      street: string,
    //      title: string,
    //      weekDayTime: "09:00:00 - 18:00:00",
    //    }]
    // }
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

  // запрос одноразового СМС кода для авторизации
  async getSmsCode(phone) {
    const response = await axios.get(`${this.URL}/TOTP?phone=${phone}`)
    return response.data
  }

  // ввод СМС кода для авторизации
  async postSmsCode(phone, smsCode) {
    const response = await axios.post(`${this.URL}/Authentication/sms`,
      {phone: phone, code: smsCode},
      {
        headers: {
          'Content-Type': 'application/json'
        }
      })
    return response.data
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

  // POST запрос TOKEN по паролю  TEST: phone: "9131996226", password: password
  async authentication(phone, password) {
    const result = await axios.post(
      `${this.URL}/Authentication/password`,
      {phone: phone, password: password},
      {headers: {'Content-Type': 'application/json'}}
    )
    return result.data
  }

  // POST запрос refreshTOKEN
  async refreshToken(TOKEN) {
    const response = await axios.post(
      `${this.URL}/Authentication/refresh`,
      {accessToken: TOKEN.accessToken, refreshToken: TOKEN.refreshToken},
      {headers: {'Content-Type': 'application/json'}}
    )

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

    if (productName) productName = `Find=${productName}`;
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

  // изменить данные Profile
  async changeDataProfile(data, TOKEN) {
    const response = await axios({
      method: 'put',
      url: `${this.URL}/Users/data`,
      data: data,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKEN}`
      }
    })
    return response.data
  }

  // изменить Пароль Profile
  async changePasswordProfile(objectPassword, TOKEN) {
    const response = await axios({
      method: 'put',
      url: `${this.URL}/Users/password`,
      data: objectPassword,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKEN}`
      }
    })
    return response
  }

  // POST запрос - добавить товар в Избранное
  async addToFavorites(TOKEN, productGuid) {
    const response = await axios.post(
      `${this.URL}/Favorites?productGuid=${productGuid}`,
      null,
      {headers: {'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}`}}
    )
    return response.data
  }

  // запрос избранных товаров
  async getToFavorites(TOKEN) {
    const response = await axios.get(`${this.URL}/Favorites`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${TOKEN}`
        }
      })
    return response.data
  }

  async delToFavorites(TOKEN, productGuid) {
    const response = await axios.delete(`${this.URL}/Favorites?productGuid=${productGuid}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${TOKEN}`
        }
      })
    return response.status
  }

}

const apiService = new ApiService()

export default apiService