import React, {useEffect} from "react";
import './AppMobile.scss'
import ScrollToTop from "../utils/ScrollToTop";
import Loader from "../components/UI/Loader";
import {Redirect, Route, Switch} from "react-router-dom";
import Cart from "../containers/Cart";
import AskQuestion from "../containers/AskQuestion";
import PrivacyPolicy from "../containers/PrivacyPolicy";
import Company from "../containers/Company";
import Articles from "../containers/Articles";
import Profile from "../containers/Profile";
import PromoPage from "../containers/PromoPage";
import Promotion from "../containers/Promotion";
import Cards from "../containers/Cards";
import CardPage from "../containers/CardPage";
import {fetchCities, rewriteCart} from "../actions";
import {compose} from "../utils";
import withStoreService from "../hoc/withStoreService/withStoreService";
import {connect} from "react-redux";
import MobileBottomNavbar from "../components/MobileBottomNavbar";
import indexMobile from "../containers/IndexMobile";
import CitiesMobile from "../containers/CitiesMobile/CitiesMobile";
import Faq from "../containers/Faq/Faq";

function AppMobile(props) {

  useEffect(() => {
    props.fetchCities();
    if (localStorage.getItem("cart")) {
      props.rewriteCart(JSON.parse(localStorage.getItem("cart")))
    }
  }, [])

  useEffect(() => console.log('RENDER APP'))

  return (
    <div className="App">
      <ScrollToTop/>
      <Loader classStyle={props.loading ? 'Loader_is-opened' : ''}/>
      <Switch>
        <Route exact path="/" component={indexMobile}/>
        <Route exact path="/cities/" component={CitiesMobile}/>
        {/*<Route path="/address/" component={Cities}/>*/}
        {/*<Route path="/cities/" component={Cities}/>*/}
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
      <MobileBottomNavbar/>
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
    rewriteCart: (item) => dispatch(rewriteCart(item))
  }
}

export default compose(
  withStoreService(),
  connect(mapStateToProps, mapDispatchToProps)
)(AppMobile)