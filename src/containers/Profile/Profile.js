import React, {useState} from "react"
import './Profile.scss'
import LayoutDesktop from "../../hoc/LayoutDesktop";
import BlockWrapper from "../../components/BlockWrapper";
import FavoriteItem from "../../components/FavoriteItem";
import {Link, withRouter} from "react-router-dom";
import SvgCheck from "../../components/UI/icons/SvgCheck";
import {addedToCart, allItemRemovedFromCart, itemRemovedFromCart} from "../../actions";
import {compose} from "../../utils";
import withStoreService from "../../hoc/withStoreService/withStoreService";
import {connect} from "react-redux";

const ProfileSetting = () => {
  return (
    <BlockWrapper classStyle='ProfileSetting'>
      <h4>Настройки профиля</h4>
      <form>
        <BlockWrapper classStyle='ProfileSetting__item'>
          <p className='ProfileSetting__itemTitle'>Телефон</p>
          <div className='ProfileSetting__itemContent'>
            <p className='ProfileSetting__info'>+7 965 324 XX XX</p>
            <div className='ProfileSetting__check'><SvgCheck style={{color: 'green'}}/></div>
          </div>
        </BlockWrapper>
        <BlockWrapper classStyle='ProfileSetting__item'>
          <p className='ProfileSetting__itemTitle'>E-mail</p>
          <div className='ProfileSetting__itemContent'>
            <p className='ProfileSetting__info'>natan78@mail.ru</p>
            <div className='ProfileSetting__check'><SvgCheck style={{color: 'green'}}/></div>
          </div>
        </BlockWrapper>
        <BlockWrapper classStyle='ProfileSetting__item'>
          <p className='ProfileSetting__itemTitle'>Имя</p>
          <div className='ProfileSetting__itemContent'>
            <p className='ProfileSetting__info'>Ярополк</p>
          </div>
        </BlockWrapper>
        <BlockWrapper classStyle='ProfileSetting__item'>
          <p className='ProfileSetting__itemTitle'>Дата рождения</p>
          <div className='ProfileSetting__itemContent'>
            <p className='ProfileSetting__info'>30.12.1978</p>
          </div>
        </BlockWrapper>
        <BlockWrapper classStyle='ProfileSetting__item'>
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

const Favorites = ({item}) => {
  const {addedToCart, itemRemovedFromCart, cart, history, favorites} = item;
  const handlerToCards = (itemId) => {
    history.push(`/Cards/${itemId}`)
    window.scroll(0, 0)
  }
  return (
    <BlockWrapper classStyle='Favorites'>
      <h4>Избранное</h4>
      <div className='Favorites__container'>
        {
          favorites.map((item) => {
            return <FavoriteItem key={item}
                                 itemId={item}
                                 item={{addedToCart, itemRemovedFromCart, cart, handlerToCards}}/>
          })
        }

      </div>
    </BlockWrapper>
  )
}


const Profile = (props) => {

  const {addedToCart, itemRemovedFromCart, cart, history, favorites} = props;

  const [block, setBlock] = useState('favorites');

  return (
    <section className='Profile wrapper'>
      <h1>Личный кабинет</h1>
      <div className='Profile__mainContainer'>

        {block === 'main' && <BlockWrapper classStyle='Profile__menu'>
          <p>БОНУСЫ</p>
        </BlockWrapper>}

        {block === 'order' && <BlockWrapper classStyle='Profile__menu'>
          <p>ЗАКАЗЫ</p>
        </BlockWrapper>}

        {block === 'historyOrder' && <BlockWrapper classStyle='Profile__menu'>
          <p>ИСТОРИИ ЗАКАЗОВ</p>
        </BlockWrapper>}

        {block === 'favorites' && <Favorites item={{addedToCart, itemRemovedFromCart, cart, history, favorites}}/>}

        {block === 'favoriteRetail' && <BlockWrapper classStyle='Profile__menu'>
          <p>ЛЮБИМАЯ АПТЕКА</p>
        </BlockWrapper>}

        {block === 'profileSettings' && <ProfileSetting/>}


        <BlockWrapper classStyle='Profile__menu'>
          <ul className='Profile__items'>
            <li className='Profile__item' onClick={() => setBlock('main')}>Бонусы</li>
            <li className='Profile__item' onClick={() => setBlock('order')}>Заказы</li>
            <li className='Profile__item' onClick={() => setBlock('historyOrder')}>Истории заказов</li>
            <li className='Profile__item' onClick={() => setBlock('favorites')}>Избранное</li>
            <li className='Profile__item' onClick={() => setBlock('favoriteRetail')}>Любимая аптека</li>
            <li className='Profile__item' onClick={() => setBlock('profileSettings')}>Настройка профиля</li>
          </ul>

          <Link to='/' className='Profile__btnOut' href="#">Выход из аккаунта</Link>
        </BlockWrapper>
      </div>
    </section>
  )
}


const mapStateToProps = ({cart, favorites}) => {
  return {cart, favorites}
}

const mapDispatchToProps = (dispatch) => {
  return {
    addedToCart: (item) => dispatch(addedToCart(item)),
    itemRemovedFromCart: (item) => dispatch(itemRemovedFromCart(item)),
    allItemRemovedFromCart: (item) => dispatch(allItemRemovedFromCart(item))
  }
}

export default compose(
  withStoreService(),
  connect(mapStateToProps, mapDispatchToProps)
)(withRouter(Profile))