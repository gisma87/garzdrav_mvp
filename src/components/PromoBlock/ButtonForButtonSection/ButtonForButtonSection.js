import React from "react";
import './ButtonForButtonSection.scss'

const ButtonForButtonSection = ({title, isActive, onClick}) => {
  return (
    <button className={'ButtonForButtonSection ' + (isActive ? 'ButtonForButtonSection__active' : '')}
            onClick={onClick}
    >
      {title}
    </button>
  )
}

export default ButtonForButtonSection