import React, {useEffect} from 'react';
import {Redirect, Switch, Route} from 'react-router-dom';
import './App.css';
import 'normalize.css';
import Cities from "./containers/Cities";
import Cart from "./containers/Cart";
import Company from "./containers/Company";
import Articles from "./containers/Articles";
import Cards from "./containers/Cards";
import PromoPage from "./containers/PromoPage";
import CardPage from "./containers/CardPage";
import Promotion from "./containers/Promotion";
import {fetchCartItems, fetchCities, rewriteCart} from "./actions";
import {compose} from "./utils";
import withStoreService from "./hoc/withStoreService/withStoreService";
import {connect} from "react-redux";
import Profile from "./containers/Profile";
import HeaderDesktop from "./components/HeaderDesktop";
import FooterDesktop from "./components/FooterDesktop";
import IndexDesktop from "./containers/IndexDesktop/IndexDesktop";
import PrivacyPolicy from "./containers/PrivacyPolicy";
import AskQuestion from "./containers/AskQuestion";
import ScrollToTop from "./utils/ScrollToTop";
import Loader from "./components/UI/Loader";
import Faq from "./containers/Faq/Faq";

function App(props) {

  useEffect(() => {
    props.fetchCities();
    if (localStorage.getItem("arrItemId")) {
      props.storeService.setCartFromLocalStorage(props.rewriteCart)
      props.fetchCartItems()
    }
  }, [])

  return (
    <div className="App">
      <ScrollToTop/>
      <Loader classStyle={props.loading ? 'Loader_is-opened' : ''}/>
      <HeaderDesktop/>
      <Switch>
        <Route exact path="/" component={IndexDesktop}/>
        <Route path="/address/" component={Cities}/>
        <Route path="/cities/" component={Cities}/>
        <Route path="/cart/" component={Cart}/>
        <Route path="/ask-question/" component={AskQuestion}/>
        <Route path="/faq/" component={Faq}/>
        <Route path="/confidentiality/" component={PrivacyPolicy}/>
        <Route path="/company/" component={Company}/>
        {/*<Route path="/news/" component={News}/>*/}
        <Route path="/articles/" component={Articles}/>
        <Route path="/profile/" component={Profile}/>
        <Route path="/promotions/" exact component={PromoPage}/>
        <Route path="/promotions/:id"
               render={({match}) => <Promotion itemId={match.params.id}/>}/>
        <Route path="/Cards/" exact component={Cards}/>
        <Route path="/Cards/:id"
               render={({match}) => <CardPage itemId={match.params.id}/>}/>
        {/*<Route component={IndexDesktop}/>*/}
        <Redirect to={'/'}/>
      </Switch>
      <FooterDesktop/>
    </div>
  );
}

const mapStateToProps = ({cart, loading}) => {
  return {cart, loading}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const {storeService} = ownProps;
  return {
    fetchCities: fetchCities(storeService, dispatch),
    rewriteCart: (item) => dispatch(rewriteCart(item)),
    fetchCartItems: () => dispatch(fetchCartItems())
  }
}

export default compose(
  withStoreService(),
  connect(mapStateToProps, mapDispatchToProps)
)(App)
