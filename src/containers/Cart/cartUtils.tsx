import apiService from "../../service/ApiService";
import {PromoItemsForCart, TypeOrder, TypeProductInfo, TypeRetailItem} from "../../types";
import {PropsCart, StateCart} from "./Cart";
import React from "react";

// возвращает {[id товара]: 'сумма этого товара в выбранной аптеке'}[]
function calculateAmountArray(props: PropsCart): { guid: string, sum: number | null }[] {
    const cartItems: { guid: string; sum: number | null }[] = []
    props.cartItems.forEach((item) => {
        const index = props.cart.findIndex(cartItem => cartItem.itemId === item.guid)
        if (index < 0) return;
        const count = props.cart[index].count
        const retailIndex = item.retails.findIndex(retail => retail.guid === props.selectedRetail)
        const sum = retailIndex >= 0 ? item.retails[retailIndex].priceRetail * count : null
        cartItems.push({guid: item.guid, sum})
    })
    return cartItems
}

// остаток товара в выбранной аптеке
function getCountLast(idProduct: string, props: PropsCart) {
    const product = props.cartItems.find(item => item.guid === idProduct)
    const retail = product?.retails.find(item => item.guid === props.selectedRetail)
    if (retail) {
        return Math.floor(retail.countLast)
    } else return null
}

// возвращает массив аптек с полным наличием товара или null
function getFullRetailItemState(props: PropsCart) {
    const itemArr = props.retailsArr.filter(item => item.product.length >= props.cart.length)
    if (itemArr.length > 0) {
        return itemArr
    }
    return null
}

// возвращает массив аптек с полным наличием товара НУЖНОГО КОЛИЧЕСТВА или null
function getFullCountProductsRetails(props: PropsCart) {
    const allCountFullProductRetails: TypeRetailItem[] = [];
    const notCompleteCountProductsRetails: TypeRetailItem[] = []

    const fullRetails = getFullRetailItemState(props) // аптеки, где все товары доступны, но не факт, что в нужном количестве.
    if (fullRetails) {
        fullRetails.forEach(retail => {
            const complete = retail.product.every(({countLast, guid}) => {
                // элемент товара в корзине
                const productInCart = props.cart.find(itemCart => itemCart.itemId === guid)
                // если макс.кол. товара в этой аптеке больше, чем выбрано в корзине, то оставляем эту аптеку
                return countLast ? (countLast >= (productInCart?.count || 0)) : false;
            })

            if (complete) {
                allCountFullProductRetails.push(retail)
            } else {
                notCompleteCountProductsRetails.push(retail)
            }
        })
    }
    allCountFullProductRetails.sort((a, b) => (a.sum || 0) > (b.sum || 0) ? 1 : -1)
    notCompleteCountProductsRetails.sort((a, b) => {
        const aCount = a.product.reduce((acc, val) => {
            return acc + val.count
        }, 0)
        const bCount = b.product.reduce((acc, val) => {
            return acc + val.count
        }, 0)
        const isResult = (aCount < bCount) || ((aCount === bCount) && ((a.sum || 0) > (b.sum || 0)))
        return isResult ? 1 : -1
    })

    return {allCountFullProductRetails, notCompleteCountProductsRetails}
}

// возвращает подпись в сколько товаров из списка есть в данной аптеке. На вход принимает массив товаров в аптеке.
function calcQuantityProduct(props: PropsCart,
                             obj: { [key: string]: string | number }[]) {
    const styleErr = {
        color: 'red',
        fontSize: 14,
        display: 'inline',
        borderBottom: '1px dashed #000',
        cursor: 'pointer'
    }
    const a = obj.length
    const b = props.cart.length

    if (a === b) {
        return <p style={{
            fontSize: 14,
            color: 'green',
            display: 'inline',
            borderBottom: '1px dashed #000',
            cursor: 'pointer'
        }}>
            все товары </p>
    }

    return <p style={styleErr}> {a} из {b} товаров </p>
}

