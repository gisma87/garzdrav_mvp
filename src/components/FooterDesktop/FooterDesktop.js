import React from "react"
import './FooterDesktop.scss'
import {NavLink} from "react-router-dom";
import SvgVkIcon from "../../img/SVGcomponents/SvgVkIcon";
import SvgInstaIcon from "../../img/SVGcomponents/SvgInstaIcon";

class FooterDesktop extends React.Component {

  render() {
    return (
      <footer className='FooterDesktop'>
        <div className='FooterDesktop__row'>
          <div className='wrapper FooterDesktop__wrapperTop'>
            <div>
              <h6>О нас</h6>
              <ul>
                <li className='FooterDesktop__listItem'><NavLink to="/company/">о компании</NavLink></li>
                <li className='FooterDesktop__listItem'><NavLink to="/">Контакты</NavLink></li>
                <li className='FooterDesktop__listItem'><NavLink to="/ask-question/">Обратная связь</NavLink></li>
                <li className='FooterDesktop__listItem'><NavLink to="/">Размещение рекламы</NavLink></li>
              </ul>
            </div>
            <div>
              <h6>Помощь</h6>
              <ul>
                <li className='FooterDesktop__listItem'><NavLink to="/">Оформление заказа</NavLink></li>
                <li className='FooterDesktop__listItem'><NavLink to="/">Статус заказа</NavLink></li>
                <li className='FooterDesktop__listItem'><NavLink to="/cities/">Адреса аптек</NavLink></li>
                <li className='FooterDesktop__listItem'><NavLink to="/faq/">Популярные вопросы</NavLink></li>
              </ul>
            </div>
            <div>
              <ul>
                <li className='FooterDesktop__iconContainer'>
                  <div className='FooterDesktop__icon'><SvgVkIcon className='FooterDesktop__iconVK'/></div>
                  <NavLink to="/">Мы Вконтакте</NavLink>
                </li>
                <li className='FooterDesktop__iconContainer'>
                  <div className='FooterDesktop__icon'><SvgInstaIcon className='FooterDesktop__iconVK'/></div>
                  <NavLink to="/">Мы Инстаграм</NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className='FooterDesktop__bottomContainer FooterDesktop__bottomContainer_lineStyle'>
          <div className='wrapper FooterDesktop__wrapperBottom FooterDesktop__infoContainer'>
            <p className='FooterDesktop__copyright'>© «Аптекалегко.ру»</p>
            <p className='FooterDesktop__infoItem'>
              <NavLink to="/confidentiality/">Политика конфиденциальности и обработки персональных данных</NavLink>
            </p>
            <p className='FooterDesktop__infoItem'>
              <NavLink to="/confidentiality/">Пользовательское соглашение</NavLink>
            </p>
          </div>
        </div>
      </footer>
    )
  }
}

export default FooterDesktop