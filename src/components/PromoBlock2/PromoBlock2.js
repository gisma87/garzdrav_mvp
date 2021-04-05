import React from "react";
import './PromoBlock2.scss'
import baner from '../../img/baners/MiniDoctorEnergy_Banner_1210x250.jpg'

const PromoBlock2 = props => {

  return (
    <div className='PromoBlock2'>
      {/*<div className={'PromoBlock2__wrapper' + classStyle} style={style}></div>*/}
      <img className='PromoBlock2__baner' src={baner} alt="baner"/>
    </div>
  )
}

export default PromoBlock2