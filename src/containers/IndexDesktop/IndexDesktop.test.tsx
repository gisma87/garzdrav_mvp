import {render} from "@testing-library/react";
import {Provider} from "react-redux";
import store from "../../store";
import {BrowserRouter} from "react-router-dom";
import React from "react";
import IndexDesktop from "./IndexDesktop";


test('IndexDesktop', () => {
    const {asFragment} = render(
        <Provider store={store}>
            <BrowserRouter basename="/">
                <IndexDesktop/>
            </BrowserRouter>
        </Provider>
    )

    expect(asFragment()).toMatchSnapshot()
})