import React from 'react';
import './IndexMobile.scss'
import SearchPanel from "../../components/SearchPanel";
import Advertising from "../../components/Advertising";
import PromoBlockMobile from "../../components/PromoBlockMobile/PromoBlockMobile";
// import ArticlesBlock from "../../components/ArticlesBlock";
import FooterDesktop from "../../components/FooterDesktop";
import Logo from "../../components/UI/Logo/Logo";
import Burger from "../../components/UI/Burger/Burger";
import {Link, withRouter} from "react-router-dom";
import LegkoBlock from "../../components/LegkoBlock/LegkoBlock";
import PopupLocation from "../../components/PopupLocation/PopupLocation";
import {onPopupLocation} from "../../actions";
import {connect} from "react-redux";

const indexMobile = (props) => {

  return (
    <div className='indexMobile'>

      <div className='indexMobile__logoPanel'>
        <Logo/>
        <p className='test'>Тестирование</p>
        <Link to={'/catalog'}>Каталог <Burger/></Link>
        {props.isPopupLocation && <PopupLocation active={props.isPopupLocation}
                                                 city={props.isCity.title}
                                                 openPopupCities={() => props.history.push('/cities/')}
                                                 closeThisPopup={props.onPopupLocation}
        />}
      </div>

      <section className='indexMobile__searchPanel'>
        <SearchPanel/>
      </section>
      <Advertising/>
      <PromoBlockMobile sizeTitle='16px'/>
      <LegkoBlock/>
      {/*<ArticlesBlock sizeTitle='16px'/>*/}
      <FooterDesktop/>
    </div>
  )
}

const mapStateToProps = ({isCity, isPopupLocation}) => {
  return {isCity, isPopupLocation}
}

const mapDispatchToProps = (dispatch) => {
  return {
    onPopupLocation: () => dispatch(onPopupLocation(false))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(indexMobile))