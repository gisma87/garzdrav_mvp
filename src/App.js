import React from 'react';
import {Switch, Route, BrowserRouter} from 'react-router-dom';
import './App.css';
import 'normalize.css';
import IndexPage from "./containers/IndexPage/IndexPage";
import AddressPharmacy from "./containers/AddressPharmacy";
import HowOrder from "./containers/HowOrder";
import Cities from "./containers/Cities";
import Cart from "./containers/Cart";
import Company from "./containers/Company";
import News from "./containers/News";
import Articles from "./containers/Articles";
import Card from "./containers/Card/Card";
import Cards from "./containers/Cards";
import PromoPage from "./containers/PromoPage";

function App() {
  return (
    <div className="App">
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
          <Route path="/promo/" component={PromoPage}/>
          <Route path="/Cards/" exact component={Cards}/>
          <Route path="/Cards/:id"
                 render={({match}) => <Card itemId={match.params.id}/>}/>
          <Route component={IndexPage}/>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
