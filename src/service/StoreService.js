class ApiService {

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
}

const apiServise = new ApiService()

export default apiServise