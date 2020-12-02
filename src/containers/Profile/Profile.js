import React, {useEffect, useState} from "react"
import './Profile.scss'
import BlockWrapper from "../../components/BlockWrapper";
import FavoriteItem from "../../components/FavoriteItem";
import {Link, withRouter, Redirect} from "react-router-dom";
import {useMediaQuery} from 'react-responsive'
import SvgCheck from "../../components/UI/icons/SvgCheck";
import {addedToCart, allItemRemovedFromCart, fetchUserData, itemRemovedFromCart, logout} from "../../actions";
import {connect} from "react-redux";
import CardItemMobile from "../../components/CardItemMobile";
import dataCatds from "../../testData/dataCards";
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";
import Loader from "../../components/UI/Loader";

const ProfileSetting = (props) => {

  return (
    <BlockWrapper classStyle='ProfileSetting'>
      <h4>Настройки профиля</h4>
      <form>
        <BlockWrapper classStyle='ProfileSetting__item'>
          <p className='ProfileSetting__itemTitle'>Телефон</p>
          <div className='ProfileSetting__itemContent'>
            <p className='ProfileSetting__info'>+7{props.userData.phone}</p>
            <div className='ProfileSetting__check'><SvgCheck style={{color: 'green'}}/></div>
          </div>
        </BlockWrapper>
        <BlockWrapper classStyle='ProfileSetting__item'>
          <p className='ProfileSetting__itemTitle'>E-mail</p>
          <div className='ProfileSetting__itemContent'>
            <p className='ProfileSetting__info'>{props.userData.email}</p>
            <div className='ProfileSetting__check'><SvgCheck style={{color: 'green'}}/></div>
          </div>
        </BlockWrapper>
        <BlockWrapper classStyle='ProfileSetting__item'>
          <p className='ProfileSetting__itemTitle'>Имя</p>
          <div className='ProfileSetting__itemContent'>
            <p className='ProfileSetting__info'>
              {`${props.userData.lastName} ${props.userData.firstName} ${props.userData.middleName}`}
            </p>
          </div>
        </BlockWrapper>
        <BlockWrapper classStyle='ProfileSetting__item'>
          <p className='ProfileSetting__itemTitle'>Дата рождения</p>
          <div className='ProfileSetting__itemContent'>
            <p className='ProfileSetting__info'>{props.userData.birthDate.match(/\d{4}-\d\d-\d\d/g)}</p>
          </div>
        </BlockWrapper>
        <BlockWrapper classStyle='ProfileSetting__item'>
          <p className='ProfileSetting__itemTitle'>Пол</p>

          <div className='ProfileSetting__itemContainer'>
            <div>

              <input type="radio"
                     readOnly
                     id="genderChoice1"
                     name="gender"
                     value="male"
                     checked={props.userData.gender}
              />
              <label htmlFor="genderChoice1">Мужской</label>
            </div>

            <div>
              <input type="radio" id="genderChoice2"
                     name="gender" value="female"
                     readOnly
                     checked={!props.userData.gender}
              />
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
  const isMobile = useMediaQuery({query: '(max-width: 800px)'})
  const {addedToCart, itemRemovedFromCart, cart, history, favorites} = item;
  const handlerToCards = (itemId) => {
    history.push(`/Cards/${itemId}`)
    window.scroll(0, 0)
  }
  return (
    <BlockWrapper classStyle='Favorites'>
      <h4>Избранное</h4>
      <div className='Favorites__container'>
        {!isMobile &&
        favorites.map((item) => {

          return <FavoriteItem key={item + Math.random()}
                               itemId={item}
                               item={{addedToCart, itemRemovedFromCart, cart, handlerToCards}}/>
        })
        }

        {isMobile && favorites.map((itemId) => {
          const itemIndex = cart.findIndex((item) => +item.itemId === +itemId);
          const isActive = itemIndex >= 0;
          const {img, title, maker, minPrice, id} = dataCatds[itemId - 1];
          return <CardItemMobile onItemSelected={handlerToCards}
                                 updateToCart={() => {
                                   !isActive ? addedToCart(id) : itemRemovedFromCart(id);
                                 }}
                                 active={isActive}
                                 key={itemId}
                                 id={itemId}
                                 title={title}
                                 maker={maker}
                                 img={img}
                                 minPrice={minPrice}
                                 favoriteButton={true}

          />
        })}

      </div>
    </BlockWrapper>
  )
}


const Profile = (props) => {

  const {addedToCart, itemRemovedFromCart, cart, history, favorites} = props;

  const [block, setBlock] = useState('favorites');

  useEffect(() => {
    if (props.TOKEN) {
      if (!props.userData) {
        props.fetchUserData()
      }
    }
  }, [])// eslint-disable-line

  if (props.TOKEN) {
    return (
      <ErrorBoundary>
        {!props.userData ? <Loader/> :
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

              {block === 'favorites' &&
              <Favorites item={{addedToCart, itemRemovedFromCart, cart, history, favorites}}/>}

              {block === 'favoriteRetail' && <BlockWrapper classStyle='Profile__menu'>
                <p>ЛЮБИМАЯ АПТЕКА</p>
              </BlockWrapper>}

              {block === 'profileSettings' && <ProfileSetting userData={props.userData}/>}


              <BlockWrapper classStyle='Profile__menu'>
                <ul className='Profile__items'>
                  <li className='Profile__item' onClick={() => setBlock('main')}>Бонусы</li>
                  <li className='Profile__item' onClick={() => setBlock('order')}>Заказы</li>
                  <li className='Profile__item' onClick={() => setBlock('historyOrder')}>Истории заказов</li>
                  <li className='Profile__item' onClick={() => setBlock('favorites')}>Избранное</li>
                  <li className='Profile__item' onClick={() => setBlock('favoriteRetail')}>Любимая аптека</li>
                  <li className='Profile__item' onClick={() => setBlock('profileSettings')}>Настройка профиля</li>
                </ul>

                <Link to='/' className='Profile__btnOut'
                      onClick={props.logout}
                >Выход из аккаунта</Link>
              </BlockWrapper>
            </div>
          </section>}
      </ErrorBoundary>
    )
  }
  return <Redirect to="/"/>
}


const mapStateToProps = (
  {
    TOKEN, cart, favorites, userData
  }
) => {
  return {TOKEN, cart, favorites, userData}
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
    fetchUserData: () => dispatch(fetchUserData()),
    addedToCart: (item) => dispatch(addedToCart(item)),
    itemRemovedFromCart: (item) => dispatch(itemRemovedFromCart(item)),
    allItemRemovedFromCart: (item) => dispatch(allItemRemovedFromCart(item))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Profile))