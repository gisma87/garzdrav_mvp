import React from "react";
import './PopupLocation.scss'
import SvgIconLocation from "../UI/icons/SvgIconLocation";

const PopupLocation = props => {
  return (

    <div className={"PopupLocation" + (props.active ? ' PopupLocation__active' : '')}>
      <p>Ваш город
        <SvgIconLocation className='PopupLocation__locationIcon'/>
        <b>{props.city}</b> ?
      </p>
      <button className="PopupLocation__btn"
              onClick={props.closeThisPopup}
      >Да
      </button>
      <button className="PopupLocation__btnLink" onClick={props.openPopupCities}>Выбрать другой</button>
    </div>

  )
}

export default PopupLocation