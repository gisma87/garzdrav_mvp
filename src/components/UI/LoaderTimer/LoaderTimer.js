import React, {useEffect, useRef, useState} from "react";
import './LoaderTimer.scss'

const LoaderTimer = (props) => {


  function Timer() {
    const nodeTimer = useRef(null)

    useEffect(() => {
      const nodeTimer = document.querySelector('.LoaderTimer__timer');
      let seconds = 60;
      if (nodeTimer) {
        const timer = setInterval(() => {
          --seconds
          nodeTimer.textContent = seconds
          if (seconds <= 0) clearInterval(timer);
        }, 1000)
      }
    }, [])


    return (
      <p ref={nodeTimer} className="LoaderTimer__timer">60</p>
    )
  }


  return (
    <div className={'LoaderTimer' + (props.active ? ' LoaderTimer_active' : '')}>
      {
        props.active &&
        <>
          <Timer/>
          <div className='LoaderTimer__holder'>
            <div className="LoaderTimer__preloader">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        </>
      }
    </div>
  )
}
export default LoaderTimer