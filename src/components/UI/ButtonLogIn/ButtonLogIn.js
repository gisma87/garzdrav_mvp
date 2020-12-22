import React from "react";
import './ButtonLogIn.scss';
import iconLogin from '../../../img/icon/LogInSmall.png'

const ButtonLogIn = props => {
  return (
    <button className='ButtonLogIn' onClick={props.onClick}>
      <img src={iconLogin} alt="Вход" className='ButtonLogIn__img'/>
      <p className='ButtonLogIn__text'>{props.children}</p>
    </button>
  )
}

export default ButtonLogIn