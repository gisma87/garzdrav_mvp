import {render, screen} from "@testing-library/react";
import {Provider} from "react-redux";
import store from "../../store";
import {BrowserRouter} from "react-router-dom";
import React from "react";
import HeaderFixed from "./HeaderFixed";
import '@testing-library/jest-dom'
import {addedToCart, allItemRemovedFromCart, itemRemovedFromCart} from "../../actions";


describe('HeaderFixed', () => {
    test('HeaderFixed snapshot', () => {
        const {asFragment, container} = render(
            <Provider store={store}>
                <BrowserRouter basename="/">
                    <HeaderFixed/>
                </BrowserRouter>
            </Provider>
        )

        const cartCount = container.getElementsByClassName('HeaderFixed__cartCount')

        expect(asFragment()).toMatchSnapshot()
        expect(cartCount[0].textContent).toBe("0")

        store.dispatch(addedToCart('idItemCart_01'))
        expect(cartCount[0].textContent).toBe("1")

        store.dispatch(addedToCart('idItemCart_01'))
        expect(cartCount[0].textContent).toBe("2")

        store.dispatch(addedToCart('idItemCart_01'))
        store.dispatch(addedToCart('idItemCart_01'))
        store.dispatch(addedToCart('idItemCart_01'))
        expect(cartCount[0].textContent).toBe("5")

        store.dispatch(itemRemovedFromCart('idItemCart_01'))
        store.dispatch(itemRemovedFromCart('idItemCart_01'))
        expect(cartCount[0].textContent).toBe("3")

        store.dispatch(allItemRemovedFromCart('idItemCart_01'))
        expect(cartCount[0].textContent).toBe("0")

        store.dispatch(itemRemovedFromCart('idItemCart_01'))
        store.dispatch(allItemRemovedFromCart('idItemCart_01'))
        expect(cartCount[0].textContent).toBe("0")
    })
})