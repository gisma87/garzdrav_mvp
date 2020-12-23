import React from "react";
import './CountButton.scss'

const CountButton = props => {

  return (
    <div className='CountButton'>
      <button className='CountButton__decrement' onClick={props.onDecrement}><span>–</span></button>
      <p className='CountButton__count'>{props.count}</p>
      <button className='CountButton__increment' onClick={props.onIncrement}><span>+</span></button>
    </div>
  )
}

export default CountButton