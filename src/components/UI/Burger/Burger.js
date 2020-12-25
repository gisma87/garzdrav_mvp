import React from "react"
import './Burger.scss'

const Burger = props => {

  return (
    <div className={'burger ' + (props.style === 'dark' ? 'burger__dark' : '')} onClick={props.onClick}>
      <div className={'burger__span' + (props.isActive ? ' active' : '')}>
        <span/>
      </div>
    </div>
  )
}

export default Burger