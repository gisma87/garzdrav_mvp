import React from "react"
import './FooterDesktop.scss'
import {NavLink} from "react-router-dom";
import SvgVkIcon from "../../img/SVGcomponents/SvgVkIcon";
import SvgInstaIcon from "../../img/SVGcomponents/SvgInstaIcon";
import SvgEmail from "../../img/SVGcomponents/SvgEmail";
import {useMediaQuery} from "react-responsive";

const FooterDesktop = () => {

  const isMobile = useMediaQuery({query: '(max-width: 900px)'})

  return (
    <>
      <section className='SubscriptionPanel'>
        <div className='SubscriptionPanel__content'>
          <div className='SubscriptionPanel__text'>
            <p>Подпишитесь и получайте</p>
            <p>лучшие предложения!</p>
          </div>

          <div className='SubscriptionPanel__formContainer'>
            <form className='SubscriptionPanel__form' onSubmit={(e) => {
              e.preventDefault()
              console.log(e.target.elements.email.value)
            }}>
              <input name='email' type="email" placeholder='e-mail'/>
              <button className='SubscriptionPanel__button'>
                <SvgEmail className='SubscriptionPanel__icon'/>
              </button>
            </form>
          </div>

        </div>
      </section>
      <footer className='FooterDesktop'>
        <div className='FooterDesktop__row'>
          <div className={'FooterDesktop__wrapperTop' + (isMobile ? '' : ' wrapper')}>
            <div className='FooterDesktop__infoCol'>
              <h6>О нас</h6>
              <ul>
                <li className='FooterDesktop__listItem'><NavLink to="/company/">О компании</NavLink></li>
                <li className='FooterDesktop__listItem'><NavLink to="/contacts/">Контакты</NavLink></li>
                <li className='FooterDesktop__listItem'><NavLink to="/ask-question/">Обратная связь</NavLink></li>
                <li className='FooterDesktop__listItem'><NavLink to="/in-development/">Размещение рекламы</NavLink></li>
              </ul>
            </div>
            <div className='FooterDesktop__infoCol'>
              <h6>Помощь</h6>
              <ul>
                <li className='FooterDesktop__listItem'><NavLink to="/how-to-buy/">Оформление заказа</NavLink></li>
                <li className='FooterDesktop__listItem'><NavLink to="/in-development/">Статус заказа</NavLink></li>
                <li className='FooterDesktop__listItem'><NavLink to="/cities/">Адреса аптек</NavLink></li>
                <li className='FooterDesktop__listItem'><NavLink to="/faq/">Популярные вопросы</NavLink></li>
              </ul>
            </div>
            <div className='FooterDesktop__socialCol'>
              <ul>
                <li className='FooterDesktop__iconContainer'>
                  <div className='FooterDesktop__icon'><SvgVkIcon className='FooterDesktop__iconVK'/></div>
                  <a href='https://vk.com/garzdrav' target="_blank" rel="noopener noreferrer">Мы Вконтакте</a>
                </li>
                <li className='FooterDesktop__iconContainer'>
                  <div className='FooterDesktop__icon'><SvgInstaIcon className='FooterDesktop__iconVK'/></div>
                  <a href='https://www.instagram.com/garzdrav/?hl=ru' target="_blank" rel="noopener noreferrer">Мы
                    Инстаграм</a>
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
            <p className='FooterDesktop__infoItem'>
              На сайте использован сервис
              <a rel="noopener noreferrer" target='_blank' href='https://yandex.ru/dev/predictor/'> «Яндекс.Предиктор»</a>
            </p>
            <p>Указанные на настоящем сайте аптеки работают в рамках нескольких самостоятельных, не связанных друг с другом юридических лиц.
              Под аптечной сетью понимается закупочный союз, объединяющий аптеки едиными условиями работы с поставщиками и производителями, но не отменяющий самостоятельность каждого юридического лица
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}

export default FooterDesktop