import axios from "axios";

class ApiService {

  constructor() {
    this.URL = 'http://172.16.17.7:5000'
  }

  //подробная информация по товару - нужен id товара и id города
  async getProductInfo(productId, cityId) {
    return await axios.get(`${this.URL}/Products/byGuid?productGuid=${productId}&cityGuid=${cityId}`)
  }

  // список позиций из поискового запроса
  async getProductsFromSearch(productName, cityId) {
    const res = await fetch(`${this.URL}/Products/byName?str=${productName}&cityGuid=${cityId}`,
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

  // определение города и IP пользователя
  getUserCity() {
    return new Promise((resolve, reject) => {
      fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(({ip}) => {
          fetch(
            `https://suggestions.dadata.ru/suggestions/api/4_1/rs/iplocate/address?ip=${ip}&token=3403f978625b46f2052d4e9dbbf08eb6fa06ee19`
          )
            .then(res => res.json())
            .then(json => {
              if (
                {}.hasOwnProperty.call(json, 'family') &&
                json.family.toLowerCase().indexOf('err')
              ) {
                return reject(json);
              }
              const {
                location: {
                  data: {city},
                },
              } = json;
              resolve({city, ip});
            });
        });
    });
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
      constructor(guid, title, parent = null) {
        this.guid = guid
        this.title = title
        this.parent = parent
        this.child = []
        this.getChildrens()
      }

      getChildrens() {
        Categories.forEach(cat => {
          if (cat.parent === this.guid) {
            this.child.push(new NodeCategories(cat.guid, cat.title, cat.parent))
          }
        })
      }
    }

    const firstEl = Categories.find(item => item.parent == null)
    const grandNode = new NodeCategories(firstEl.guid, firstEl.title)
    console.log('grandNode', grandNode)
    return grandNode
  }


}

const apiService = new ApiService()

export default apiService