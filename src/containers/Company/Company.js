import React from "react"
import './Company.scss'
import devMessage from '../../img/devtMessage.svg'
import {Redirect} from "react-router-dom";


const Company = (props) => {

  return (
    <div className='Company wrapper'>
      <Redirect to={'/in-development/'}/>
      <h1>О компании</h1>

      <div className="Company__infoContent">
        <img src={devMessage} alt="В разработке"/>
      </div>

    </div>
  )
}


export default Company