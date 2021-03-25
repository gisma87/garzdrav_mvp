import React from "react";
import apiService from "../../service/ApiService";

// возвращает массив id товара - сумма этого товара в выбранной аптеке
function calculateAmountArray() {
  const cartItems = []
  this.props.cartItems.forEach(item => {
    const index = this.props.cart.findIndex(cartItem => cartItem.itemId === item.guid)
    if (index < 0) return;
    const count = this.props.cart[index].count
    const retailIndex = item.retails.findIndex(retail => retail.guid === this.props.selectedRetail)
    const sum = retailIndex >= 0 ? item.retails[retailIndex].priceRetail * count : null
    cartItems.push({guid: item.guid, sum})
  })
  return cartItems
}

// остаток товара в выбранной аптеке
function getCountLast(idProduct) {
  const product = this.props.cartItems.find(item => item.guid === idProduct)
  const retail = product.retails.find(item => item.guid === this.props.selectedRetail)
  if (retail) {
    return Math.floor(retail.countLast)
  } else return null
}

// возвращает массив аптек с полным наличием товара или null
function getFullRetailItemState() {
  const itemArr = this.props.retailsArr.filter(item => item.product.length >= this.props.cart.length)
  if (itemArr.length > 0) {
    return itemArr
  }
  return null
}

// возвращает массив аптек с полным наличием товара НУЖНОГО КОЛИЧЕСТВА или null
function getFullCountProductsRetails() {
  const allCountFullProductRetails = [];
  const notCompleteCountProductsRetails = []

  const fullRetails = getFullRetailItemState.call(this) // аптеки, где все товары доступны, но не факт, что в нужном количестве.
  if (fullRetails) {
    fullRetails.forEach(retail => {
      const complete = retail.product.every(productItem => {
        // элемент товара в корзине
        const productInCart = this.props.cart.find(itemCart => itemCart.itemId === productItem.guid)
        // если макс.кол. товара в этой аптеке больше, чем выбрано в корзине, то оставляем эту аптеку
        return productItem?.countLast >= productInCart?.count
      })

      if (complete) {
        allCountFullProductRetails.push(retail)
      } else {
        notCompleteCountProductsRetails.push(retail)
      }
    })
  }
  allCountFullProductRetails.sort((a, b) => a.sum > b.sum ? 1 : -1)
  notCompleteCountProductsRetails.sort((a, b) => {
    const aCount = a.product.reduce((acc, val) => {
      return acc + val.count
    }, 0)
    const bCount = b.product.reduce((acc, val) => {
      return acc + val.count
    }, 0)
    const isResult = (aCount < bCount) || ((aCount === bCount) && (a.sum > b.sum))
    return isResult ? 1 : -1
  })

  return {allCountFullProductRetails, notCompleteCountProductsRetails}
}

// возвращает подпись в сколько товаров из списка есть в данной аптеке. На вход принимает массив товаров в аптеке.
function calcQuantityProduct(obj) {
  const styleErr = {
    color: 'red',
    fontSize: 14,
    display: 'inline',
    borderBottom: '1px dashed #000',
    cursor: 'pointer'
  }
  const a = obj.length
  const b = this.props.cart.length

  if (a === b) {
    return <p style={{
      fontSize: 14,
      color: 'green',
      display: 'inline',
      borderBottom: '1px dashed #000',
      cursor: 'pointer'
    }}>все товары</p>
  }

  return <p style={styleErr}>{a} из {b} товаров</p>
}

// отправка на сервер собранного интернет заказа
async function postBuyOrder(accessToken = this.props.TOKEN.accessToken) {
  this.props.loadingTrue('postBuyOrder')
  const {guid, product, sum} = this.checkRetailItem()
  const products = product.map(item => {
    return {
      productGuid: item.guid,
      quantity: item.count,
      manufacturer: item.manufacturer,
      product: item.product,
      priceRetail: item.priceRetail
    }
  })
  const send = {retailGuid: guid, telephone: this.state.telephone, products: products, sum}
  const response = await apiService.sendOrder(send, accessToken)
  this.setState({OrderNumber: response})
  console.log('Заказ отправлен: ', send);
  console.log('Номер заказа: ', response)
  product.forEach(item => this.props.allItemRemovedFromCart(item.guid)) // удалить заказанные позиции из корзины
  this.props.loadingFalse('postBuyOrder')
  this.props.onSelectRetail(null)
  return response
}

