import React from "react";
import './CountButton.scss'

const CountButton = props => {

  return (
    <div className='CountButton'>
      <button className='CountButton__decrement' onClick={props.onDecrement}>–</button>
      <p className='CountButton__count' style={props.isLastCount ? {fontWeight: 'bold'} : {}}>{props.count}</p>
      <button className='CountButton__increment'
              onClick={props.onIncrement}
              style={props.isLastCount ? {background: 'rgba(144, 0, 32, .3'} : {}}
      >+</button>
    </div>
  )
}

export default CountButton