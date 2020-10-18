import React from "react"
import classes from "./FooterDesktop.module.css"
import logof from "../../img/logof.png";
import {NavLink} from "react-router-dom";

class FooterDesktop extends React.Component {

  render() {
    return (
      <footer>
        <div className='wrapper'>
          <div className={classes.row}>
            <NavLink to="/" className={classes.logo}>
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
          <div>
            <p>
              ВАЖНО! Мы не продаем товары на сайте и не доставляем заказы на дом. Под «заказом» на сайте понимается
              должным образом оформленный запрос Клиента на бронирование в аптечных
              организациях группы компаний ООО аптечная сеть «Гармония здоровья», а также ее партнеров по указанному
              на
              сайте адресу перечня Товаров, выбранных на сайте. Товар вам продает
              аптечная организация. Дистанционная продажа лекарственных средств (в том числе, с доставкой на дом)
              запрещена действующим законодательством Российской Федерации.
            </p>
            <p>
              Лицензия на осуществление фармацевтической деятельности № Л------------ от -- -----
            </p>
          </div>
        </div>
      </footer>
    )
  }
}

export default FooterDesktop