import React from 'react';
import {Switch, Route, BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux'
import './App.css';
import 'normalize.css';
import IndexPage from "./containers/IndexPage/IndexPage";
import HowOrder from "./containers/HowOrder";
import Cities from "./containers/Cities";
import Cart from "./containers/Cart";
import Company from "./containers/Company";
import News from "./containers/News";
import Articles from "./containers/Articles";
import Cards from "./containers/Cards";
import PromoPage from "./containers/PromoPage";
import CardPage from "./containers/CardPage";
import store from "./store";
import {StoreServiceProvider} from "./components/StoreServiceContext";
import StoreService from "./service/StoreService";
import Promotion from "./containers/Promotion";

const storeService = new StoreService();

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <StoreServiceProvider value={storeService}>
          <BrowserRouter basename="/">
            <Switch>
              <Route exact path="/" component={IndexPage}/>
              <Route path="/address/" component={Cities}/>
              <Route path="/howOrder/" component={HowOrder}/>
              <Route path="/cities/" component={Cities}/>
              <Route path="/cart/" component={Cart}/>
              <Route path="/company/" component={Company}/>
              <Route path="/news/" component={News}/>
              <Route path="/articles/" component={Articles}/>
              <Route path="/promotions/" exact component={PromoPage}/>
              <Route path="/promotions/:id"
                     render={({match}) => <Promotion itemId={match.params.id}/>}/>
              <Route path="/Cards/" exact component={Cards}/>
              <Route path="/Cards/:id"
                     render={({match}) => <CardPage itemId={match.params.id}/>}/>
              <Route component={IndexPage}/>
            </Switch>
          </BrowserRouter>
        </StoreServiceProvider>
      </Provider>
    </div>
  );
}

export default App;
