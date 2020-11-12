import React from "react"
import './Burger.css'

const Burger = props => {

  return (
    <div className='burger'>
      <div className={'burger__span' + (props.isActive ? ' active' : '')}>
        <span/>
      </div>
    </div>
  )
}

export default Burger