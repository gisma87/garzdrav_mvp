import React, {useState} from "react"
import './HeaderTop.scss'
import {Link, withRouter} from "react-router-dom";
import PopupCities from "../PopupCities";
import {clearCart, fetchCartItems, onPopupLocation, setIsCity} from "../../actions";
import {connect} from "react-redux";
import PopupLocation from "../PopupLocation/PopupLocation";
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";

const HeaderTop = (props) => {
  const {regions, cities, isCity, setIsCity, isPopupLocation} = props;
  const [popup, setPopup] = useState(false)

  return (
    <ErrorBoundary>
      <div className='HeaderTop'>
        <div className='wrapper'>
          <div className='HeaderTop__headItem'>
          <span onClick={() => {
            document.body.style.overflow = 'hidden'
            setPopup(true)
          }}
          >
            {isCity?.title}</span>

            {isPopupLocation && <PopupLocation active={isPopupLocation}
                                               city={isCity.title}
                                               openPopupCities={() => setPopup(true)}
                                               closeThisPopup={props.onPopupLocation}
            />}

          </div>
          <ul className='HeaderTop__headItems'>
            <li>
              <Link className='HeaderTop__link' to="/address/">Аптеки</Link>
            </li>
            <li>
              <Link className='HeaderTop__link' to='/how-to-buy/'>Оформление заказа</Link>
            </li>
            {/*<li>*/}
            {/*  <Link className='HeaderTop__link' to="/test/">Информация</Link>*/}
            {/*</li>*/}
            <li>
              <a rel="noopener noreferrer" className='HeaderTop__link' target='_blank' href='http://kartalegko.ru/'>Бонусная
                карта</a>
            </li>
            <li>
              <Link className='HeaderTop__link' to="/ask-question/">Помощь</Link>
            </li>
          </ul>
        </div>

        <PopupCities active={popup}
                     isCity={isCity}
                     regions={regions}
                     cities={cities}
                     onClick={() => {
                       document.body.style.overflow = 'auto'
                       setPopup(false)
                     }}
                     clearCart={props.clearCart}
                     onSelectCity={(idCity) => {
                       document.body.style.overflow = 'auto'
                       const item = cities.find(cityItem => cityItem.guid === idCity)
                       setIsCity(item)
                       setPopup(false);
                       props.fetchCartItems()
                       props.onPopupLocation()
                     }}
        />
      </div>
    </ErrorBoundary>
  )
}

const mapStateToProps = ({regions, cities, loading, error, isCity, isPopupLocation}) => {
  return {regions, cities, loading, error, isCity, isPopupLocation}
}

const mapDispatchToProps = (dispatch) => {
  return {
    setIsCity: (item) => dispatch(setIsCity(item)),
    fetchCartItems: () => dispatch(fetchCartItems()),
    onPopupLocation: () => dispatch(onPopupLocation(false)),
    clearCart: () => dispatch(clearCart())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HeaderTop))