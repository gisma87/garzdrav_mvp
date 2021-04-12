import reducer from "./index";
import {ActionTypes, StateTypes} from "../types";
import {
    Action_closePopupLogin,
    Action_openPopupLogin,
    Action_setActiveBonusCard,
    ActionStatusRequestRepeatOrder,
    ActionItemsForPromoBlock,
    Action_setInternetSales,
    ActionAddFavoritesToStore,
    ActionSetFavoritesToStore,
    ActionDelFavoritesToStore,
    Action_setProductsToCategory, ActionAddedToCart, ActionProductsFromSearchLoaded,
} from "../actions/actionType";

let initialState = {} as StateTypes;

beforeEach(() => {
    initialState = {
        cart: [{itemId: 'guid_1', count: 1}, {itemId: 'guid_2', count: 3}],
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

describe('test reducer', () => {

    test('isPopupLogin in true', () => {
        const action = {type: ActionTypes.OPEN_POPOP_LOGIN} as Action_openPopupLogin;
        const resultState = {...initialState, isPopupLogin: true}
        expect(reducer(initialState, action)).toStrictEqual(resultState);
    });

    test('isPopupLogin in false', () => {
        const action = {type: ActionTypes.CLOSE_POPOP_LOGIN} as Action_closePopupLogin;
        const resultState = {...initialState, isPopupLogin: false}
        expect(reducer(initialState, action)).toStrictEqual(resultState);
    });

    test('set activeBonusCard', () => {
        const payload = {
            barcode: 1111111,
            accumulationBalance: 2222222,
            currentBalance: 333333,
            saleBalance: 4444,
            level: ' super S',
            parameter: 'parameter 2'
        }
        const action = {type: ActionTypes.SET_ACTIVE_BONUS_CARD, payload} as Action_setActiveBonusCard;
        const resultState = {
            ...initialState, activeBonusCard: {
                barcode: 1111111,
                accumulationBalance: 2222222,
                currentBalance: 333333,
                saleBalance: 4444,
                level: ' super S',
                parameter: 'parameter 2'
            }
        }
        expect(reducer(initialState, action)).toStrictEqual(resultState);
    });

    test('set statusRequestRepeatOrder', () => {
        const payload = 'executed';
        const action = {type: ActionTypes.SET_STATUS_REQUEST_REPEAT_ORDER, payload} as ActionStatusRequestRepeatOrder;
        const resultState = {
            ...initialState, statusRequestRepeatOrder: 'executed'
        }

        // @ts-ignore
        const actionFail = {
            type: ActionTypes.SET_STATUS_REQUEST_REPEAT_ORDER,
            payload: 1
        } as ActionStatusRequestRepeatOrder;
        const resultState2 = {...initialState, statusRequestRepeatOrder: ''}
        expect(reducer(initialState, action)).toStrictEqual(resultState);
        expect(reducer(initialState, actionFail)).toStrictEqual(resultState2);
    });

    test('set itemsForPromoBlock1', () => {
        const payload = [{
            img: undefined,
            guid: 'guidPromoItem',
            product: 'productName',
            manufacturer: 'manufacturerTitle',
            categoryGuid: 'string',
            retails: [{
                guid: 'retailGuid',
                countLast: 2,
                priceRetail: 12,
                brand: 'string',
                buildNumber: 'string',
                city: 'string',
                coordinates: [96, 58.1234],
                phone: '1111111111',
                street: 'string',
                title: 'string',
                weekDayTime: '9 - 21'
            }],
        }];
        const action = {type: ActionTypes.SET_ITEMS_FOR_PROMOBLOCK_1, payload} as ActionItemsForPromoBlock;
        const resultState = {...initialState, itemsForPromoBlock1: payload}
        expect(reducer(initialState, action)).toStrictEqual(resultState);
    });

    test('set internetSales, loading - 1, error: null', () => {
        const payload = [{
            orderGuid: 'string',
            sum: 123,
            status: 'string',
            dateCreated: 'string',
            number: 'string',
            retail: [],
            items: [],
        }];
        const action = {type: ActionTypes.REQUEST_INTERNET_SALES, payload} as Action_setInternetSales;
        const resultState = {
            ...initialState,
            internetSales: payload,
            loading: 1,
            error: null
        }
        expect(reducer(initialState, action)).toStrictEqual(resultState);
    });

    describe('set/add/delete favorites', () => {
        test('set favorites', () => {
            const payload = [{guid: 'stringGuid_1'}, {guid: 'stringGuid_2'}, {guid: 'stringGuid_3'}];
            const action = {type: ActionTypes.SET_FAVORITES_TO_STORE, payload} as ActionSetFavoritesToStore;
            const resultState = {
                ...initialState,
                favorites: payload,
            }
            expect(reducer(initialState, action)).toStrictEqual(resultState);
        });
        test('add favorites', () => {
            const payload = {guid: 'stringGuid_4'};
            const action = {type: ActionTypes.ADD_FAVORITES_TO_STORE, payload} as ActionAddFavoritesToStore;
            const stateSetFavorites = {
                ...initialState,
                favorites: [{guid: 'stringGuid_1'}, {guid: 'stringGuid_2'}, {guid: 'stringGuid_3'}]
            };
            const resultState = {
                ...stateSetFavorites,
                favorites: [{guid: 'stringGuid_1'}, {guid: 'stringGuid_2'}, {guid: 'stringGuid_3'}, {guid: 'stringGuid_4'}],
                loadingFavorites: 0
            }

            expect(reducer(stateSetFavorites, action)).toStrictEqual(resultState);
        });
        test('delete favorites', () => {
            const payload = 'stringGuid_2';
            const action = {type: ActionTypes.DELETE_FAVORITES_TO_STORE, payload} as ActionDelFavoritesToStore;
            const stateSetFavorites = {
                ...initialState,
                favorites: [{guid: 'stringGuid_1'}, {guid: 'stringGuid_2'}, {guid: 'stringGuid_3'}, {guid: 'stringGuid_4'}]
            };
            const resultState = {
                ...stateSetFavorites,
                favorites: [{guid: 'stringGuid_1'}, {guid: 'stringGuid_3'}, {guid: 'stringGuid_4'}],
                loadingFavorites: 0
            }

            expect(reducer(stateSetFavorites, action)).toStrictEqual(resultState);
        });
    })

    test('set productsToCategory & countProductsCategory', () => {
        const payload = {
            products: [{guid: 'guid_1', product: 'productName_1'}, {guid: 'guid_2', product: 'productName_2'}],
            count: 7,
        };
        const action = {type: ActionTypes.SET_PRODUCTS_TO_CATEGORY, payload} as Action_setProductsToCategory;
        const resultState = {
            ...initialState,
            productsToCategory: [{guid: 'guid_1', product: 'productName_1'}, {
                guid: 'guid_2',
                product: 'productName_2'
            }],
            countProductsCategory: 7,
            loading: 1,
            error: null
        }

        expect(reducer(initialState, action)).toStrictEqual(resultState);
    });


    describe('work with cart', () => {
        test('add item to cart', () => {
            const payload = 'guid_item_3';
            const action = {type: ActionTypes.ITEM_ADDED_TO_CART, payload} as ActionAddedToCart;
            const action2 = {type: ActionTypes.ITEM_ADDED_TO_CART, payload: 'guid_2'} as ActionAddedToCart;
            const resultState = {
                ...initialState,
                cart: [{itemId: 'guid_1', count: 1}, {itemId: 'guid_2', count: 3}, {itemId: 'guid_item_3', count: 1}]
            }
            const resultState2 = {
                ...initialState,
                cart: [{itemId: 'guid_1', count: 1}, {itemId: 'guid_2', count: 4}, {itemId: 'guid_item_3', count: 1}]
            }

            expect(reducer(initialState, action)).toStrictEqual(resultState);
            expect(reducer(resultState, action2)).toStrictEqual(resultState2);
        });

        test('removed item to cart', () => {
            // удаляем несуществующий элемент - ничего не происходит
            expect(reducer(initialState, {
                type: ActionTypes.ITEM_REMOVED_FROM_CART,
                payload: 'guid_itemNever'
            })).toStrictEqual(initialState);

            // удаляем guid_2 - count уменьшается с 3 до 2
            expect(reducer(initialState, {
                type: ActionTypes.ITEM_REMOVED_FROM_CART,
                payload: 'guid_2'
            })).toStrictEqual({...initialState, cart: [{itemId: 'guid_1', count: 1}, {itemId: 'guid_2', count: 2}]});

            // в предыдущем обращении cart был записан в localStorage, и здесь cart берётся из localStorage, и уже в нём удаляется payload.
            expect(reducer(initialState, {
                type: ActionTypes.ITEM_REMOVED_FROM_CART,
                payload: 'guid_1'
            })).toStrictEqual({...initialState, cart: [{itemId: 'guid_2', count: 2}]});

        });

        test('removed all item from cart', () => {
            localStorage.clear()
            expect(reducer(initialState, {
                type: ActionTypes.ALL_ITEM_REMOVED_FROM_CART,
                payload: 'guid_2'
            })).toStrictEqual({...initialState, cart: [{itemId: 'guid_1', count: 1}]})
            expect(reducer(initialState, {
                type: ActionTypes.ALL_ITEM_REMOVED_FROM_CART,
                payload: 'guid_1'
            })).toStrictEqual({...initialState, cart: []})
        })

        test('SET_COUNT_ITEM_CART - subtracts from itemCart count', () => {
            localStorage.clear()
            expect(reducer(initialState, {
                type: ActionTypes.SET_COUNT_ITEM_CART,
                payload: {idProduct: 'guid_2', delta: 2}
            })).toStrictEqual({...initialState, cart: [{itemId: 'guid_1', count: 1}, {itemId: 'guid_2', count: 1}]})

            expect(reducer(initialState, {
                type: ActionTypes.SET_COUNT_ITEM_CART,
                payload: {idProduct: 'guid_1', delta: 2}
            })).toStrictEqual({...initialState, cart: [{itemId: 'guid_2', count: 1}]})
        })
    })

    test('устанавливаем массив продуктов по запросу из поисковой строки', () => {
        const action: ActionProductsFromSearchLoaded = {
            type: ActionTypes.FETCH_PRODUCTS_FROM_SEARCH_SUCCESS,
            payload: {
                products: [{guid: 'guidProduct', product: 'productName'}],
                count: 2,
                productSearch: 'поисковый запрос'
            }
        }

        expect(reducer(initialState, action)).toStrictEqual({
            ...initialState,
            productsFromSearch: action.payload.products,
            countProductsSearch: action.payload.count,
            productSearch: action.payload.productSearch,
            loading: 1,
            error: null
        })
    })

    test('записываем cities, и собираем и записываем regions', () => {
        const resultRegions = [
            {
                "cities": [
                    {
                        "guid": "guid",
                        "title": "titleCity"
                    },
                    {
                        "guid": "guid2",
                        "title": "titleCity2"
                    }
                ],
                "regionGuid": "01",
                "regionTitle": "01"
            },
            {
                "regionGuid": "9b1cf9ca-330d-4a23-b5af-82109c9687d2",
                "regionTitle": "Республика Хакасия",
                "cities": [
                    {
                        "guid": "c384a061-7641-4605-a340-afb825fdcb70",
                        "title": "Абакан"
                    },
                    {
                        "guid": "196197c1-a07f-4334-a9d5-bb8b309feb18",
                        "title": "Аскиз с."
                    },
                    {
                        "guid": "65ed10ca-b493-4ad5-a31b-a7b23d6e26a0",
                        "title": "Белый Яр"
                    },
                    {
                        "guid": "be66d79e-8c7a-44b2-9333-ea06b7ed38e1",
                        "title": "Бея с."
                    },
                    {
                        "guid": "07653be9-7192-49ed-a1ef-89eb8314fbb2",
                        "title": "Подсинее с."
                    },
                    {
                        "guid": "ceaeeb98-e2e4-44e2-9a25-f61b2d6cf9c0",
                        "title": "Саяногорск"
                    },
                    {
                        "guid": "e3047a3b-3933-484c-bb4b-0e6bdd2ce673",
                        "title": "Таштып с."
                    },
                    {
                        "guid": "3fae35a4-43fa-4583-9a79-bd2053335168",
                        "title": "Усть-Абакан пос."
                    },
                    {
                        "guid": "d59b0b79-84e6-4825-a8a4-6b93789a47c7",
                        "title": "Черногорск"
                    },
                    {
                        "guid": "6e8290a1-cd85-43e2-93cd-728a1a69bcdc",
                        "title": "Шира пос."
                    }
                ]
            },
            {
                "regionGuid": "69954feb-0f39-4202-aa2c-4a2e1cc898a6",
                "regionTitle": "Краснодарский край",
                "cities": [
                    {
                        "guid": "a439bb99-eb92-4ce2-b881-3bfc200b58c3",
                        "title": "Адлер"
                    },
                    {
                        "guid": "8f33710c-079c-4cda-bd9d-ef72d538d7d9",
                        "title": "Сочи"
                    },
                    {
                        "guid": "59672add-9f4f-4649-acae-6d40a5a255df",
                        "title": "Хоста пос."
                    }
                ]
            },
            {
                "regionGuid": "14f50cfa-7b02-40e5-ab58-9598d841dfd0",
                "regionTitle": "Иркутская область",
                "cities": [
                    {
                        "guid": "db74bd34-11ba-414a-a809-c892dbc79226",
                        "title": "Ангарск"
                    },
                    {
                        "guid": "076c308a-bc5a-4acb-b62d-c7a215c01933",
                        "title": "Иркутск"
                    }
                ]
            },
            {
                "regionGuid": "85c1010c-7b33-4a46-b79c-e84672cda7e4",
                "regionTitle": "Кемеровская область",
                "cities": [
                    {
                        "guid": "4617a45b-c3c7-4a2d-b524-b190c4881ce6",
                        "title": "Анжеро-Судженск"
                    },
                    {
                        "guid": "5360427d-3089-4d26-bd97-aba7a0d5f974",
                        "title": "Кемерово"
                    }
                ]
            },
            {
                "regionGuid": "3a25bb73-7fe3-432f-839b-859da67a5347",
                "regionTitle": "Красноярский край",
                "cities": [
                    {
                        "guid": "8684f607-054b-4844-b1ec-5ebb0af9fb97",
                        "title": "Ачинск"
                    },
                    {
                        "guid": "3c9cbe00-03ea-41c4-8062-66d7f9450861",
                        "title": "Боготол"
                    },
                    {
                        "guid": "a0adcae6-ac62-4a73-b361-02b0320ef792",
                        "title": "Богучаны с."
                    },
                    {
                        "guid": "734ad938-5bc4-49af-84ef-b4b334b5e776",
                        "title": "Большая Мурта"
                    },
                    {
                        "guid": "f33ad751-fcf4-4bf3-a767-d340a4977ad9",
                        "title": "Бородино"
                    },
                    {
                        "guid": "3e038419-7a21-4630-8cf4-87ee653c9f50",
                        "title": "Дивногорск"
                    },
                    {
                        "guid": "01ad43b0-1bb8-4793-860f-f965d751ec46",
                        "title": "Железногорск"
                    },
                    {
                        "guid": "ee30e12e-5cbf-4277-8091-06aec859f210",
                        "title": "Зеленогорск"
                    },
                    {
                        "guid": "2b6c5951-8511-4b8b-9fb4-b18f1ea23f98",
                        "title": "Кайеркан"
                    },
                    {
                        "guid": "dfced7c6-dede-4111-af0d-b0bfaff81f4b",
                        "title": "Канск"
                    },
                    {
                        "guid": "c073f480-6d97-4af3-976b-3c069f39db52",
                        "title": "Красноярск"
                    },
                    {
                        "guid": "b2f9cb22-e92e-4d1f-9372-8a4f320db970",
                        "title": "Курагино пос."
                    },
                    {
                        "guid": "49b3efeb-6099-493c-a33c-1b39a35a9aae",
                        "title": "Лесосибирск"
                    },
                    {
                        "guid": "78703c52-f3cb-4bd3-b783-7bb9e91ab45a",
                        "title": "Минусинск"
                    },
                    {
                        "guid": "5788a664-f9de-4355-b9fd-8809cf83599f",
                        "title": "Назарово"
                    },
                    {
                        "guid": "91b20855-1c6d-4b47-aa27-026aee1ce7d5",
                        "title": "Норильск"
                    },
                    {
                        "guid": "2d32fd7b-ead9-4f40-bbe7-a8e5cd5cab54",
                        "title": "Сосновоборск"
                    },
                    {
                        "guid": "127ea079-4441-46a3-8013-563635011377",
                        "title": "Талнах"
                    },
                    {
                        "guid": "6bd45a87-ebd0-476e-b478-202548802642",
                        "title": "Шушенское"
                    }
                ]
            },
            {
                "regionGuid": "c973948f-fde5-4db5-8f7e-43d225bf9159",
                "regionTitle": "Алтайский край",
                "cities": [
                    {
                        "guid": "e7c3020e-1f43-4b2e-bd9a-7b9d67ab7a43",
                        "title": "Барнаул"
                    }
                ]
            },
            {
                "regionGuid": "d9c44231-c98e-4ec7-9acd-43036ae6601f",
                "regionTitle": "Новосибирская область",
                "cities": [
                    {
                        "guid": "bd38fef8-62e5-40dd-a2ef-0c4410f770c4",
                        "title": "Горный пос."
                    },
                    {
                        "guid": "4fb1fc81-002f-4934-a4d4-918521b279d5",
                        "title": "Краснообск"
                    },
                    {
                        "guid": "7771db27-19fb-4594-95c0-ff2e73ac727d",
                        "title": "Новосибирск"
                    },
                    {
                        "guid": "8b0381b2-e8f2-4aae-808c-6f9e9813dbc4",
                        "title": "Озерный пос."
                    },
                    {
                        "guid": "1ee7b8f2-abd2-4ff3-bb71-313d0d312abd",
                        "title": "Тогучин"
                    }
                ]
            },
            {
                "regionGuid": "5203b835-02f3-4a9d-a247-92ef5519faee",
                "regionTitle": "Московская область",
                "cities": [
                    {
                        "guid": "29d6d5f0-d5df-4284-8a02-b4af6333cda1",
                        "title": "Подольск"
                    }
                ]
            },
            {
                "regionGuid": "5c76ec3c-aced-4d5a-bf4c-58130860dc90",
                "regionTitle": "Республика Крым",
                "cities": [
                    {
                        "guid": "6826b4c5-3e39-49e3-8ac8-fb02c0090b8c",
                        "title": "Ялта"
                    }
                ]
            }
        ]
        const payload = [
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
            },
            {
                "guid": "196197c1-a07f-4334-a9d5-bb8b309feb18",
                "title": "Аскиз с.",
                "regionGuid": "9b1cf9ca-330d-4a23-b5af-82109c9687d2",
                "regionTitle": "Республика Хакасия"
            },
            {
                "guid": "8684f607-054b-4844-b1ec-5ebb0af9fb97",
                "title": "Ачинск",
                "regionGuid": "3a25bb73-7fe3-432f-839b-859da67a5347",
                "regionTitle": "Красноярский край"
            },
            {
                "guid": "e7c3020e-1f43-4b2e-bd9a-7b9d67ab7a43",
                "title": "Барнаул",
                "regionGuid": "c973948f-fde5-4db5-8f7e-43d225bf9159",
                "regionTitle": "Алтайский край"
            },
            {
                "guid": "65ed10ca-b493-4ad5-a31b-a7b23d6e26a0",
                "title": "Белый Яр",
                "regionGuid": "9b1cf9ca-330d-4a23-b5af-82109c9687d2",
                "regionTitle": "Республика Хакасия"
            },
            {
                "guid": "be66d79e-8c7a-44b2-9333-ea06b7ed38e1",
                "title": "Бея с.",
                "regionGuid": "9b1cf9ca-330d-4a23-b5af-82109c9687d2",
                "regionTitle": "Республика Хакасия"
            },
            {
                "guid": "3c9cbe00-03ea-41c4-8062-66d7f9450861",
                "title": "Боготол",
                "regionGuid": "3a25bb73-7fe3-432f-839b-859da67a5347",
                "regionTitle": "Красноярский край"
            },
            {
                "guid": "a0adcae6-ac62-4a73-b361-02b0320ef792",
                "title": "Богучаны с.",
                "regionGuid": "3a25bb73-7fe3-432f-839b-859da67a5347",
                "regionTitle": "Красноярский край"
            },
            {
                "guid": "734ad938-5bc4-49af-84ef-b4b334b5e776",
                "title": "Большая Мурта",
                "regionGuid": "3a25bb73-7fe3-432f-839b-859da67a5347",
                "regionTitle": "Красноярский край"
            },
            {
                "guid": "f33ad751-fcf4-4bf3-a767-d340a4977ad9",
                "title": "Бородино",
                "regionGuid": "3a25bb73-7fe3-432f-839b-859da67a5347",
                "regionTitle": "Красноярский край"
            },
            {
                "guid": "bd38fef8-62e5-40dd-a2ef-0c4410f770c4",
                "title": "Горный пос.",
                "regionGuid": "d9c44231-c98e-4ec7-9acd-43036ae6601f",
                "regionTitle": "Новосибирская область"
            },
            {
                "guid": "3e038419-7a21-4630-8cf4-87ee653c9f50",
                "title": "Дивногорск",
                "regionGuid": "3a25bb73-7fe3-432f-839b-859da67a5347",
                "regionTitle": "Красноярский край"
            },
            {
                "guid": "01ad43b0-1bb8-4793-860f-f965d751ec46",
                "title": "Железногорск",
                "regionGuid": "3a25bb73-7fe3-432f-839b-859da67a5347",
                "regionTitle": "Красноярский край"
            },
            {
                "guid": "ee30e12e-5cbf-4277-8091-06aec859f210",
                "title": "Зеленогорск",
                "regionGuid": "3a25bb73-7fe3-432f-839b-859da67a5347",
                "regionTitle": "Красноярский край"
            },
            {
                "guid": "076c308a-bc5a-4acb-b62d-c7a215c01933",
                "title": "Иркутск",
                "regionGuid": "14f50cfa-7b02-40e5-ab58-9598d841dfd0",
                "regionTitle": "Иркутская область"
            },
            {
                "guid": "2b6c5951-8511-4b8b-9fb4-b18f1ea23f98",
                "title": "Кайеркан",
                "regionGuid": "3a25bb73-7fe3-432f-839b-859da67a5347",
                "regionTitle": "Красноярский край"
            },
            {
                "guid": "dfced7c6-dede-4111-af0d-b0bfaff81f4b",
                "title": "Канск",
                "regionGuid": "3a25bb73-7fe3-432f-839b-859da67a5347",
                "regionTitle": "Красноярский край"
            },
            {
                "guid": "5360427d-3089-4d26-bd97-aba7a0d5f974",
                "title": "Кемерово",
                "regionGuid": "85c1010c-7b33-4a46-b79c-e84672cda7e4",
                "regionTitle": "Кемеровская область"
            },
            {
                "guid": "4fb1fc81-002f-4934-a4d4-918521b279d5",
                "title": "Краснообск",
                "regionGuid": "d9c44231-c98e-4ec7-9acd-43036ae6601f",
                "regionTitle": "Новосибирская область"
            },
            {
                "guid": "c073f480-6d97-4af3-976b-3c069f39db52",
                "title": "Красноярск",
                "regionGuid": "3a25bb73-7fe3-432f-839b-859da67a5347",
                "regionTitle": "Красноярский край"
            },
            {
                "guid": "b2f9cb22-e92e-4d1f-9372-8a4f320db970",
                "title": "Курагино пос.",
                "regionGuid": "3a25bb73-7fe3-432f-839b-859da67a5347",
                "regionTitle": "Красноярский край"
            },
            {
                "guid": "49b3efeb-6099-493c-a33c-1b39a35a9aae",
                "title": "Лесосибирск",
                "regionGuid": "3a25bb73-7fe3-432f-839b-859da67a5347",
                "regionTitle": "Красноярский край"
            },
            {
                "guid": "78703c52-f3cb-4bd3-b783-7bb9e91ab45a",
                "title": "Минусинск",
                "regionGuid": "3a25bb73-7fe3-432f-839b-859da67a5347",
                "regionTitle": "Красноярский край"
            },
            {
                "guid": "5788a664-f9de-4355-b9fd-8809cf83599f",
                "title": "Назарово",
                "regionGuid": "3a25bb73-7fe3-432f-839b-859da67a5347",
                "regionTitle": "Красноярский край"
            },
            {
                "guid": "7771db27-19fb-4594-95c0-ff2e73ac727d",
                "title": "Новосибирск",
                "regionGuid": "d9c44231-c98e-4ec7-9acd-43036ae6601f",
                "regionTitle": "Новосибирская область"
            },
            {
                "guid": "91b20855-1c6d-4b47-aa27-026aee1ce7d5",
                "title": "Норильск",
                "regionGuid": "3a25bb73-7fe3-432f-839b-859da67a5347",
                "regionTitle": "Красноярский край"
            },
            {
                "guid": "8b0381b2-e8f2-4aae-808c-6f9e9813dbc4",
                "title": "Озерный пос.",
                "regionGuid": "d9c44231-c98e-4ec7-9acd-43036ae6601f",
                "regionTitle": "Новосибирская область"
            },
            {
                "guid": "29d6d5f0-d5df-4284-8a02-b4af6333cda1",
                "title": "Подольск",
                "regionGuid": "5203b835-02f3-4a9d-a247-92ef5519faee",
                "regionTitle": "Московская область"
            },
            {
                "guid": "07653be9-7192-49ed-a1ef-89eb8314fbb2",
                "title": "Подсинее с.",
                "regionGuid": "9b1cf9ca-330d-4a23-b5af-82109c9687d2",
                "regionTitle": "Республика Хакасия"
            },
            {
                "guid": "ceaeeb98-e2e4-44e2-9a25-f61b2d6cf9c0",
                "title": "Саяногорск",
                "regionGuid": "9b1cf9ca-330d-4a23-b5af-82109c9687d2",
                "regionTitle": "Республика Хакасия"
            },
            {
                "guid": "2d32fd7b-ead9-4f40-bbe7-a8e5cd5cab54",
                "title": "Сосновоборск",
                "regionGuid": "3a25bb73-7fe3-432f-839b-859da67a5347",
                "regionTitle": "Красноярский край"
            },
            {
                "guid": "8f33710c-079c-4cda-bd9d-ef72d538d7d9",
                "title": "Сочи",
                "regionGuid": "69954feb-0f39-4202-aa2c-4a2e1cc898a6",
                "regionTitle": "Краснодарский край"
            },
            {
                "guid": "127ea079-4441-46a3-8013-563635011377",
                "title": "Талнах",
                "regionGuid": "3a25bb73-7fe3-432f-839b-859da67a5347",
                "regionTitle": "Красноярский край"
            },
            {
                "guid": "e3047a3b-3933-484c-bb4b-0e6bdd2ce673",
                "title": "Таштып с.",
                "regionGuid": "9b1cf9ca-330d-4a23-b5af-82109c9687d2",
                "regionTitle": "Республика Хакасия"
            },
            {
                "guid": "1ee7b8f2-abd2-4ff3-bb71-313d0d312abd",
                "title": "Тогучин",
                "regionGuid": "d9c44231-c98e-4ec7-9acd-43036ae6601f",
                "regionTitle": "Новосибирская область"
            },
            {
                "guid": "3fae35a4-43fa-4583-9a79-bd2053335168",
                "title": "Усть-Абакан пос.",
                "regionGuid": "9b1cf9ca-330d-4a23-b5af-82109c9687d2",
                "regionTitle": "Республика Хакасия"
            },
            {
                "guid": "59672add-9f4f-4649-acae-6d40a5a255df",
                "title": "Хоста пос.",
                "regionGuid": "69954feb-0f39-4202-aa2c-4a2e1cc898a6",
                "regionTitle": "Краснодарский край"
            },
            {
                "guid": "d59b0b79-84e6-4825-a8a4-6b93789a47c7",
                "title": "Черногорск",
                "regionGuid": "9b1cf9ca-330d-4a23-b5af-82109c9687d2",
                "regionTitle": "Республика Хакасия"
            },
            {
                "guid": "6e8290a1-cd85-43e2-93cd-728a1a69bcdc",
                "title": "Шира пос.",
                "regionGuid": "9b1cf9ca-330d-4a23-b5af-82109c9687d2",
                "regionTitle": "Республика Хакасия"
            },
            {
                "guid": "6bd45a87-ebd0-476e-b478-202548802642",
                "title": "Шушенское",
                "regionGuid": "3a25bb73-7fe3-432f-839b-859da67a5347",
                "regionTitle": "Красноярский край"
            },
            {
                "guid": "6826b4c5-3e39-49e3-8ac8-fb02c0090b8c",
                "title": "Ялта",
                "regionGuid": "5c76ec3c-aced-4d5a-bf4c-58130860dc90",
                "regionTitle": "Республика Крым"
            }
        ]

        expect(reducer(initialState, {type: ActionTypes.FETCH_CITIES_SUCCESS, payload})).toStrictEqual({
            ...initialState,
            cities: payload,
            regions: resultRegions,
            loading: 1,
            error: null
        })
    })
})


