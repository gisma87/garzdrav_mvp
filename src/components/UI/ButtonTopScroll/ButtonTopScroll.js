import React from "react";
import './ButtonTopScroll.scss'
import SvgAngleUpSolid from "../../../img/SVGcomponents/SvgAngleUpSolid";

const ButtonTopScroll = () => {
  return (
    <div className="ButtonTopScroll shakeInRight" onClick={() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }}>
      <SvgAngleUpSolid className='ButtonTopScroll__arrowIcon' />
    </div>
  )
}

export default ButtonTopScroll