import {
    authentication,
    authorizedByPassOrSMS,
    fetchCartItems,
    fetchCities,
    getProductsFromSearchLimit,
    postSmsCode,
    refreshAuthentication,
    repeatOrder,
    setIsCity
} from "./index";
import {ActionTypes, StateTypes, TypeProductInfo} from "../types";
import apiService from "../service/ApiService";

const mockProductInfo = {
    "guid": "6ced6a10-6a7f-4f94-be97-53b259acd63f",
    "product": "МЕЗИМ-ФОРТЕ №20 ТАБ. П/О /БЕРЛИН-ХЕМИ/",
    "manufacturer": "BERLIN-CHEMIE",
    "inNameGuid": "25b4c86b-4b5e-4ba7-a8f0-7423761f2dc1",
    "inNameTitle": "Панкреатин",
    "categoryGuid": "92d34a53-39b3-41bb-8d0e-0550eea78070",
    "categoryTitle": "Нормализация работы ЖКТ",
    "retails": [
        {
            "countLast": 40,
            "priceRetail": 70,
            "brand": "Дешёвая Аптека",
            "buildNumber": "8",
            "city": "Красноярск",
            "coordinates": [
                56.032459,
                92.775883
            ],
            "guid": "97178c64-7196-41a5-abcd-0b44bdc05ca6",
            "phone": "8 (391) 218-15-52",
            "street": "Тотмина",
            "title": "Красноярск № 52",
            "weekDayTime": "08:00:00 - 22:00:00"
        },
        {
            "countLast": 5,
            "priceRetail": 81,
            "brand": "Гармония Здоровья",
            "buildNumber": "165",
            "city": "Красноярск",
            "coordinates": [
                55.993904,
                92.897903
            ],
            "guid": "ddd3d84a-c559-4f29-9d29-0f4b707d9e9a",
            "phone": "8 (391) 234-45-45",
            "street": "Красноярский рабочий",
            "title": "Красноярск № 07",
            "weekDayTime": "08:00:00 - 22:00:00"
        },
        {
            "countLast": 15,
            "priceRetail": 69.92,
            "brand": "Гармония Здоровья",
            "buildNumber": "27",
            "city": "Красноярск",
            "coordinates": [
                56.0268,
                92.779422
            ],
            "guid": "6a582b65-03fc-45b3-aaf2-178f3a26b299",
            "phone": "8 (391) 247-42-42",
            "street": "Высотная",
            "title": "Красноярск № 17",
            "weekDayTime": "07:30:00 - 22:00:00"
        }
    ]
}

const result: Promise<TypeProductInfo | null> = Promise.resolve(mockProductInfo)

jest.mock("../service/ApiService");
const apiServiceMock = apiService as jest.Mocked<typeof apiService>;


const dispatchMock = jest.fn()

const getStateMock = () => {
    return {
        cart: [{itemId: 'guid_1', count: 1}, {itemId: 'guid_2', count: 3}],
        isCity: {guid: "c384a061-7641-4605-a340-afb825fdcb70", title: "Абакан"},
        TOKEN: null
    } as StateTypes
}

beforeEach(() => {
    dispatchMock.mockClear();
    localStorage.clear()
})

test('fetchCartItems', async () => {
    apiServiceMock.getProductInfo.mockReturnValue(result)
    const thunk = fetchCartItems()
    await thunk(dispatchMock, getStateMock, apiServiceMock)

    expect(apiServiceMock.getProductInfo).toBeCalledTimes(2)
    expect(dispatchMock).toBeCalledTimes(4)
    expect(dispatchMock).toHaveBeenCalledWith({type: ActionTypes.LOADING})
    expect(dispatchMock).toHaveBeenCalledWith({
        type: ActionTypes.SET_CART_ITEMS,
        payload: [mockProductInfo, mockProductInfo]
    })
    expect(dispatchMock).toHaveBeenLastCalledWith({type: ActionTypes.LOADING_OFF})
    apiServiceMock.getProductInfo.mockClear();
})

