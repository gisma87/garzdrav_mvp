import React, {useState} from "react"
import './Profile.scss'
import LayoutDesktop from "../../hoc/LayoutDesktop";
import BlockWrapper from "../../components/BlockWrapper";
import {Link} from "react-router-dom";
import SvgCheck from "../../components/UI/icons/SvgCheck";

const ProfileSetting = () => {
  return (
    <BlockWrapper style='ProfileSetting'>
      <h4>Настройки профиля</h4>
      <form>
        <BlockWrapper style='ProfileSetting__item'>
          <p className='ProfileSetting__itemTitle'>Телефон</p>
          <div className='ProfileSetting__itemContent'>
            <p className='ProfileSetting__info'>+7 965 324 XX XX</p>
            <div className='ProfileSetting__check'><SvgCheck style={{color: 'green'}}/></div>
          </div>
        </BlockWrapper>
        <BlockWrapper style='ProfileSetting__item'>
          <p className='ProfileSetting__itemTitle'>E-mail</p>
          <div className='ProfileSetting__itemContent'>
            <p className='ProfileSetting__info'>natan78@mail.ru</p>
            <div className='ProfileSetting__check'><SvgCheck style={{color: 'green'}}/></div>
          </div>
        </BlockWrapper>
        <BlockWrapper style='ProfileSetting__item'>
          <p className='ProfileSetting__itemTitle'>Имя</p>
          <div className='ProfileSetting__itemContent'>
            <p className='ProfileSetting__info'>Ярополк</p>
          </div>
        </BlockWrapper>
        <BlockWrapper style='ProfileSetting__item'>
          <p className='ProfileSetting__itemTitle'>Дата рождения</p>
          <div className='ProfileSetting__itemContent'>
            <p className='ProfileSetting__info'>30.12.1978</p>
          </div>
        </BlockWrapper>
        <BlockWrapper style='ProfileSetting__item'>
          <p className='ProfileSetting__itemTitle'>Пол</p>

          <div className='ProfileSetting__itemContainer'>
            <div>

              <input type="radio" id="genderChoice1"
                     name="gender" value="male"/>
              <label htmlFor="genderChoice1">Мужской</label>
            </div>

            <div>
              <input type="radio" id="genderChoice2"
                     name="gender" value="female"/>
              <label htmlFor="genderChoice2">Женский</label>
            </div>
          </div>


        </BlockWrapper>
        <p className='ProfileSetting__changePass'>Сменить пароль</p>
        <button type='submit' className='ProfileSetting__submit'>Сохранить изменения</button>
      </form>
    </BlockWrapper>
  )
}


const Profile = (props) => {

  const [block, setBlock] = useState('profileSettings');

  return (
    <LayoutDesktop>
      <section className='Profile wrapper'>
        <h1>Личный кабинет</h1>
        <div className='Profile__mainContainer'>

          {block === 'main' && <BlockWrapper style='Profile__menu'>
            <p>БОНУСЫ</p>
          </BlockWrapper>}

          {block === 'order' && <BlockWrapper style='Profile__menu'>
            <p>ЗАКАЗЫ</p>
          </BlockWrapper>}

          {block === 'historyOrder' && <BlockWrapper style='Profile__menu'>
            <p>ИСТОРИИ ЗАКАЗОВ</p>
          </BlockWrapper>}

          {block === 'favorits' && <BlockWrapper style='Profile__menu'>
            <p>ИЗБРАННОЕ</p>
          </BlockWrapper>}

          {block === 'favoritRetail' && <BlockWrapper style='Profile__menu'>
            <p>ЛЮБИМАЯ АПТЕКА</p>
          </BlockWrapper>}

          {block === 'profileSettings' && <ProfileSetting/>}


          <BlockWrapper style='Profile__menu'>
            <ul className='Profile__items'>
              <li className='Profile__item' onClick={() => setBlock('main')}>Бонусы</li>
              <li className='Profile__item' onClick={() => setBlock('order')}>Заказы</li>
              <li className='Profile__item' onClick={() => setBlock('historyOrder')}>Истории заказов</li>
              <li className='Profile__item' onClick={() => setBlock('favorits')}>Избранное</li>
              <li className='Profile__item' onClick={() => setBlock('favoritRetail')}>Любимая аптека</li>
              <li className='Profile__item' onClick={() => setBlock('profileSettings')}>Настройка профиля</li>
            </ul>

            <Link to='/' className='Profile__btnOut' href="#">Выход из аккаунта</Link>
          </BlockWrapper>
        </div>
      </section>
    </LayoutDesktop>
  )
}

export default Profile