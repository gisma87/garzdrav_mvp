import React from "react";
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
import {connect} from "react-redux";
import MobileBottomNavbar from "../components/MobileBottomNavbar";
import indexMobile from "../containers/IndexMobile";
import CitiesMobile from "../containers/CitiesMobile/CitiesMobile";
import Faq from "../containers/Faq/Faq";
import CatalogPage from "../containers/CatalogPage/CatalogPage";
import Development from "../components/Development/Development";

function AppMobile(props) {

  return (
    <div className="App">
      <ScrollToTop/>
      <Loader classStyle={props.loading ? 'Loader_is-opened' : ''}/>
      <Switch>
        <Route exact path="/" component={indexMobile}/>
        <Route exact path="/cities/" component={CitiesMobile}/>
        <Route path="/cart/" component={Cart}/>
        <Route path="/ask-question/" component={AskQuestion}/>
        <Route path="/faq/" component={Faq}/>
        <Route path="/confidentiality/" component={PrivacyPolicy}/>
        <Route path="/company/" component={Company}/>
        <Route path="/articles/" exact component={Articles}/>
        <Route path="/articles/:id"
               render={({match}) => <Promotion itemId={match.params.id}/>}/>
        <Route path="/profile/" component={Profile}/>
        <Route path="/promotions/" exact component={PromoPage}/>
        <Route path="/promotions/:id"
               render={({match}) => <Promotion itemId={match.params.id}/>}/>
        <Route path="/Cards/" exact component={Cards}/>
        <Route path="/Card/:id"
               render={({match}) => <CardPage itemId={match.params.id}/>}/>
        <Route path="/catalog/" component={CatalogPage}/>
        <Route path="/contacts/" render={() => <CitiesMobile contacts={true}/>}/>
        <Route path="/in-development/" component={Development}/>
        <Redirect to={'/'}/>
      </Switch>
      <MobileBottomNavbar/>
    </div>
  );
}

const mapStateToProps = ({loading}) => {
  return {loading}
}

export default connect(mapStateToProps, null)(AppMobile)