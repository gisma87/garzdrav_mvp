import React from "react";
import './PopupWrapper.scss'
import Backdrop from "../Backdrop/Backdrop";
import SvgClose from "../icons/SvgClose";

const PopupWrapper = props => {
  return (
    <div className={'PopupWrapper' + (props.active ? ' PopupWrapper_is-opened' : '')}>
      <Backdrop onClick={props.onClick}/>
      <div className="PopupWrapper__content">
        <div className="PopupWrapper__close" onClick={props.onClick}>
          <SvgClose className='closeIcon'/>
        </div>
        <div className={"PopupWrapper__container " + props.classStyle}>
          {props.children}
        </div>
      </div>
    </div>
  )
}

export default PopupWrapper