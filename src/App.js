import React, {useEffect} from 'react';
import {Switch, Route} from 'react-router-dom';
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
import Promotion from "./containers/Promotion";

import {fetchCities} from "./actions";
import {compose} from "./utils";
import withStoreService from "./hoc/withStoreService/withStoreService";
import {connect} from "react-redux";

function App(props) {

  useEffect(() => {
    props.fetchCities();
  }, [])

  return (
    <div className="App">
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
    </div>
  );
}

const mapStateToProps = ({cart}) => {
  return {cart}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const {storeService} = ownProps;
  return {
    fetchCities: fetchCities(storeService, dispatch)
  }
}

export default compose(
  withStoreService(),
  connect(mapStateToProps, mapDispatchToProps)
)(App)
