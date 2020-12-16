
// возвращает массив id товара - сумма этого товара в выбранной аптеке
export function calculateAmountArray() {
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