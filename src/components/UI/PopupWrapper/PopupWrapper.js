import React from "react";
import './PopupWrapper.scss'
import Backdrop from "../Backdrop/Backdrop";
import SvgClose from "../icons/SvgClose";

const PopupWrapper = props => {
  return (
    <div className={'PopupWrapper' + (props.active ? ' PopupWrapper_is-opened' : '')}>
      <Backdrop onClick={props.onClick}/>
      <div className={"PopupWrapper__content " + props.classStyle}>
        <div className="PopupWrapper__close" onClick={props.onClick}>
          <SvgClose className='closeIcon'/>
        </div>
        {props.children}
      </div>
    </div>
  )
}

export default PopupWrapper