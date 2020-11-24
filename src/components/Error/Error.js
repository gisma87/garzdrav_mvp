import React from "react";
import './Error.scss'
import errorSvg from "../../img/errorSvg.svg";

const Error = () => {
  return (
    <img className='ErrorMessage' src={errorSvg} alt="error"/>
  )
}

export default Error