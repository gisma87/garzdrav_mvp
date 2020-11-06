import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import store from "./store";
import {StoreServiceProvider} from "./components/StoreServiceContext";
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import StoreService from "./service/StoreService";
import MobileOrDesktop from "./MobileOrDesktop";


const storeService = new StoreService();

ReactDOM.render(
  <Provider store={store}>
    <StoreServiceProvider value={storeService}>
      <BrowserRouter basename="/">
        <MobileOrDesktop/>
      </BrowserRouter>
    </StoreServiceProvider>
  </Provider>,
  document.getElementById('root')
);