// отправка на сервер собранного интернет заказа
async function postBuyOrder(props: PropsCart, state: StateCart, accessToken = props.TOKEN?.accessToken, setOrder: (order: any) => void) {
    props.loadingTrue()
    const retailItem = checkRetailItem(props)
    if (retailItem && accessToken) {
        const {guid, product, sum} = retailItem
        const products = product.map(item => {
            return {
                productGuid: item.guid,
                quantity: item.count,
                manufacturer: item.manufacturer,
                product: item.product,
                priceRetail: item.priceRetail
            }
        })
        const send = {retailGuid: guid, telephone: state.telephone, products: products, sum}
        const response = await apiService.sendOrder((send as TypeOrder), accessToken)
        console.log('Заказ отправлен: ', send);
        console.log('Номер заказа: ', response)
        setOrder(response)
        product.forEach(item => props.allItemRemovedFromCart(item.guid)) // удалить заказанные позиции из корзины
        props.loadingFalse()
        props.onSelectRetail(null)
        return response
    } else {
        return Promise.reject('нет accessToken')
    }
}

function clearCartError(props: PropsCart, state: StateCart, setError: (obj: any) => void) {
    setTimeout(props.clearCart, 8000)
    setTimeout(() => {
        setError(<p style={{fontSize: 24}}> Мы ничего не нашли :( Корзина будет очищена ... :( </p>)
    }, 2000)
    return state.error
}

// проверяет имеет ли активная Аптека полный набор товаров
function isFullActiveRetail(props: PropsCart) {
    return checkRetailItem(props)?.product?.length === props.cart.length
}

// возвращает элемент выбранной аптеки
function checkRetailItem(props: PropsCart) {
    return props.retailsArr.find(item => item.guid === props.selectedRetail)
}

// возвращает сумму всех товаров в выбранной аптеке
function getSum(props: PropsCart) {
    const sum = calculateAmountArray(props).reduce((accumulator, currentValue) => {
        if (currentValue.sum === null) return accumulator;
        return currentValue.sum + accumulator
    }, 0)
    return +sum.toFixed(2)
}

function onLoading(props: PropsCart, state: StateCart, setLoadingText: (text: JSX.Element) => void) {
    setTimeout(() => {
        setLoadingText(<p>В данном городе таких товаров нет.
            <span onClick={props.clearCart}
                  style={{
                      color: 'blue',
                      borderBottom: '1px dashed red',
                      marginLeft: 10,
                      fontSize: 18,
                      fontWeight: 'bold',
                      cursor: 'pointer'
                  }}
            >Очистить корзину </span>
        </p>)
    }, 3000)
    return state.loadingText
}

// сортировка товаров по наличию в текущей аптеке
function sortProductThisRetail(props: PropsCart) {
    const arr1 = props.cartItems.filter(item => item.retails.some(el => el.guid === props.selectedRetail))
    const arr2 = props.cartItems.filter(item => !item.retails.some(el => el.guid === props.selectedRetail))
    return arr1.concat(arr2)
}

function newCartItems(props: PropsCart) {
    return props.cartItems.filter(item => Boolean(item.length !== 0))
}

// соответствует ли id элемента выбранное аптеке
function isChecked(props: PropsCart, id: string) {
    return props.selectedRetail === id;
}

// Если подгрузились доп.продажи, то возвращает объект для карточки доп.продаж.
// 2-ой параметр - массив продуктов, с которым не должен быть похож возвращаемый объект
export function getDataForPromoItem(props: PropsCart, arrProducts: TypeProductInfo[]): PromoItemsForCart | null {
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
        const itemIndex = props.cart.findIndex((item) => item.itemId === promoItem.guid);
        const result: {
            isBuy: boolean, count: number, countLast: number, key: string, id: string, title: string, maker: string,
            img: any, minPrice: number | null,
            onIncrement(event?: React.MouseEvent): void,
            onDecrement(event?: React.MouseEvent): void,
            promo: boolean
        } = {
            isBuy: itemIndex >= 0,
            count: (itemIndex >= 0) ? props.cart[itemIndex].count : 0,
            countLast: 1,
            key: promoItem.guid,
            id: promoItem.guid,
            title: promoItem.product,
            maker: promoItem.manufacturer,
            img: null,
            minPrice: null,
            onIncrement: (event) => {
                event?.stopPropagation()
                props.addedToCart(promoItem.guid)
            },
            onDecrement: (event) => {
                event?.stopPropagation()
                props.itemRemovedFromCart(promoItem.guid)
            },
            promo: true
        }
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
    getFullCountProductsRetails
}