export default class StoreService {

  getBooks() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.75) {
          reject(new Error('Something bad happened'))
        } else resolve(this.data)
      }, 800)
    })
  }

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

  setLocal(cart) {
    const arrItemId = [];
    const arrCountCart = [];
    cart.forEach((item) => {
      arrItemId.push(item.itemId)
      arrCountCart.push(item.count)
    })
    localStorage.setItem('arrItemId', JSON.stringify(arrItemId));
    localStorage.setItem('arrCountCart', JSON.stringify(arrCountCart));
    // console.log('====================================================')
    // console.log('Обновился LocalStorage')
    // console.log('arrItemId', JSON.stringify(arrItemId))
    // console.log('arrCountCart', JSON.stringify(arrCountCart))
    // console.log('CART', cart)
    // console.log('====================================================')
  }

  setCartFromLocalStorage(funcSet) {
    const arrItemIdParse = JSON.parse(localStorage.getItem("arrItemId"));
    const arrCountCartParse = JSON.parse(localStorage.getItem("arrCountCart"));
    const arr = [];
    arrItemIdParse.forEach((item) => {
      arr.push({itemId: item})
    })
    arrCountCartParse.forEach((item, id) => {
      arr[id].count = item
    })
    funcSet(arr)
  }

}