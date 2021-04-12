import {filterNullRetails, sortAndFilterCartItems, splitProductsInfo, upgradeRetailItems} from "./utilsForReducer";
import {StateTypes} from "../types";

let initialState = {} as StateTypes;

beforeEach(() => {
    initialState = {
        cart: [
            {itemId: 'guid_1', count: 1},
            {itemId: 'guid_2', count: 3},
            {itemId: "ad79dbbd-a976-4033-80ef-1edaf135d379", count: 3},
            {itemId: "97178c64-7196-41a5-abcd-0b44bdc05ca6", count: 2}
        ],
        regions: [{
            regionGuid: '01',
            regionTitle: '01',
            cities: [{guid: 'guid', title: 'titleCity'}, {guid: 'guid2', title: 'titleCity2'}]
        }],
        loading: 2,
        activeBonusCard: null,
        isPopupLogin: false,
        statusRequestRepeatOrder: '',
        itemsForPromoBlock1: [{}],
        error: 'string',
        favorites: [{}],
        loadingFavorites: 1,
        productsToCategory: [{}],
        countProductsCategory: null
    } as StateTypes;
    localStorage.clear()
})

const productsInfo = [
    {
        "guid": "ad79dbbd-a976-4033-80ef-1edaf135d379",
        "product": "АСЕПТА БЕБЕ ЗУБ.ПАСТА ГЕЛЕВАЯ 0-3ЛЕТ 50МЛ.",
        "manufacturer": "ВЕРТЕКС",
        "inNameGuid": null,
        "inNameTitle": null,
        "categoryGuid": "5759391f-917a-47fb-b218-9bd626164734",
        "categoryTitle": "Уход за полостью рта",
        "retails": [
            {
                "countLast": 1,
                "priceRetail": 188,
                "brand": "Дешёвая Аптека",
                "buildNumber": "34",
                "city": "Красноярск",
                "coordinates": [
                    56.046846,
                    92.946805
                ],
                "guid": "d75c02a0-2b05-40e5-b39d-1a74ac03c9e9",
                "phone": "8 (391) 299-36-36",
                "street": "Металлургов",
                "title": "Красноярск № 24",
                "weekDayTime": "08:00:00 - 22:00:00"
            },
            {
                "countLast": 1,
                "priceRetail": 223,
                "brand": "Дешёвая Аптека",
                "buildNumber": "44",
                "city": "Красноярск",
                "coordinates": [
                    55.998957,
                    93.032846
                ],
                "guid": "c8e4aab2-01e4-470a-9d71-3c9845e4dafa",
                "phone": "8 (391) 268-46-46",
                "street": "Шевченко",
                "title": "Красноярск № 21",
                "weekDayTime": "08:00:00 - 22:00:00"
            },
            {
                "countLast": 5,
                "priceRetail": 209,
                "brand": "Дешёвая Аптека",
                "buildNumber": "19а",
                "city": "Красноярск",
                "coordinates": [
                    56.062851,
                    92.947065
                ],
                "guid": "68afc1b2-50df-48ae-9f5f-476ac76fe934",
                "phone": "8 (391) 216-50-77",
                "street": "Ястынская",
                "title": "Красноярск № 77",
                "weekDayTime": "08:00:00 - 22:00:00"
            }
        ]
    },
    {
        "guid": "60193775-d914-4638-8511-9b3d2f9b8abc",
        "product": "АСЕПТА №40 ТАБ. П/О",
        "manufacturer": "ВЕРТЕКС",
        "inNameGuid": null,
        "inNameTitle": null,
        "categoryGuid": "423e0d24-5a97-42b8-860b-318363750e24",
        "categoryTitle": "БАД",
        "retails": [
            {
                "countLast": 4,
                "priceRetail": 0,
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
                "countLast": 7,
                "priceRetail": 0,
                "brand": "Дешёвая Аптека",
                "buildNumber": "110",
                "city": "Красноярск",
                "coordinates": [
                    56.012989,
                    92.857935
                ],
                "guid": "e9c169f6-46f3-4be6-9109-abf5c3b0516b",
                "phone": "8 (391) 200-10-60",
                "street": "Ленина",
                "title": "Красноярск № 33",
                "weekDayTime": "07:00:00 - 22:00:00"
            }
        ]
    },
    {
        "guid": "f2d18000-4675-4008-9ee2-552359c041e4",
        "product": "АСЕПТА БАЛЬЗАМ Д/ДЕСЕН АДГЕЗИВНЫЙ 10Г. ТУБА",
        "manufacturer": "ВЕРТЕКС",
        "inNameGuid": null,
        "inNameTitle": null,
        "categoryGuid": "23c73c2f-845b-456a-bc85-6d3c0f7f34b0",
        "categoryTitle": "Уход за полостью рта",
        "retails": [
            {
                "countLast": 1,
                "priceRetail": 275,
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
                "countLast": 0.1,
                "priceRetail": 343,
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
            },
            {
                "countLast": 12,
                "priceRetail": 0,
                "brand": "Дешёвая Аптека",
                "buildNumber": "34",
                "city": "Красноярск",
                "coordinates": [
                    56.046846,
                    92.946805
                ],
                "guid": "d75c02a0-2b05-40e5-b39d-1a74ac03c9e9",
                "phone": "8 (391) 299-36-36",
                "street": "Металлургов",
                "title": "Красноярск № 24",
                "weekDayTime": "08:00:00 - 22:00:00"
            }
        ]
    },
]
const filteredRetails = [
    {
        "guid": "ad79dbbd-a976-4033-80ef-1edaf135d379",
        "product": "АСЕПТА БЕБЕ ЗУБ.ПАСТА ГЕЛЕВАЯ 0-3ЛЕТ 50МЛ.",
        "manufacturer": "ВЕРТЕКС",
        "inNameGuid": null,
        "inNameTitle": null,
        "categoryGuid": "5759391f-917a-47fb-b218-9bd626164734",
        "categoryTitle": "Уход за полостью рта",
        "retails": [
            {
                "countLast": 1,
                "priceRetail": 188,
                "brand": "Дешёвая Аптека",
                "buildNumber": "34",
                "city": "Красноярск",
                "coordinates": [
                    56.046846,
                    92.946805
                ],
                "guid": "d75c02a0-2b05-40e5-b39d-1a74ac03c9e9",
                "phone": "8 (391) 299-36-36",
                "street": "Металлургов",
                "title": "Красноярск № 24",
                "weekDayTime": "08:00:00 - 22:00:00"
            },
            {
                "countLast": 1,
                "priceRetail": 223,
                "brand": "Дешёвая Аптека",
                "buildNumber": "44",
                "city": "Красноярск",
                "coordinates": [
                    55.998957,
                    93.032846
                ],
                "guid": "c8e4aab2-01e4-470a-9d71-3c9845e4dafa",
                "phone": "8 (391) 268-46-46",
                "street": "Шевченко",
                "title": "Красноярск № 21",
                "weekDayTime": "08:00:00 - 22:00:00"
            },
            {
                "countLast": 5,
                "priceRetail": 209,
                "brand": "Дешёвая Аптека",
                "buildNumber": "19а",
                "city": "Красноярск",
                "coordinates": [
                    56.062851,
                    92.947065
                ],
                "guid": "68afc1b2-50df-48ae-9f5f-476ac76fe934",
                "phone": "8 (391) 216-50-77",
                "street": "Ястынская",
                "title": "Красноярск № 77",
                "weekDayTime": "08:00:00 - 22:00:00"
            }
        ]
    },
    {
        "guid": "f2d18000-4675-4008-9ee2-552359c041e4",
        "product": "АСЕПТА БАЛЬЗАМ Д/ДЕСЕН АДГЕЗИВНЫЙ 10Г. ТУБА",
        "manufacturer": "ВЕРТЕКС",
        "inNameGuid": null,
        "inNameTitle": null,
        "categoryGuid": "23c73c2f-845b-456a-bc85-6d3c0f7f34b0",
        "categoryTitle": "Уход за полостью рта",
        "retails": [
            {
                "countLast": 1,
                "priceRetail": 275,
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
                "countLast": 0.1,
                "priceRetail": 343,
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
];
const retailsArr = [
    {
        brand: 'Дешёвая Аптека',
        buildNumber: '34',
        city: 'Красноярск',
        coordinates: [56.046846, 92.946805],
        guid: 'd75c02a0-2b05-40e5-b39d-1a74ac03c9e9',
        phone: '8 (391) 299-36-36',
        street: 'Металлургов',
        title: 'Красноярск № 24',
        weekDayTime: '08:00 - 22:00',
        product: [
            {
                guid: 'ad79dbbd-a976-4033-80ef-1edaf135d379',
                product: 'АСЕПТА БЕБЕ ЗУБ.ПАСТА ГЕЛЕВАЯ 0-3ЛЕТ 50МЛ.',
                manufacturer: 'ВЕРТЕКС',
                inNameGuid: null,
                inNameTitle: null,
                categoryGuid: '5759391f-917a-47fb-b218-9bd626164734',
                categoryTitle: 'Уход за полостью рта',
                priceRetail: 188,
                countLast: 1,
                count: 1
            }
        ]
    },
    {
        brand: 'Дешёвая Аптека',
        buildNumber: '44',
        city: 'Красноярск',
        coordinates: [55.998957, 93.032846],
        guid: 'c8e4aab2-01e4-470a-9d71-3c9845e4dafa',
        phone: '8 (391) 268-46-46',
        street: 'Шевченко',
        title: 'Красноярск № 21',
        weekDayTime: '08:00 - 22:00',
        product: [
            {
                guid: 'ad79dbbd-a976-4033-80ef-1edaf135d379',
                product: 'АСЕПТА БЕБЕ ЗУБ.ПАСТА ГЕЛЕВАЯ 0-3ЛЕТ 50МЛ.',
                manufacturer: 'ВЕРТЕКС',
                inNameGuid: null,
                inNameTitle: null,
                categoryGuid: '5759391f-917a-47fb-b218-9bd626164734',
                categoryTitle: 'Уход за полостью рта',
                priceRetail: 223,
                countLast: 1,
                count: 1
            }
        ]
    },
    {
        brand: 'Дешёвая Аптека',
        buildNumber: '19а',
        city: 'Красноярск',
        coordinates: [56.062851, 92.947065],
        guid: '68afc1b2-50df-48ae-9f5f-476ac76fe934',
        phone: '8 (391) 216-50-77',
        street: 'Ястынская',
        title: 'Красноярск № 77',
        weekDayTime: '08:00 - 22:00',
        product: [
            {
                guid: 'ad79dbbd-a976-4033-80ef-1edaf135d379',
                product: 'АСЕПТА БЕБЕ ЗУБ.ПАСТА ГЕЛЕВАЯ 0-3ЛЕТ 50МЛ.',
                manufacturer: 'ВЕРТЕКС',
                inNameGuid: null,
                inNameTitle: null,
                categoryGuid: '5759391f-917a-47fb-b218-9bd626164734',
                categoryTitle: 'Уход за полостью рта',
                priceRetail: 209,
                countLast: 5,
                count: 3
            }
        ]
    },
    {
        brand: 'Дешёвая Аптека',
        buildNumber: '8',
        city: 'Красноярск',
        coordinates: [56.032459, 92.775883],
        guid: '97178c64-7196-41a5-abcd-0b44bdc05ca6',
        phone: '8 (391) 218-15-52',
        street: 'Тотмина',
        title: 'Красноярск № 52',
        weekDayTime: '08:00 - 22:00',
        product: [
            {
                guid: 'f2d18000-4675-4008-9ee2-552359c041e4',
                product: 'АСЕПТА БАЛЬЗАМ Д/ДЕСЕН АДГЕЗИВНЫЙ 10Г. ТУБА',
                manufacturer: 'ВЕРТЕКС',
                inNameGuid: null,
                inNameTitle: null,
                categoryGuid: '23c73c2f-845b-456a-bc85-6d3c0f7f34b0',
                categoryTitle: 'Уход за полостью рта',
                priceRetail: 275,
                countLast: 1,
                count: 0
            }
        ]
    },
    {
        brand: 'Гармония Здоровья',
        buildNumber: '27',
        city: 'Красноярск',
        coordinates: [56.0268, 92.779422],
        guid: '6a582b65-03fc-45b3-aaf2-178f3a26b299',
        phone: '8 (391) 247-42-42',
        street: 'Высотная',
        title: 'Красноярск № 17',
        weekDayTime: '07:30 - 22:00',
        product: [
            {
                guid: 'f2d18000-4675-4008-9ee2-552359c041e4',
                product: 'АСЕПТА БАЛЬЗАМ Д/ДЕСЕН АДГЕЗИВНЫЙ 10Г. ТУБА',
                manufacturer: 'ВЕРТЕКС',
                inNameGuid: null,
                inNameTitle: null,
                categoryGuid: '23c73c2f-845b-456a-bc85-6d3c0f7f34b0',
                categoryTitle: 'Уход за полостью рта',
                priceRetail: 343,
                countLast: 0.1,
                count: 0
            }
        ]
    }
]
const resultRetailsArr = retailsArr.map(item => {
    const sum = item.product.reduce((accumulator, currentValue) => {
        return ((currentValue.priceRetail * currentValue.count) + accumulator)
    }, 0)
    return {
        ...item,
        sum: +sum.toFixed(2)
    }
})


test('filterNullRetails - возвращает список товаров без аптек, в которых priceRetail равен нулю', () => {
    const resultArr = filterNullRetails(productsInfo);
    expect(resultArr).toStrictEqual(filteredRetails)
})

test('splitProductsInfo - разбиваем входной массива на два: retailsArr - аптеки с товаром в них, newCardItems - товары со списком аптек, где он есть', () => {

    const result = {retailsArr, newCardItems: filteredRetails}
    expect(splitProductsInfo(initialState, filteredRetails)).toStrictEqual(result)
})

test('upgradeRetailItems - добавляет к массиву retailsArr каждому элементу поле sum', () => {

    expect(upgradeRetailItems(retailsArr)).toStrictEqual(resultRetailsArr)
})

test('sortAndFilterCartItems', () => {
    const cartNow = initialState.cart.filter(item => filteredRetails.some((element => element.guid === item.itemId)))
    const isDelCartItem = cartNow < initialState.cart;

    expect(sortAndFilterCartItems(initialState, productsInfo)).toStrictEqual({
        ...initialState,
        cartItems: filteredRetails,
        retailsArr: resultRetailsArr,
        cart: cartNow,
        isDelCartItem,
        loading: 1,
        error: null
    })
})

