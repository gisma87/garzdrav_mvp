import React from "react";
import './PopupWrapper.scss'
import Backdrop from "../Backdrop/Backdrop";
import SvgClose from "../icons/SvgClose";

const PopupWrapper = props => {

  const isMap = typeof props.classStyle === 'string' && props.classStyle.toLowerCase().includes('map')

  return (
    <div className={'PopupWrapper' + (props.active ? ' PopupWrapper_is-opened' : '')}>
      <Backdrop onClick={props.onClick}/>
      <div className={"PopupWrapper__content " + (isMap ? props.classStyle : '')}>
        <div className="PopupWrapper__close" onClick={props.onClick}>
          <SvgClose className='closeIcon'/>
        </div>

        {
          isMap
            ? props.children
            : <div className={"PopupWrapper__container " + props.classStyle}>{props.children}</div>

        }

      </div>
    </div>
  )
}

export default PopupWrapper