import axios from "axios";
import {
    CategoryElement, ObjType, Predictor, Product, TypeAnalogues, TypeComplexes, TypeOrder,
    TypeProductInfo,
    TypeResponseCategoriesElement,
    TypeResponseProductInfo,
    TypeResponseSale, TypeSale
} from "../types";

class ApiService {

    URL: string

    constructor() {
        this.URL = 'http://195.19.102.178:2872'
    }

    //подробная информация по товару - нужен id товара и id города
    async getProductInfo(productId: string, cityId: string): Promise<TypeProductInfo | null> {
        const result = await axios.get(`${this.URL}/Products/byGuid?productGuid=${productId}&cityGuid=${cityId}`)
        if (result.data) {
            return this._transformProductInfo(result.data)
        } else {
            return Promise.resolve(null)
        }
    }

    _transformProductInfo(product: TypeResponseProductInfo): TypeProductInfo {
        const retails = product?.retails.map(retailItem => {
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
            throw new Error(response.data)
        }

        const {location: {data: {city}}} = response.data;

        return {city, ip}
    }

    // Список торговых точек в городе
    async getRetailsCity(cityId: string) {
        const result = await axios.get(`${this.URL}/Retails/${cityId}`)
        return result.data
    }

    // запрос одноразового СМС кода для авторизации
    async getSmsCode(phone: string) {
        const response = await axios.get(`${this.URL}/TOTP?phone=${phone}`)
        return response.data
    }

    // запрос одноразового Email кода для авторизации
    async getEmailCode(email: string) {
        const response = await axios.get(`${this.URL}/TOTP/email?email=${email}`)
        return response.data
    }

    // ввод СМС кода для авторизации
    async postSmsCode(phone: string, smsCode: string) {
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
    async getUserData(accessToken: string) {
        const response = await axios.get(`${this.URL}/Users`, {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${accessToken}`
            }
        })
        return response.data
    }

    // POST запрос TOKEN по паролю  TEST: phone: "9131996226", password: password
    async authentication(phone: string, password: string) {
        const result = await axios.post(
            `${this.URL}/Authentication/password`,
            {phone: phone, password: password},
            {headers: {'Content-Type': 'application/json'}}
        )
        return result.data
    }

    async authenticationByEmail(email: string, code: string) {
        const result = await axios.post(
            `${this.URL}/Authentication/email`,
            {email: email, code: code},
            {headers: {'Content-Type': 'application/json'}}
        )
        return result.data
    }

    // POST запрос refreshTOKEN
    async refreshToken(TOKEN: { accessToken: string, refreshToken: string }) {
        const response = await axios.post(
            `${this.URL}/Authentication/refresh`,
            {accessToken: TOKEN.accessToken, refreshToken: TOKEN.refreshToken},
            {headers: {'Content-Type': 'application/json'}}
        )

        return response.data
    }

    // запрос категорий
    async getCategories(): Promise<TypeResponseCategoriesElement[]> {
        const result = await axios.get(`${this.URL}/Categories`)
        return result.data
    }

    // строим каталог из списка категорий
    async buildCatalog(): Promise<CategoryElement> {
        const Categories = await this.getCategories()

        //убираем категорию "Товары и Услуги"
        const delcategory = Categories.find(item => item.guid === 'f32e1087-ba7a-4eaa-8f2c-a31e15259838')
        if (delcategory) {
            delcategory.guid = ''
            delcategory.parent = ''
        }

        class NodeCategories implements CategoryElement {
            child: CategoryElement[] = []
            historyGuid: string[]

            constructor(
                public guid: string,
                public title: string,
                public parent: string | null = null,
                historyGuid: string[] = []
            ) {
                this.historyGuid = [...historyGuid, guid]
                this._getChildrens()
            }

            _getChildrens() {
                Categories.forEach(cat => {
                    if (cat.parent === this.guid) {
                        this.child.push(new NodeCategories(cat.guid, cat.title, cat.parent, this.historyGuid))
                    }
                })
            }
        }

        const firstEl: TypeResponseCategoriesElement | undefined = Categories.find(item => item.parent == null)

        return new NodeCategories(firstEl!.guid, firstEl!.title)

    }

    // запрос списка покупок
    async getSales(accessToken: string): Promise<TypeSale[]> {
        const response = await axios.get(`${this.URL}/Sales`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                }
            })
        return this._transformSales(response.data)
    }

    // приведение getSales к стандартному виду
    _transformSales(sales: TypeResponseSale[]): TypeSale[] {
        const retail = (sale: TypeResponseSale) => {
            return {
                guid: sale?.retail?.guid,
                title: sale?.retail?.title,
                brand: sale?.retail?.brand,
                city: sale?.retail?.city,
                street: sale?.retail?.street,
                buildNumber: sale?.retail?.buildNumber,
                phone: sale?.retail?.phone,
                weekDayTime: sale?.retail?.weekDayTime,
                coordinates: sale?.retail?.coordinates
            }
        }

        const products = (sale: TypeResponseSale) => sale?.items?.map(product => {
            return {
                productTitle: product?.productTitle,
                productGuid: product?.productGuid,
                priceRetail: product?.priceRetail,
                quantity: product?.quantity,
                spendBonus: product?.spendBonus,
                accumulationBonus: product?.accumulationBonus,
                discount: product?.discount
            }
        })

        return sales.map(sale => {
            return {
                sumDocument: sale?.sumDocument,
                accumulationBonus: sale?.accumulationBonus,
                spendBonus: sale?.spendBonus,
                cash: sale?.cash,
                cashless: sale?.cashless,
                dateDocument: sale?.dateDocument,
                retail: retail(sale),
                products: products(sale)
            }
        })
    }

    // POST запрос сформированный заказ (отправка заказа)
    async sendOrder(order: TypeOrder, accessToken: string) {
        const response = await axios({
            method: 'post',
            url: `${this.URL}/Orders`,
            data: order,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            }
        })
        return response.data
    }

    // запрос списка интернет заказов
    async getOrder(accessToken: string) {
        const response = await axios.get(`${this.URL}/Orders`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                }
            })
        return response.data
    }

    // запрос товаров по параметрам
    async getProducts(options: {
        productName?: string | null | undefined,
        cityId: string,
        quantity?: string | number,
        page?: string | number,
        order?: string | number | null,
        categoryId?: string | number | null
    }) {
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
    async cancelOrder(orderGuid: string, accessToken: string) {
        return await axios.delete(`${this.URL}/Orders?orderGuid=${orderGuid}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                }
            })
    }

    // изменить данные Profile
    async changeDataProfile(data: {
                                lastName: string,
                                firstName: string,
                                middleName: string,
                                gender: boolean,
                                birthDate: string,
                                email: string
                            },
                            accessToken: string) {
        const response = await axios({
            method: 'put',
            url: `${this.URL}/Users/data`,
            data: data,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            }
        })
        return response.data
    }

