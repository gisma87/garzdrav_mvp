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
import IndexMobile from "../containers/IndexMobile";
import CitiesMobile from "../containers/CitiesMobile/CitiesMobile";
import Faq from "../containers/Faq/Faq";
import CatalogPage from "../containers/CatalogPage/CatalogPage";
import Development from "../components/Development/Development";
import {StateType} from "../store";
import HowToBuyPage from "../containers/HowToBuyPage/HowToBuyPage";
import MobileHeader from "../components/MobileHeader/MobileHeader";
import FooterDesktop from "../components/FooterDesktop";
import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary";

type Props = {
    loading?: number
}

const AppMobile: React.FC<Props> = (props) => {

    return (
        <ErrorBoundary>
            <div className="App">
                <ScrollToTop/>
                <Loader classStyle={props.loading ? 'Loader_is-opened' : ''}/>
                <MobileHeader/>
                <Switch>
                    <Route exact path="/" component={IndexMobile}/>
                    <Route exact path="/address/" component={CitiesMobile}/>
                    <Route exact path="/cities/" component={CitiesMobile}/>
                    <Route path="/cart/" component={Cart}/>
                    <Route path="/ask-question/" component={AskQuestion}/>
                    <Route path="/faq/" component={Faq}/>
                    <Route path="/how-to-buy/" component={HowToBuyPage}/>
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
                    <Route path="/catalog/:categoryId?/:page?/:sort?"
                           render={({match}) => <CatalogPage params={match.params}/>}/>
                    <Route path="/contacts/" render={() => <CitiesMobile contacts={true}/>}/>
                    <Route path="/in-development/" component={Development}/>
                    <Redirect to={'/'}/>
                </Switch>
                <FooterDesktop/>
            </div>
        </ErrorBoundary>
    );
}

const mapStateToProps = ({loading}: StateType): Props => {
    return {loading}
}

export default connect(mapStateToProps, null)(AppMobile)