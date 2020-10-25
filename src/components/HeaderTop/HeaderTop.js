import React, {useState} from "react"
import './HeaderTop.scss'
import {NavLink} from "react-router-dom";
import PopupCities from "../PopupCities";
import {setIsCity} from "../../actions";
import {compose} from "../../utils";
import withStoreService from "../../hoc/withStoreService/withStoreService";
import {connect} from "react-redux";

const HeaderTop = (props) => {
  const {cities, isCity, setIsCity} = props;
  const [popup, setPopup] = useState(false)

  return (
    <div className='HeaderTop'>
      <div className='wrapper'>
        <div className='HeaderTop__headItem' onClick={() => setPopup(true)}>
          <span>{isCity.title}</span>
        </div>
        <ul className='HeaderTop__headItems'>
          <li>
            <NavLink className='HeaderTop__link' to="/address/">Аптеки</NavLink>
          </li>
          <li>
            <NavLink className='HeaderTop__link' to="/howOrder/">Как сделать заказ</NavLink>
          </li>
          <li>
            <NavLink className='HeaderTop__link' to="/promotions/">Акции</NavLink>
          </li>
        </ul>
        <span className='HeaderTop__headItem'>Задать вопрос</span>
      </div>
      <PopupCities active={popup}
                   cities={cities}
                   onClick={() => setPopup(false)}
                   onSelectCity={(item) => {
                     setIsCity(item)
                     setPopup(false);
                   }}
      />
    </div>
  )
}

const mapStateToProps = ({cities, loading, error, isCity}) => {
  return {cities, loading, error, isCity}
}

const mapDispatchToProps = (dispatch) => {
  return {
    setIsCity: (item) => dispatch(setIsCity(item))
  }
}

export default compose(
  withStoreService(),
  connect(mapStateToProps, mapDispatchToProps)
)(HeaderTop)