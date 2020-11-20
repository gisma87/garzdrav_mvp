import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import store from "./store";
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import MobileOrDesktop from "./MobileOrDesktop";

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter basename="/">
      <MobileOrDesktop/>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