describe('repeatOrder', () => {
    test('repeatOrder - positive', async () => {
        apiServiceMock.getProductInfo.mockReturnValue(result)
        const mockData = [{idProduct: '6ced6a10-6a7f-4f94-be97-53b259acd63f', count: 3}, {idProduct: '123', count: 2}]
        const thunk = repeatOrder(mockData)
        await thunk(dispatchMock, getStateMock, apiServiceMock)

        // expect(dispatchMock).toBeCalledTimes(6)
        expect(dispatchMock).toHaveBeenCalledWith({type: ActionTypes.DEL_CART_ITEM})
        expect(dispatchMock).toHaveBeenCalledWith({type: ActionTypes.LOADING})
        expect(dispatchMock).toHaveBeenCalledWith({
            type: ActionTypes.SET_STATUS_REQUEST_REPEAT_ORDER,
            payload: 'executed'
        })
        expect(dispatchMock).toHaveBeenLastCalledWith({type: ActionTypes.LOADING_OFF})
        expect(dispatchMock).toHaveBeenNthCalledWith(6, {
            type: ActionTypes.ITEM_ADDED_TO_CART,
            payload: '6ced6a10-6a7f-4f94-be97-53b259acd63f'
        })
        dispatchMock.mockClear();
        apiServiceMock.getProductInfo.mockClear();
    })

    test('repeatOrder - negative', async () => {
        apiServiceMock.getProductInfo.mockReturnValue(Promise.resolve(null))
        const mockData = [{idProduct: '321', count: 3}, {idProduct: '123', count: 2}]
        const thunk = repeatOrder(mockData)
        await thunk(dispatchMock, getStateMock, apiServiceMock)

        expect(dispatchMock).toHaveBeenCalledWith({type: ActionTypes.DEL_CART_ITEM})
        expect(dispatchMock).toHaveBeenCalledWith({type: ActionTypes.LOADING})
        expect(dispatchMock).toHaveBeenCalledWith({
            type: ActionTypes.SET_STATUS_REQUEST_REPEAT_ORDER,
            payload: 'failure'
        })
        expect(dispatchMock).toHaveBeenLastCalledWith({type: ActionTypes.LOADING_OFF})
        expect(dispatchMock).not.toHaveBeenCalledWith({type: ActionTypes.ITEM_ADDED_TO_CART, payload: '321'})
        dispatchMock.mockClear();
        apiServiceMock.getProductInfo.mockClear();
    })
})

test('setIsCity', async () => {
    localStorage.clear()
    const thunk = setIsCity({guid: 'cityGuid', title: 'CityTitle'})
    await thunk(dispatchMock, getStateMock, apiServiceMock)

    expect(dispatchMock).toBeCalledTimes(3)
    expect(dispatchMock).toHaveBeenCalledWith({type: ActionTypes.LOADING})
    expect(dispatchMock).toHaveBeenCalledWith({
        type: ActionTypes.SET_CITY,
        payload: {guid: 'cityGuid', title: 'CityTitle'}
    })
    const city = JSON.parse(localStorage.getItem('city') as string)
    expect(city).toStrictEqual([{guid: 'cityGuid', title: 'CityTitle'}])
})

describe('fetchCities', () => {
    const responseGetCities = [
        {
            "guid": "c384a061-7641-4605-a340-afb825fdcb70",
            "title": "Абакан",
            "regionGuid": "9b1cf9ca-330d-4a23-b5af-82109c9687d2",
            "regionTitle": "Республика Хакасия"
        },
        {
            "guid": "a439bb99-eb92-4ce2-b881-3bfc200b58c3",
            "title": "Адлер",
            "regionGuid": "69954feb-0f39-4202-aa2c-4a2e1cc898a6",
            "regionTitle": "Краснодарский край"
        },
        {
            "guid": "db74bd34-11ba-414a-a809-c892dbc79226",
            "title": "Ангарск",
            "regionGuid": "14f50cfa-7b02-40e5-ab58-9598d841dfd0",
            "regionTitle": "Иркутская область"
        },
        {
            "guid": "4617a45b-c3c7-4a2d-b524-b190c4881ce6",
            "title": "Анжеро-Судженск",
            "regionGuid": "85c1010c-7b33-4a46-b79c-e84672cda7e4",
            "regionTitle": "Кемеровская область"
        }
    ]
    const responseGetUserCity = {"city": "Ангарск", "ip": "185.124.155.66"}
    apiServiceMock.getCities.mockReturnValue(Promise.resolve(responseGetCities))
    apiServiceMock.getUserCity.mockReturnValue(Promise.resolve(responseGetUserCity))
    const thunk = fetchCities()

    test('fetchCities - positive', async () => {
        await thunk(dispatchMock, getStateMock, apiServiceMock)

        expect(dispatchMock).toHaveBeenCalledWith({type: ActionTypes.LOADING})
        expect(dispatchMock).toHaveBeenCalledWith({type: ActionTypes.FETCH_CITIES_SUCCESS, payload: responseGetCities})
        expect(dispatchMock).toBeCalledTimes(4)
        expect(apiServiceMock.getUserCity).toBeCalled()
        apiServiceMock.getUserCity.mockClear()
    })

    test('fetchCities - negative', async () => {
        localStorage.setItem("city", JSON.stringify([{
            "guid": "db74bd34-11ba-414a-a809-c892dbc79226",
            "title": "Ангарск",
            "regionGuid": "14f50cfa-7b02-40e5-ab58-9598d841dfd0",
            "regionTitle": "Иркутская область"
        }]))
        await thunk(dispatchMock, getStateMock, apiServiceMock)
        expect(dispatchMock).toHaveBeenCalledWith({type: ActionTypes.LOADING})
        expect(dispatchMock).toBeCalledTimes(3)
        expect(apiServiceMock.getUserCity).not.toBeCalled()
    })
    apiServiceMock.getCities.mockClear()
    apiServiceMock.getUserCity.mockClear()
})

