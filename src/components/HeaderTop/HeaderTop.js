import React, {useState} from "react"
import './HeaderTop.scss'
import {Link, withRouter} from "react-router-dom";
import PopupCities from "../PopupCities";
import {fetchCartItems, setIsCity} from "../../actions";
import {connect} from "react-redux";

const HeaderTop = (props) => {
  const {regions, cities, isCity, setIsCity, history} = props;
  const [popup, setPopup] = useState(false)

  return (
    <div className='HeaderTop'>
      <div className='wrapper'>
        <div className='HeaderTop__headItem' onClick={() => {
          document.body.style.overflow = 'hidden'
          setPopup(true)
        }}>
          <span>{isCity.title}</span>
        </div>
        <ul className='HeaderTop__headItems'>
          <li>
            <Link className='HeaderTop__link' to="/address/">Аптеки</Link>
          </li>
          <li>
            <Link className='HeaderTop__link' to='/'
                  onClick={(event) => {
                    event.preventDefault()
                    history.push('/')
                    window.scrollTo({
                      top: 780,
                      left: 0,
                      behavior: 'smooth'
                    });
                  }}
            >Как сделать заказ</Link>
          </li>
          <li>
            <Link className='HeaderTop__link' to="/promotions/">Акции</Link>
          </li>
        </ul>
        <Link to='/ask-question/' className='HeaderTop__headItem HeaderTop__link'>Задать вопрос</Link>
      </div>
      <PopupCities active={popup}
                   isCity={isCity}
                   regions={regions}
                   onClick={() => {
                     document.body.style.overflow = 'auto'
                     setPopup(false)
                   }}
                   onSelectCity={(idCity) => {
                     document.body.style.overflow = 'auto'
                     const item = cities.find(cityItem => cityItem.guid === idCity)
                     setIsCity(item)
                     setPopup(false);
                     props.fetchCartItems()
                   }}
      />
    </div>
  )
}

const mapStateToProps = ({regions, cities, loading, error, isCity}) => {
  return {regions, cities, loading, error, isCity}
}

const mapDispatchToProps = (dispatch) => {
  return {
    setIsCity: (item) => dispatch(setIsCity(item)),
    fetchCartItems: () => dispatch(fetchCartItems())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(HeaderTop))