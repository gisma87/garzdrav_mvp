import React, {useEffect, useState} from "react"
import './HeaderFixed.scss'
import {NavLink} from "react-router-dom";
import SearchPanel from "../SearchPanel";
import iconCart from '../../img/cartmin.png'
import ButtonTopScroll from "../UI/ButtonTopScroll";

const HeaderFixed = () => {
  const [count, setCount] = useState(0);
  const [isLogin, setIsLogin] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0)


  useEffect(() => {
    // УДАЛИТЬ - ТЕСТОВОЕ
    const x = localStorage.getItem('count') || 0 ? localStorage.getItem('count') : 0
    setCount(x)


    const handleScroll = () => {
      setLastScrollY(window.scrollY)
      console.log(window.scrollY)
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  })

  return (
    <div className={'HeaderFixed ' + (lastScrollY > 40 ? 'HeaderFixed--active' : '')}>
      <div className='wrapper HeaderFixed__wrapper'>
        <NavLink to="/" className='HeaderFixed__logo'/>

        <SearchPanel/>

        <div className='HeaderFixed__rightblock'>
          <NavLink to="/cart/" className='HeaderFixed__cart'>
            <img src={iconCart} alt="корзина"/>
            {count !== 0 ? <span className='HeaderFixed__cartCount'>{count}</span> :
              <span className='HeaderFixed__cartText'>Корзина</span>}
          </NavLink>
          <button className='HeaderFixed__logIn' onClick={() => localStorage.clear()}>Войти</button>
        </div>
      </div>
      {lastScrollY > 400 && <ButtonTopScroll/>}
    </div>
  )
}

export default HeaderFixed

