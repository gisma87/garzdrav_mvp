import React, {useEffect, useState} from "react"
import {withRouter} from 'react-router-dom'
import {useMediaQuery} from 'react-responsive'
import './Cards.scss'
import CardItem from "../../components/CardItem";
import {connect} from 'react-redux'
import {addedToCart, itemRemovedFromCart, allItemRemovedFromCart} from "../../actions";
import CardItemMobile from "../../components/CardItemMobile";
import SearchPanel from "../../components/SearchPanel";
import logo from "../../img/evalar.png";
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";
import Error from "../../components/Error/Error";
import Pagination from "../../components/Pagination/Pagination";
import SortCards from "../../components/SortCards/SortCards";


const Cards = props => {

  const {history, cart, addedToCart, itemRemovedFromCart, productsFromSearch, error} = props;
  const [arraySort, setArraySort] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [touchedSearch, setTouchedSearch] = useState(false)
  const [currentCards, setCurrentCards] = useState([]) // массив карточке отображаемый на текущей странице

  useEffect(() => {
    console.log('USE_EFFECT', productsFromSearch.length)
    if (productsFromSearch.length > 0) {
      setArraySort(productsFromSearch)
    }
  }, [])

  const sortCards = (method) => {
    const arr = [...arraySort]

    const minToMax = () => arr.sort((a, b) => a.minPrice > b.minPrice ? 1 : -1)
    const maxToMin = () => arr.sort((a, b) => a.minPrice < b.minPrice ? 1 : -1)

    switch (method) {
      case 2:
        minToMax()
        setArraySort(arr)
        return arr

      case 3:
        maxToMin()
        setArraySort(arr)
        return arr

      default:
        setArraySort(arr)
        return arr
    }
  }

  const onPageChanged = data => {
    const allCards = productsFromSearch // массив всех карточек
    const {currentPage, pageLimitItems} = data;
    const offset = (currentPage - 1) * pageLimitItems;
    const currentCardsData = allCards.slice(offset, offset + pageLimitItems);

    setCurrentCards(currentCardsData)
  }

  const onItemSelected = (itemId, event) => {
    if (!event.target.closest('button')) history.push(`${itemId}`);
  }

  const isMobile = useMediaQuery({query: '(max-width: 800px)'})
  return (
    <section className={'Cards' + (!isMobile ? ' wrapper' : '')}>
      {error
        ? <Error/>
        : <ErrorBoundary>
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
          <SortCards items={[
            {id: 1, text: 'По популярности'},
            {id: 2, text: 'Сначала дешевые'},
            {id: 3, text: 'Сначала дорогие'}
          ]}
                     selectItem={(val) => sortCards(val)}

          />
          <div className='Cards__mainContainer'>

            {/*<SidebarCategories styleName='Cards__SidebarCategories'/>*/}
            <div className='Cards__cardList'>
              {(touchedSearch || !isMobile) &&
              productsFromSearch.length && currentCards.length
                ? currentCards.map((item) => {
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
                : <>{touchedSearch && <p>По вашему запросу ничего не найдено. Попробуйте изменить запрос.</p>}</>
              }
            </div>

          </div>

          {
            productsFromSearch.length > 0 &&
            <div style={{paddingTop: 15}}>
              <Pagination totalRecords={productsFromSearch.length}
                          page={currentPage}
                          pageLimitItems={32}
                          onPageChanged={onPageChanged}/>
            </div>
          }
        </ErrorBoundary>
      }
    </section>
  )
}

const mapStateToProps = (
  {
    cart, productsFromSearch, error
  }
) => {
  return {cart, productsFromSearch, error}
}

const mapDispatchToProps = (dispatch) => {
  return {
    addedToCart: (item) => dispatch(addedToCart(item)),
    itemRemovedFromCart: (item) => dispatch(itemRemovedFromCart(item)),
    allItemRemovedFromCart: (item) => dispatch(allItemRemovedFromCart(item))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Cards))