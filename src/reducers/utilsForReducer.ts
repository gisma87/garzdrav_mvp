import {ObjType, StateTypes, TypeProductInfo} from "../types";
import {TypeRetailItem} from "../types";

export function isEmpty(obj: Object) {
    for (let key in obj) {
        return false;
    }
    return true;
}

export const upgradeRetailItems = (array: TypeRetailItem[]): TypeRetailItem[] => {
    return array.map((item) => {
        const sum = item.product.reduce((accumulator, currentValue) => {
            // const count = cart.find(item => item.itemId === currentValue.guid).count
            return ((currentValue.priceRetail * currentValue.count) + accumulator)
        }, 0)
        return {
            ...item,
            sum: +sum.toFixed(2)
        }
    })
}

// список товаров без аптек, в которых priceRetail равен нулю. Не нужно показывать пользователю товар с нулевой ценой.
export function filterNullRetails(productsInfo: TypeProductInfo[]) {
    const newCardFullPrice: TypeProductInfo[] = productsInfo.map(cardItem => {
        return {
            ...cardItem,
            retails: cardItem.retails.filter(retail => retail.priceRetail > 0)
        }
    })
    return newCardFullPrice.filter(card => card.retails.length)
}

export function splitProductsInfo(state: StateTypes, productInfo: TypeProductInfo[]) {
    const retailsArr: TypeRetailItem[] = []
    const newCardItems = [...productInfo]
    newCardItems.forEach((item, index) => {
        if (!isEmpty(item)) {
            item.retails?.forEach((retail) => {
                // копируем товар
                const copyItem: { retails?: any } = {...item}

                // удаляем из него список аптек
                delete copyItem.retails

                const productItem: {
                    [key: string]: string | number | ObjType | (number | string | ObjType)[] | null | undefined
                } = {...copyItem} // в итоге - это товар без списка аптек

                // добавляем цену товара в текущей аптеке
                productItem.priceRetail = retail.priceRetail
                productItem.countLast = retail.countLast || 0

                // добавляем количество товара из корзины в продукт - если количество больше, чем макс.кол в аптеке, то ставим макс. в аптеке
                const countProductInCart = state.cart.find(cartItem => cartItem.itemId === item.guid)?.count || 0;
                productItem.count = (countProductInCart <= productItem.countLast) ? countProductInCart : productItem.countLast

                // копируем аптеку
                const copyRetail: {
                    [key: string]: string | number | ObjType | (number | string | ObjType)[] | null | undefined
                } = {...retail}

                // удаляем цену и остаток товара
                delete copyRetail.priceRetail
                delete copyRetail.countLast

                if (typeof copyRetail.weekDayTime === 'string') {
                    copyRetail.weekDayTime = copyRetail.weekDayTime?.match(/\d\d:\d\d/g)?.join(' - ')
                }

                // добавляем в аптеку данные товара без списка аптек
                copyRetail.product = []

                const retailItem: TypeRetailItem = {...(copyRetail as TypeRetailItem)}

                retailItem.product.push((productItem as { guid: string, priceRetail: number, count: number, [key: string]: string | number }))


                if (retailsArr.length) {

                    // если это не первая итерация - проверяем, есть ли уже такая аптека в списке
                    const someRetail = retailsArr.some(i => i.guid === retail.guid)
                    if (someRetail) {

                        // если аптека уже есть, проверяем, есть ли в ней уже данный товар
                        const itemRetail = retailsArr.find(itemRetail => itemRetail.guid === retail.guid)
                        const someProduct = itemRetail ? itemRetail.product!.some(pdItem => pdItem.guid === item.guid) : null;
                        if (someProduct) {
                            // если товар есть в этой аптеке, выходим
                            return
                        } else {
                            // если товара ещё нет в этой аптеке - добавляем
                            const index = retailsArr.findIndex((i => i.guid === retail.guid))
                            retailsArr[index].product.push((productItem as { guid: string, priceRetail: number, count: number, [key: string]: string | number }))
                        }

                    } else {
                        retailsArr.push(retailItem)
                    }
                } else {
                    retailsArr.push(retailItem)
                }
            })
        } else newCardItems.splice(index, 1)
    })

    return {retailsArr, newCardItems}
}

export function sortAndFilterCartItems(state: StateTypes, payload: TypeProductInfo[]) {
    // productsInfo - это список товаров без аптек, в которых priceRetail равен нулю. Не нужно показывать пользователю товар с нулевой ценой.
    const productsInfo = filterNullRetails(payload)
    if (!productsInfo.length) {
        return {
            ...state,
            cartItems: [],
            retailsArr: [],
            loading: (state.loading > 0) ? (state.loading - 1) : 0,
            error: null
        }
    }

    const {retailsArr, newCardItems} = splitProductsInfo(state, productsInfo)
    const cartNow = state.cart.filter(item => newCardItems.some((element => element.guid === item.itemId)))
    const isDelCartItem = cartNow < state.cart;

    return {
        ...state,
        cartItems: newCardItems,
        retailsArr: [...upgradeRetailItems(retailsArr)],
        cart: cartNow,
        isDelCartItem,
        loading: (state.loading > 0) ? (state.loading - 1) : 0,
        error: null
    }
}