    // изменить Пароль Profile
    async changePasswordProfile(objectPassword: { oldPassword: string, newPassword: string }, accessToken: string) {
        const response = await axios({
            method: 'put',
            url: `${this.URL}/Users/password`,
            data: objectPassword,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            }
        })
        return response.data
    }

    // POST запрос - добавить товар в Избранное
    async addToFavorites(accessToken: string, productGuid: string) {
        const response = await axios.post(
            `${this.URL}/Favorites?productGuid=${productGuid}`,
            null,
            {headers: {'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}`}}
        )
        return response.data
    }

    // запрос избранных товаров
    async getToFavorites(accessToken: string, cityGuid: string) {
        const response = await axios.get(`${this.URL}/Favorites?cityGuid=${cityGuid}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                }
            })
        return response.data
    }

    async delToFavorites(accessToken: string, productGuid: string) {
        const response = await axios.delete(`${this.URL}/Favorites?productGuid=${productGuid}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                }
            })
        return response.status
    }

    async getComplexes(productGuid: string, cityGuid: string) {
        const response = await axios.get(`${this.URL}/Complexes?productGuid=${productGuid}&cityGuid=${cityGuid}`)

        const result = () => {
            const promoItems: Product[] = [];
            (response.data as TypeComplexes).complexes.forEach(item => {
                item.products.forEach(product => promoItems.push(product))
            })

            return {
                type: 'complexes',
                courses: response.data.courses,
                promoItems
            }
        }

        return result()
    }

    async getAnalogues(productGuid: string) {
        const response = await axios.get(`${this.URL}/Analogues?productsGuid=${productGuid}`)

        const result = () => {
            const promoItems: ObjType[] = [];
            (response.data as TypeAnalogues[]).forEach(item => {
                item.analogues.forEach(analog => promoItems.push(analog))
            })

            return {
                type: 'analogues',
                promoItems
            }
        }

        return result()
    }

    async yandexPredictor(value: string): Promise<Predictor> {
        const urlPredictor = 'https://predictor.yandex.net/api/v1/predict.json/complete'
        const apiKey = 'pdct.1.1.20210129T022947Z.b1d820d8cd8f7beb.a013cd30b08386d5dfd91cf65ce835de05009496'
        const response = await axios.get(`${urlPredictor}?key=${apiKey}&q=${value}&limit=5&lang=ru`)

        return response.data
    }

}

const apiService = new ApiService()

export default apiService