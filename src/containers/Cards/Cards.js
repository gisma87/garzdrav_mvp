import React, {useEffect, useState} from "react"
import {withRouter} from 'react-router-dom'
import {useMediaQuery} from 'react-responsive'
import './Cards.scss'
import CardItem from "../../components/CardItem";
import {connect} from 'react-redux'
import withStoreService from "../../hoc/withStoreService/withStoreService";
import {addedToCart, itemRemovedFromCart, allItemRemovedFromCart} from "../../actions";
import {compose} from "../../utils";
import CardItemMobile from "../../components/CardItemMobile";
import SearchPanel from "../../components/SearchPanel";
import logo from "../../img/evalar.png";


const Cards = props => {

  const {history, cart, addedToCart, itemRemovedFromCart, productsFromSearch} = props;
  const [touchedSearch, setTouchedSearch] = useState(false)
  // const [touchedSearchTimeout, setTouchedSearchTimeout] = useState(true)

  const onItemSelected = (itemId, event) => {
    if (!event.target.closest('button')) history.push(`${itemId}`);
  }

  const isMobile = useMediaQuery({query: '(max-width: 800px)'})

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  })

  // console.log('pills: ', pills)

  // if (loading) return <div>LOADING...</div>
  //
  // if (error) return <div>...ERROR...</div>

  return (
    <section className={'Cards' + (!isMobile ? ' wrapper' : '')}>
      {
        isMobile &&
        <>
          <div
            className={'indexMobile__logoPanel Cards__logoPanel' + (!touchedSearch ? ' Cards__center' : '')}>
            <img src={logo} className='indexMobile__logo' alt='logo'/>
            <p>Поиск по каталогу: </p>
          </div>
          <div className={'Cards__searchPanel' + (touchedSearch ? '' : ' Cards__searchPanel_center')}>
            <SearchPanel
              touched={touchedSearch}
              onTouched={() => {
                setTouchedSearch(true)
              }}/>
          </div>
          {!touchedSearch && <p className='Cards__searchPanel_text'>
            Поиск по названию, действующему веществу, производителю ...
          </p>}

        </>
      }
      {(touchedSearch || !isMobile) && <h1 className='Cards__title'>Результаты поиска</h1>}
      <div className='Cards__mainContainer'>

        {/*<SidebarCategories styleName='Cards__SidebarCategories'/>*/}

        <div className='Cards__cardList'>
          {(touchedSearch || !isMobile) &&
          // dataCatds
          productsFromSearch.map((item) => {
            const {guid, product, manufacturer, img = null, minPrice} = item;
            const itemIndex = cart.findIndex((item) => item.itemId === guid);
            const isActive = itemIndex >= 0;
            return (
              isMobile
                ? <CardItemMobile onItemSelected={onItemSelected}
                                  updateToCart={() => {
                                    !isActive ? addedToCart(guid) : itemRemovedFromCart(guid);
                                  }}
                                  active={isActive}
                                  key={guid}
                                  id={guid}
                                  title={product}
                                  maker={manufacturer}
                                  img={img}
                                  minPrice={minPrice}/>
                : <CardItem onItemSelected={onItemSelected}
                            updateToCart={() => {
                              !isActive ? addedToCart(guid) : itemRemovedFromCart(guid);
                            }}
                            active={isActive}
                            key={guid}
                            id={guid}
                            title={product}
                            maker={manufacturer}
                            img={img}
                            minPrice={minPrice}/>
            )
          })
          }
        </div>
      </div>
    </section>
  )
}

const mapStateToProps = ({cart, productsFromSearch}) => {
  return {cart, productsFromSearch}
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
)(withRouter(Cards))

// withStoreService()(
//   connect(mapStateToProps, mapDispatchToProps)(withRouter(Cards))
// )