function clearCartError() {
  setTimeout(this.props.clearCart, 8000)
  setTimeout(() => {
    this.setState({
      error: <p style={{fontSize: 24}}>Мы ничего не нашли :( Корзина будет очищена... :(</p>
    })
  }, 2000)
  return this.state.error
}

// проверяет имеет ли активная Аптека полный набор товаров
function isFullActiveRetail() {
  return this.checkRetailItem()?.product?.length === this.props.cart.length
}

// возвращает элемент выбранной аптеки
function checkRetailItem() {
  return this.props.retailsArr.find(item => item.guid === this.props.selectedRetail)
}

// возвращает сумму всех товаров в выбранной аптеке
function getSum() {
  const sum = this.calculateAmountArray().reduce((accumulator, currentValue) => {
    if (currentValue.sum === null) return accumulator;
    return currentValue.sum + accumulator
  }, 0)
  return +sum.toFixed(2)
}

function onLoading() {
  setTimeout(() => {
    this.setState({
      loadingText: <p>В данном городе таких товаров нет.
        <span onClick={this.props.clearCart}
              style={{
                color: 'blue',
                borderBottom: '1px dashed red',
                marginLeft: 10,
                fontSize: 18,
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
        >Очистить корзину</span>
      </p>
    })
  }, 3000)
  return this.state.loadingText
}

// сортировка товаров по наличию в текущей аптеке
function sortProductThisRetail() {
  const arr1 = this.props.cartItems.filter(item => item.retails.some(el => el.guid === this.props.selectedRetail))
  const arr2 = this.props.cartItems.filter(item => !item.retails.some(el => el.guid === this.props.selectedRetail))
  return arr1.concat(arr2)
}

function newCartItems() {
  return this.props.cartItems.filter(item => Boolean(item.length !== 0))
}

// соответствует ли id элемента выбранное аптеке
function isChecked(id) {
  return this.props.selectedRetail === id;
}

function indexActiveRetail() {
  return this.props.retailsArr.findIndex((item) => item.guid === this.state.checked);
}

// Если подгрузились доп.продажи, то возвращает объект для карточки доп.продаж.
// 2-ой параметр - массив продуктов, с которым не должен быть похож возвращаемый объект
export function getDataForPromoItem(props, arrProducts) {
  if (props.promoItems && (props.promoItems?.promoItems?.length > 0)) {
    const arrPromoItems = props.promoItems?.promoItems
    let index = 0
    let promoItem = arrPromoItems[index]
    // если первые 5 символов в названии схожи с названием карточек корзины, то в while берём следующий элемент массива
    const isEqualString = () => arrProducts?.some(item => item.product?.slice(0, 5) === arrPromoItems[index]?.product?.slice(0, 5))
    while (isEqualString() && (index < arrPromoItems.length)) {
      index++
      promoItem = arrPromoItems[Math.min(arrPromoItems.length - 1, index)]
    }
    const result = {}
    const itemIndex = props.cart.findIndex((item) => item.itemId === promoItem.guid);
    result.isBuy = itemIndex >= 0;
    result.count = result.isBuy ? props.cart[itemIndex].count : 0
    result.countLast = 1
    result.key = promoItem.guid
    result.id = promoItem.guid
    result.title = promoItem.product
    result.maker = promoItem.manufacturer
    result.img = null
    result.minPrice = null
    result.onIncrement = (event) => {
      event.stopPropagation()
      props.addedToCart(promoItem.guid)
    }
    result.onDecrement = (event) => {
      event.stopPropagation()
      props.itemRemovedFromCart(promoItem.guid)
    }
    result.promo = true;
    return result
  }
  return null
}


export {
  calculateAmountArray, // возвращает массив id товара - сумма этого товара в выбранной аптеке
  getCountLast, // остаток товара в выбранной аптеке
  getFullRetailItemState, // возвращает массив аптек с полным наличием товара или null
  calcQuantityProduct, // возвращает подпись в сколько товаров из списка есть в данной аптеке на вход принимает массив товаров в аптеке
  postBuyOrder, // отправка на сервер собранного интернет заказа
  clearCartError,
  isFullActiveRetail, // проверяет имеет ли активная Аптека полный набор товаров
  checkRetailItem, // возвращает элемент выбранной аптеки
  getSum, // возвращает сумму всех товаров в выбранной аптеке
  onLoading,
  sortProductThisRetail, // сортировка товаров по наличию в текущей аптеке
  newCartItems,
  isChecked,
  indexActiveRetail,
  getFullCountProductsRetails
}