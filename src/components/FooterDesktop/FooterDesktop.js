import React from "react"
import './FooterDesktop.scss'
import logof from "../../img/logof.png";
import {NavLink} from "react-router-dom";

class FooterDesktop extends React.Component {

  render() {
    return (
      <footer className='FooterDesktop'>
        <div className='FooterDesktop__row'>
          <div className='wrapper FooterDesktop__wrapperTop'>
            <NavLink to="/" className='FooterDesktop__logo'>
              <img src={logof} alt="logo"/>
            </NavLink>
            <div>
              <h6>о компании</h6>
              <ul>
                <li>
                  <NavLink to="/company/">о нас</NavLink>
                </li>
                <li>
                  <NavLink to="/address/">адреса аптек</NavLink>
                </li>
                <li>
                  <a href="#">лицензии</a>
                </li>
              </ul>
            </div>
            <div>
              <h6>помощь</h6>
              <ul>
                <li>
                  <NavLink to="/howOrder/">как сделать заказ</NavLink>
                </li>
                <li>
                  <a href="#">вопрос-ответ</a>
                </li>
                <li>
                  <a href="#">задать вопрос</a>
                </li>
              </ul>
            </div>
            <div>
              <h6>сервис</h6>
              <ul>
                <li>
                  <a href="#">пользовательское соглашение</a>
                </li>
                <li>
                  <a href="#">политика конфиденциальности</a>
                </li>
                <li>
                  <NavLink to="/news/">новости</NavLink>
                </li>
                <li>
                  <NavLink to="/articles/">статьи</NavLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className='FooterDesktop__bottomContainer FooterDesktop__bottomContainer_lineStyle'>
          <div className='wrapper FooterDesktop__wrapperBottom FooterDesktop__infoGrid'>
            <p>
              Любая информация, размещенная на сайте, не является публичной офертой
            </p>
            <p>
              Лицензия на осуществление фармацевтической деятельности № Л------------ от -- -----
            </p>

            <p className='FooterDesktop__copyright'>© 2020 Гарздрав.ру</p>
          </div>
        </div>


      </footer>
    )
  }
}

export default FooterDesktop