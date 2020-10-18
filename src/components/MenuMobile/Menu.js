import React from "react";
import './Menu.css'
import DropdownItem from "../DropdownItem/Dropdown-item";

class Menu extends React.Component {

  render() {
    return (
      <div className='menu'>
        <nav>
          <a href="/" aria-current="page" className="logo-min" />
          <div className="menu__auth">
            Вход / Регистрация
            <svg id="login" viewBox="0 0 18 18">
              <path
                d="M4.07323 0.510504C4.07323 0.228561 4.30013 0 4.58004 0H14.1906C14.3488 0 14.4979 0.0743848 14.5937 0.201117L14.1906 0.510504C14.5937 0.201117 14.5937 0.201117 14.5937 0.201117L14.5947 0.202355L14.5961 0.204253C14.5972 0.205739 14.5986 0.207662 14.6004 0.210023C14.6039 0.214744 14.6087 0.221212 14.6146 0.22941C14.6266 0.245806 14.6433 0.269126 14.6644 0.299235C14.7065 0.359446 14.7658 0.446846 14.8384 0.560345C14.9835 0.787287 15.1818 1.11894 15.4011 1.54658C15.8394 2.40142 16.3632 3.64298 16.7122 5.20063C17.4123 8.32531 17.4034 12.7 14.634 17.7368C14.5447 17.8992 14.3749 18 14.1906 18H4.58014C4.58014 18 4.58004 18 4.58004 17.4895C4.58004 16.979 4.58014 16.979 4.58014 16.979H13.8897C16.3832 12.2965 16.3628 8.27893 15.7235 5.42542C15.3967 3.96731 14.9069 2.80762 14.5005 2.01513C14.2975 1.61911 14.1157 1.31559 13.9863 1.11327C13.9648 1.07971 13.9448 1.04894 13.9264 1.02101H4.58004C4.30013 1.02101 4.07323 0.792448 4.07323 0.510504ZM4.58004 17.4895L4.58014 16.979C4.30024 16.979 4.07323 17.2076 4.07323 17.4895C4.07323 17.7714 4.30024 18 4.58014 18L4.58004 17.4895ZM6.82296 5.28805C6.99215 5.06345 7.31007 5.01953 7.53305 5.18996L11.8706 8.50525C12.1612 8.71779 12.1333 9.12288 11.8987 9.32278C11.8938 9.32693 11.8889 9.33098 11.8839 9.33494L7.55801 12.7485C7.33767 12.9224 7.01912 12.8834 6.8465 12.6615C6.67389 12.4395 6.71258 12.1186 6.93292 11.9448L10.104 9.44244H0.506807C0.226905 9.44244 0 9.21387 0 8.93193C0 8.64999 0.226905 8.42143 0.506807 8.42143H10.084L6.92034 6.00332C6.69737 5.83289 6.65377 5.51266 6.82296 5.28805Z"/>
            </svg>
          </div>

          <ul className="menu__list">
            <DropdownItem blockTitle='О компании'
                          blockText={['О нас', 'Адреса аптек', 'Лицензии']}/>

            <DropdownItem blockTitle='Помощь и обратная связь'
                          blockText={['Как сделать заказ', 'Задать вопрос', 'Часто задаваемые вопросы']}/>

            <DropdownItem blockTitle='Услуги и сервис'
                          blockText={['Пользовательское соглашения', 'Политика конфиденциальности', 'Новости', 'Статьи']}/>

            <li>
              <p className='menu__item'>Скидки</p>
              <p className='menu__item'>Акции</p>
            </li>
          </ul>
        </nav>

        <div className="menu__location">
          <div className="menu__location-item location">
            <i className="location__icon location__icon--pin-accent"/>
            <span className="menu__location-text">
              <span>Красноярск</span>
              <span className="menu__location-text menu__location-text_description">(51 аптек доставки)</span>
            </span>
          </div>
          <a href="/"
             className="menu__location-item location"
             aria-current="page">
            <i className="location__icon location__icon--cross-accent"/>
            <span className="menu__location-text">Выбрать аптеку доставки</span>
          </a>
        </div>

        <div className="menu__info">
          <h4 className="menu__info-heading">Круглосуточные звонки по России:</h4>
          <a href="tel:88007008888" className="phone">8 (800) XXX-XX-XX</a>
        </div>

        <div className="menu__info">
          <h4 className="menu__info-heading">Мы в социальных сетях: </h4>
          <div className="socials menu__socials">
            <a href="/" target="_blank" className="socials__item">
              <i className="icon icon--vk socials__icon"/>
            </a>
            <a href="/" target="_blank" className="socials__item">
              <i className="icon icon--fb socials__icon"/>
            </a>
            <a href="/" target="_blank" className="socials__item">
              <i className="icon icon--ok socials__icon"/>
            </a>
            <a href="/" target="_blank" className="socials__item">
              <i className="icon icon--inst socials__icon"/>
            </a>
          </div>
        </div>

        <div className="menu__info-block">
          <p>2020 Аптека</p>
          <p>ВАЖНО! Мы не продаем товары на сайте и не доставляем заказы на дом. Под «заказом» на сайте
            понимается должным образом оформленный запрос Клиента на бронирование в аптечных организациях
            группы компаний ООО аптечная сеть «-------- --------», а также ее партнеров по указанному
            на сайте адресу перечня Товаров, выбранных на сайте. Товар вам продает аптечная организация.</p>
          <p>Дистанционная продажа лекарственных средств (в том числе, с доставкой на дом) запрещена
            действующим законодательством Российской Федерации.</p>
          <p>ОГРН: -------------</p>
          <p>Лицензия №&nbsp;Л-----------&nbsp;от&nbsp;--&nbsp;-----&nbsp;2020&nbsp;года</p>
        </div>
      </div>
    )
  }
}

export default Menu