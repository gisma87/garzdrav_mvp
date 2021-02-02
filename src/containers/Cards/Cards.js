import React, {useEffect, useState} from "react"
import {withRouter} from 'react-router-dom'
import {useMediaQuery} from 'react-responsive'
import './Cards.scss'
import CardItem from "../../components/CardItem";
import {connect} from 'react-redux'
import {
  addedToCart,
  itemRemovedFromCart,
  allItemRemovedFromCart,
  getProductsFromSearchLimit,
  offRequestFromSearchPanel
} from "../../actions";
import CardItemMobile from "../../components/CardItemMobile";
import SearchPanel from "../../components/SearchPanel";
import logo from "../../img/evalar.png";
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";
import Error from "../../components/Error/Error";
import Pagination from "../../components/Pagination/Pagination";
import SortCards from "../../components/SortCards/SortCards";


const Cards = props => {

  const {history, cart, addedToCart, itemRemovedFromCart, productsFromSearch, countProductsSearch, error} = props;
  const [methodSort, setMethodSort] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [touchedSearch, setTouchedSearch] = useState(false)

  useEffect(() => {
    if (props.requestFromSearchPanelThisTime) {
      setCurrentPage(1)
      setMethodSort(0);
      props.offRequestFromSearchPanel()
    }
    // eslint-disable-next-line
  }, [props.requestFromSearchPanelThisTime])

  const onPageChanged = ({currentPage}) => {
    setCurrentPage(currentPage)
    const parameters = {
      productName: props.productSearch,
      page: currentPage,
      order: methodSort,
    }

    props.getProductsFromSearchLimit(parameters)
  }

  const sortCards = (methodSort) => {
    setMethodSort(methodSort)
    setCurrentPage(1)
    const parameters = {
      productName: props.productSearch,
      page: 1,
      order: methodSort,
    }
    props.getProductsFromSearchLimit(parameters)
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
          {(touchedSearch || !isMobile) && props.productSearch &&
          <h1 className='Cards__title'>Результаты поиска «{props.productSearch.toLowerCase()}»</h1>}

          {
            productsFromSearch.length > 0
            &&
            <div className='Cards__topPanel'>
              <p>Найдено {countProductsSearch} препаратов</p>
              <div className='Cards__topPanel-right'>
                <p>Сортировать: </p>
                <SortCards selectItem={(idMethod) => sortCards(idMethod)}
                           methodSort={methodSort}
                           items={[
                             {id: 0, text: 'По популярности'},
                             {id: 'TitleAscending', text: '🠗 По наименованию А - Я'},
                             {id: 'TitleDescending', text: '🠕 По наименованию Я - А'},
                             {id: 'PriceAscending', text: '🠗 Сначала дешевые'},
                             {id: 'PriceDescending', text: '🠕 Сначала дорогие'}
                           ]}
                />
              </div>
            </div>
          }

          <div className='Cards__mainContainer'>

            <div className='Cards__cardList'>
              {(touchedSearch || !isMobile) &&
              productsFromSearch.length
                ? productsFromSearch.map((item) => {
                  const {guid, product, manufacturer, img = null, minPrice, countLast} = item;
                  const itemIndex = cart.findIndex((item) => item.itemId === guid);
                  const isBuy = itemIndex >= 0;
                  const count = isBuy ? props.cart[itemIndex].count : 0
                  return (
                    isMobile
                      ? <CardItemMobile onItemSelected={onItemSelected}
                                        updateToCart={() => {
                                          !isBuy ? addedToCart(guid) : itemRemovedFromCart(guid);
                                        }}
                                        active={isBuy}
                                        key={guid}
                                        id={guid}
                                        title={product}
                                        maker={manufacturer}
                                        img={img}
                                        minPrice={minPrice}/>
                      : <CardItem onItemSelected={onItemSelected}
                                  onIncrement={() => addedToCart(guid)}
                                  onDecrement={() => itemRemovedFromCart(guid)}
                                  isBuy={isBuy}
                                  count={count}
                                  countLast={countLast}
                                  key={guid}
                                  id={guid}
                                  title={product}
                                  maker={manufacturer}
                                  img={img}
                                  minPrice={minPrice}/>
                  )
                })
                : <>{(touchedSearch || !isMobile) &&
                <div style={{fontSize: '1.3rem'}}>
                  <p>По вашему запросу ничего не найдено.</p>
                  <p>Попробуйте изменить запрос.</p>
                </div>
                }</>
              }
            </div>

          </div>

          {
            productsFromSearch.length > 0 &&
            <div style={{paddingTop: 15}}>
              <Pagination totalRecords={countProductsSearch}
                          page={currentPage}
                // setPage={(page) => {
                //   props.getProductsFromSearchLimit(props.productSearch, 32, page)
                // }}
                          setCurrentPage={(page) => setCurrentPage(page)}
                          pageLimitItems={32}
                          onPageChanged={onPageChanged}
              />
            </div>
          }
        </ErrorBoundary>
      }
    </section>
  )
}

const mapStateToProps = (
  {
    cart, productsFromSearch, countProductsSearch, error, productSearch, requestFromSearchPanelThisTime
  }
) => {
  return {cart, productsFromSearch, countProductsSearch, error, productSearch, requestFromSearchPanelThisTime}
}

const mapDispatchToProps = (dispatch) => {
  return {
    addedToCart: (item) => dispatch(addedToCart(item)),
    itemRemovedFromCart: (item) => dispatch(itemRemovedFromCart(item)),
    allItemRemovedFromCart: (item) => dispatch(allItemRemovedFromCart(item)),
    getProductsFromSearchLimit: (options) => dispatch(getProductsFromSearchLimit(options)),
    offRequestFromSearchPanel: () => dispatch(offRequestFromSearchPanel())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Cards))