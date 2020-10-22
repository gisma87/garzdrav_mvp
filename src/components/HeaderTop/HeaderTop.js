import React, {useState} from "react"
import './HeaderTop.scss'
import {NavLink} from "react-router-dom";
import PopupCities from "../PopupCities";

const HeaderTop = () => {
  const [popup, setPopup] = useState(false)
  const [city, setCity] = useState({title: 'Красноярск'})

  return (
    <div className='HeaderTop'>
      <div className='wrapper'>
        <div className='HeaderTop__headItem' onClick={() => setPopup(true)}>
          <span>{city.title}</span>
        </div>
        <ul className='HeaderTop__headItems'>
          <li>
            <NavLink className='HeaderTop__link' to="/address/">Аптеки</NavLink>
          </li>
          <li>
            <NavLink className='HeaderTop__link' to="/howOrder/">Как сделать заказ</NavLink>
          </li>
          <li>
            <NavLink className='HeaderTop__link' to="/howOrder/">Акции</NavLink>
          </li>
        </ul>
        <span className='HeaderTop__headItem'>Задать вопрос</span>
      </div>
      <PopupCities active={popup}
                   onClick={() => setPopup(false)}
                   onSelectCity={(item) => {
                     setCity(item);
                     setPopup(false);
                   }}
      />
    </div>
  )
}

export default HeaderTop