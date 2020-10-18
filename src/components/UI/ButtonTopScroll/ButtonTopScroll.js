import React from "react";
import './ButtonTopScroll.scss'

const ButtonTopScroll = () => {
  return (
    <div className="ButtonTopScroll shakeInRight" onClick={() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }}>
      <i className="fas fa-arrow-up"/>
    </div>
  )
}

export default ButtonTopScroll