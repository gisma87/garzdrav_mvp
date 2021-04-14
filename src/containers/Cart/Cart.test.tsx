import {getByText, render, screen} from "@testing-library/react";
import {Provider} from "react-redux";
import store from "../../store";
import {BrowserRouter} from "react-router-dom";
import React from "react";
import Cart from "./Cart";
import {addedToCart, setCartItems} from "../../actions";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom'

const cartItemsTest = [
    {
        "guid": "4c3d8870-ed5b-49ec-89cd-a7e662d25e7d",
        "product": "ПИРАЦЕТАМ 200МГ. №60 ТАБ. П/П/О /ОБНОВЛЕНИЕ/",
        "manufacturer": "ОБНОВЛЕНИЕ ПФК",
        "inNameGuid": "1e8ab1cc-cc8a-4997-a898-8580c1c5ac2f",
        "inNameTitle": "Пирацетам",
        "categoryGuid": "2eef26ae-7f31-43ff-8fe5-1f17126babb5",
        "categoryTitle": "Заболевания нервной системы",
        "retails": [
            {
                "countLast": 4,
                "priceRetail": 75,
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
                "countLast": 3,
                "priceRetail": 76,
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
            },
            {
                "countLast": 1,
                "priceRetail": 75,
                "brand": "Гармония Здоровья",
                "buildNumber": "14",
                "city": "Красноярск",
                "coordinates": [
                    56.019485,
                    92.843903
                ],
                "guid": "2d12cb82-0df2-4c8d-a181-62851a7d0f94",
                "phone": "8 (391) 200-16-50",
                "street": "Железнодорожников",
                "title": "Красноярск № 50",
                "weekDayTime": "08:00:00 - 22:00:00"
            },
            {
                "countLast": 5,
                "priceRetail": 77,
                "brand": "ВСЕМ (В7)",
                "buildNumber": "24",
                "city": "Красноярск",
                "coordinates": [
                    56.038705,
                    92.872595
                ],
                "guid": "0084fb08-0468-40ae-ad04-6bb3c99399d9",
                "phone": "8 (391) 218-18-90",
                "street": "Мартынова",
                "title": "Красноярск № 64",
                "weekDayTime": "08:00:00 - 22:00:00"
            }
        ]
    },
    {
        "guid": "08a0e303-439b-4bf2-8a01-a2a4268e97e3",
        "product": "НАЗИВИН 0,01% 5МЛ. №1 НАЗАЛ.КАПЛИ ФЛ./КАП.",
        "manufacturer": "Мерк КГаА для Никомед (NIKOMED )",
        "inNameGuid": "da66fa68-4839-43af-b1c0-444df9b9fead",
        "inNameTitle": "Оксиметазолин",
        "categoryGuid": "805357b5-9d43-455d-9763-4a9eb4aead2a",
        "categoryTitle": "Насморк",
        "retails": [
            {
                "countLast": 1,
                "priceRetail": 187,
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
                "countLast": 3,
                "priceRetail": 232,
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
                "countLast": 2,
                "priceRetail": 185,
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
    }
]

describe('Cart', () => {
    store.dispatch(addedToCart("4c3d8870-ed5b-49ec-89cd-a7e662d25e7d"))
    store.dispatch(addedToCart("08a0e303-439b-4bf2-8a01-a2a4268e97e3"))
    store.dispatch(setCartItems(cartItemsTest))
    const {asFragment, container} = render(
        <Provider store={store}>
            <BrowserRouter basename="/">
                <Cart/>
            </BrowserRouter>
        </Provider>
    )

    const titlePanel = container.querySelector('.Cart__titlePanel')
    const btnIncrement = container.querySelector('.CountButton__increment')
    const btnDecrement = container.querySelector('.CountButton__decrement')
    const countFirstProduct = container.querySelector('.CountButton__count')
    const priceFirstProduct = container.querySelector('.CartItem__price')
    const closeIconFirstProduct = container.querySelector('.CartItem__closeIcon')
    const dropdown = container.querySelector('.RetailsListDropdown')
    const btnDropdown = container.querySelector('.CartItem__dropdownBtn')

    test('Cart snapshot / increment / decrement', () => {
        expect(asFragment()).toMatchSnapshot()

        expect(titlePanel?.textContent).toBe('В корзине 2 товара')
        expect(countFirstProduct?.textContent).toBe('1')
        expect(priceFirstProduct?.textContent).toBe('от 75.00 ₽')
        expect(getByText(container, /ул. Мартынова 24/i)).toBeInTheDocument()

        // кликаем плюс на первом товаре 10 раз - макс.кол. - 5шт
        if (btnIncrement) {
            for (let i = 1; i < 10; i++) {
                userEvent.click(btnIncrement)
                if (i < 5) {
                    expect(countFirstProduct?.textContent).toBe(`${i + 1}`)
                    expect(priceFirstProduct?.textContent).toBe(`от ${75 * (i + 1)}.00 ₽`)
                }
            }
        }
        expect(titlePanel?.textContent).toBe('В корзине 6 товаров')
        expect(countFirstProduct?.textContent).toBe('5')
        expect(priceFirstProduct?.textContent).toBe(`от ${75 * 5}.00 ₽`)

        // кликаем минус на первом товаре 10 раз - мин.кол. - 1шт
        if (btnDecrement) {
            for (let i = 0; i < 10; i++) {
                userEvent.click(btnDecrement)
            }
        }
        expect(titlePanel?.textContent).toBe('В корзине 2 товара')
        expect(countFirstProduct?.textContent).toBe('1')

        if (dropdown && btnDropdown) {
            expect(dropdown.classList.contains('RetailsListDropdown_contentDisabled')).toBeTruthy();
            userEvent.click(btnDropdown)
            expect(dropdown.classList.contains('RetailsListDropdown_contentDisabled')).toBeFalsy();
        }

        // удалили первый продукт
        if (closeIconFirstProduct) userEvent.click(closeIconFirstProduct);
        expect(titlePanel?.textContent).toBe('В корзине 1 товар')
        expect(countFirstProduct).not.toBeInTheDocument()
    })
})