test('getProductsFromSearchLimit', async () => {
    apiServiceMock.getProducts.mockReturnValue(Promise.resolve({
        products: [{guid: 'string', product: 'string'}],
        count: 2
    }))
    const thunk = getProductsFromSearchLimit({productName: 'string'})
    await thunk(dispatchMock, getStateMock, apiServiceMock)
    expect(dispatchMock).toHaveBeenCalledWith({type: ActionTypes.LOADING})
    expect(dispatchMock).toHaveBeenCalledWith({
        type: ActionTypes.FETCH_PRODUCTS_FROM_SEARCH_SUCCESS,
        payload: {products: [{guid: 'string', product: 'string'}], count: 2, productSearch: 'string'}
    })
    apiServiceMock.getProducts.mockClear()
})

describe('refreshAuthentication', () => {
    const TOKEN = {accessToken: 'string', refreshToken: 'string'}
    const thunk = refreshAuthentication()
    apiServiceMock.refreshToken.mockReturnValue(Promise.resolve(TOKEN))

    test('refreshAuthentication TOKEN = null', async () => {
        await thunk(dispatchMock, getStateMock, apiServiceMock)
        expect(dispatchMock).toHaveBeenNthCalledWith(1, {type: ActionTypes.LOGOUT})
        expect(dispatchMock).not.toHaveBeenCalledWith({type: ActionTypes.LOADING})
    })

    test('refreshAuthentication - positive', async () => {
        dispatchMock.mockClear()
        localStorage.setItem("TOKEN", JSON.stringify(TOKEN))
        await thunk(dispatchMock, getStateMock, apiServiceMock)
        expect(dispatchMock).toHaveBeenCalledWith({type: ActionTypes.LOADING})
        expect(dispatchMock).toHaveBeenCalledWith({type: ActionTypes.TOKEN, payload: TOKEN})
        expect(dispatchMock).toHaveBeenCalledWith({type: ActionTypes.LOADING_OFF})
        expect(dispatchMock).toBeCalledTimes(5)
    })

    test('refreshAuthentication - catch', async () => {
        dispatchMock.mockClear()
        apiServiceMock.refreshToken.mockClear()
        localStorage.setItem("TOKEN", JSON.stringify(TOKEN))

        apiServiceMock.refreshToken.mockReturnValue(Promise.reject())
        await thunk(dispatchMock, getStateMock, apiServiceMock)
        expect(dispatchMock).toHaveBeenCalledWith({type: ActionTypes.LOADING})
        expect(dispatchMock).toHaveBeenCalledWith({type: ActionTypes.LOGOUT})
        expect(dispatchMock).toHaveBeenCalledWith({type: ActionTypes.LOADING_OFF})
        expect(dispatchMock).toBeCalledTimes(3)
    })
})

