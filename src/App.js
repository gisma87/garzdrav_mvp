import React, {useState} from 'react';
import {Redirect, Switch, Route} from 'react-router-dom';
import './App.scss';
import 'normalize.css';
import Cities from "./containers/Cities";
import Cart from "./containers/Cart";
import Company from "./containers/Company";
import Articles from "./containers/Articles";
import Cards from "./containers/Cards";
import PromoPage from "./containers/PromoPage";
import CardPage from "./containers/CardPage";
import Promotion from "./containers/Promotion";
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
import CatalogPage from "./containers/CatalogPage/CatalogPage";
import Development from "./components/Development/Development";
import InfoTEST from "./components/InfoTEST/InfoTEST";
import HowToBuyPage from "./containers/HowToBuyPage/HowToBuyPage";

function App(props) {

  const [howToBuyScroll, setHowToBuyScroll] = useState(false)

  return (
    <div className="App">
      <ScrollToTop/>
      <Loader classStyle={props.loading ? 'Loader_is-opened' : ''}/>
      <HeaderDesktop/>
      <Switch>
        <Route exact path="/"
               render={() => <IndexDesktop tag={howToBuyScroll} offScroll={() => setHowToBuyScroll(false)}/>}/>
        <Route path="/address/" component={Cities}/>
        <Route path="/cities/" component={Cities}/>
        <Route path="/cart/" component={Cart}/>
        <Route path="/ask-question/" component={AskQuestion}/>
        <Route path="/how-to-buy/" component={HowToBuyPage}/>
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
        <Route path="/Card/:id"
               render={({match}) => <CardPage itemId={match.params.id}/>}/>
        <Route path="/Cards/" exact component={Cards}/>
        <Route path="/Cards/:page/:sort?" render={({match}) => <Cards params={match.params}/>}/>
        <Route path="/catalog/:categoryId?/:page?/:sort?" render={({match}) => <CatalogPage params={match.params}/>}/>
        <Route path="/contacts/" render={() => <Cities contacts={true}/>}/>
        <Route path="/in-development/" component={Development}/>
        <Route path="/test/" component={InfoTEST}/>
        <Redirect to={'/'}/>
      </Switch>
      <FooterDesktop/>
    </div>
  );
}

const mapStateToProps = ({loading}) => {
  return {loading}
}

export default connect(mapStateToProps, null)(App)
