import React from "react";
import './PromoBlock2.scss'
import baner from '../../img/baners/MiniDoctorEnergy_Banner_1210x250.jpg'
import ErrorBoundary from "../ErrorBoundary/ErrorBoundary";

const PromoBlock2 = props => {

  return (
    <ErrorBoundary>
      <div className='PromoBlock2'>
        {/*<div className={'PromoBlock2__wrapper' + classStyle} style={style}></div>*/}
        <img className='PromoBlock2__baner' src={baner} alt="baner"/>
      </div>
    </ErrorBoundary>
  )
}

export default PromoBlock2