describe('authentication', () => {
    test('authentication - positive', async () => {
        const TOKEN = {accessToken: 'string', refreshToken: 'string'}
        const thunk = authentication('phoneNumber', 'passwordText')
        apiServiceMock.authentication.mockReturnValue(Promise.resolve(TOKEN))

        await thunk(dispatchMock, getStateMock, apiServiceMock)

        expect(dispatchMock).toHaveBeenCalledWith({type: ActionTypes.LOADING})
        expect(dispatchMock).toHaveBeenCalledWith({type: ActionTypes.TOKEN, payload: TOKEN})
        expect(dispatchMock).toHaveBeenCalledWith({type: ActionTypes.LOADING_OFF})
        expect(dispatchMock).toBeCalledTimes(6)

        apiServiceMock.authentication.mockClear()
    })

    test('authentication - catch', async () => {
        const thunk = authentication('phoneNumber', 'passwordText')
        apiServiceMock.authentication.mockReturnValue(Promise.reject({response: 'error'}))

        await thunk(dispatchMock, getStateMock, apiServiceMock)

        expect(dispatchMock).toHaveBeenCalledWith({type: ActionTypes.LOADING})
        expect(dispatchMock).toHaveBeenCalledWith({type: ActionTypes.AUTH_FAILURE, payload: 'error'})
        expect(dispatchMock).toHaveBeenCalledWith({type: ActionTypes.LOADING_OFF})
        expect(dispatchMock).toBeCalledTimes(3)
    })
    apiServiceMock.authentication.mockClear()
})

describe('authorizedByPassOrSMS', () => {
    const TOKEN = {accessToken: 'string', refreshToken: 'string'}
    const thunk = authorizedByPassOrSMS('phoneNumber', 'passwordText')

    test('authorizedByPassOrSMS - positive', async () => {
        apiServiceMock.authentication.mockReturnValue(Promise.resolve(TOKEN))

        await thunk(dispatchMock, getStateMock, apiServiceMock)

        expect(dispatchMock).toBeCalledTimes(6)
        expect(dispatchMock).toHaveBeenCalledWith({type: ActionTypes.LOADING})
        expect(dispatchMock).toHaveBeenCalledWith({type: ActionTypes.TOKEN, payload: TOKEN})
        expect(dispatchMock).toHaveBeenCalledWith({type: ActionTypes.LOADING_OFF})
    })

    test('authorizedByPassOrSMS: catch', async () => {
        dispatchMock.mockClear()
        apiServiceMock.authentication.mockClear()
        apiServiceMock.authentication.mockReturnValue(Promise.reject({response: 'responseText'}))

        await thunk(dispatchMock, getStateMock, apiServiceMock)

        expect(dispatchMock).toHaveBeenCalledWith({type: ActionTypes.LOADING})
        expect(dispatchMock).toHaveBeenCalledWith({type: ActionTypes.LOADING_OFF})
        expect(dispatchMock).toBeCalledTimes(3)
    })

    apiServiceMock.authentication.mockClear()
})

describe('postSmsCode', () => {
    const TOKEN = {accessToken: 'string', refreshToken: 'string'}
    const thunk = postSmsCode('phoneNumber', 'passOrSms')
    apiServiceMock.postSmsCode.mockReturnValue(Promise.resolve(TOKEN))

    test('postSmsCode - positive', async () => {
        await thunk(dispatchMock, getStateMock, apiServiceMock)

        expect(dispatchMock).toBeCalledTimes(6)
        expect(dispatchMock).toHaveBeenCalledWith({type: ActionTypes.LOADING})
        expect(dispatchMock).toHaveBeenCalledWith({type: ActionTypes.TOKEN, payload: TOKEN})
        expect(dispatchMock).toHaveBeenCalledWith({type: ActionTypes.LOADING_OFF})

        dispatchMock.mockClear()
        apiServiceMock.postSmsCode.mockClear()
    })

    test('postSmsCode: catch', async () => {
        apiServiceMock.postSmsCode.mockClear()
        apiServiceMock.postSmsCode.mockReturnValue(Promise.reject({response: 'responseText'}))

        await thunk(dispatchMock, getStateMock, apiServiceMock)

        expect(dispatchMock).toHaveBeenCalledWith({type: ActionTypes.LOADING})
        expect(dispatchMock).toHaveBeenCalledWith({type: ActionTypes.LOADING_OFF})
        expect(dispatchMock).toBeCalledTimes(3)
    })

    apiServiceMock.postSmsCode.mockClear()
})





