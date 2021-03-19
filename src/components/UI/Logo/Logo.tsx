import React from "react";
import './Logo.scss'
import logo from '../../../img/logo/iconALsmall.png'
import {NavLink} from "react-router-dom";

const Logo = () => {
    return (
        <NavLink to='/' className='Logo'>
            <img src={logo} alt="логотип" className='Logo__img'/>
            <div className='Logo__textContent'>
                <p className='Logo__legko'>легко</p>
                <div className='Logo__text'>
                    <p className='Logo__internet'>интернет</p>
                    <p>аптека</p>
                </div>
            </div>
        </NavLink>
    )
}

export default Logo