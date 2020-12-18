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
function postBuyOrder() {
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
  const sendOrder = async () => {
    const response = await apiService.sendOrder(send, this.props.TOKEN.accessToken)
    this.setState({OrderNumber: response})
    console.log('Заказ отправлен: ', send);
    console.log('Номер заказа: ', response)
  }
  this.props.loadingTrue('postBuyOrder')
  try {
    sendOrder()
    this.props.loadingFalse('postBuyOrder')
  } catch (e) {
    this.props.setError(e)
  }

  product.forEach(item => this.props.allItemRemovedFromCart(item.guid)) // удалить заказанные позиции из корзины
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
  return this.checkRetailItem().product.length === this.props.cart.length
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
  indexActiveRetail
}