import React from "react";
import './ButtonLogIn.scss';
import iconLogin from '../../../img/icon/LogInSmall.png'

type Props = {
    onClick(): void
}

const ButtonLogIn: React.FC<Props> = props => {
  return (
    <button className='ButtonLogIn' onClick={props.onClick}>
      <img src={iconLogin} alt="Вход" className='ButtonLogIn__img'/>
      <p className='ButtonLogIn__text'>{props.children}</p>
    </button>
  )
}

export default ButtonLogIn