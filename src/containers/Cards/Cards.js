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
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";
import Error from "../../components/Error/Error";
import Pagination from "../../components/Pagination/Pagination";
import SortCards, {sortItems} from "../../components/SortCards/SortCards";
// import Logo from "../../components/UI/Logo/Logo";


const Cards = props => {

  const {history, cart, addedToCart, itemRemovedFromCart, productsFromSearch, countProductsSearch, error} = props;
  const [methodSort, setMethodSort] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [isFirstFetch, setIsFirstFetch] = useState(true)

  useEffect(() => {
    const page = Number(props.match.params.page)
    if (isFirstFetch) {
      setIsFirstFetch(false)
    } else {
      if (!props.requestFromSearchPanelThisTime) {
        onPageChanged({currentPage: page ? page : 1})
      }
    }// eslint-disable-next-line
  }, [props.match.params.page])

  useEffect(() => {
    let timer = null;
    if (props.requestFromSearchPanelThisTime) {
      setCurrentPage(1)
      setMethodSort(0);
      timer = setTimeout(props.offRequestFromSearchPanel, 2000)
    }
    return () => {
      if (!timer) clearTimeout(timer);
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
    if (!event.target.closest('button')) history.push(`/Card/${itemId}`);
  }

  const isMobile = useMediaQuery({query: '(max-width: 900px)'})
  return (
    <section
      className={'Cards' + (!isMobile ? ' wrapper' : '') + ((!(props.productsFromSearch.length || props.productSearch) && isMobile) ? ' Cards__notTouch' : '')}>
      {error
        ? <Error/>
        : <ErrorBoundary>
          {
            isMobile &&
            <>
              <div
                className={'Cards__logoPanel' + (!(props.productsFromSearch.length || props.productSearch) ? ' Cards__center' : '')}>
                Введите в строку поиска выше, что требуется найти.
              </div>
              {/*<div*/}
              {/*  className={'Cards__searchPanel' + ((props.productsFromSearch.length || props.productSearch) ? '' : ' Cards__searchPanel_center')}>*/}
              {/*  <SearchPanel/>*/}
              {/*</div>*/}
            </>
          }
          {((props.productsFromSearch.length || props.productSearch) || !isMobile) &&
          <h1 className='Cards__title'>Результаты поиска «{props.productSearch.toLowerCase()}»</h1>}

          {
            ((props.productsFromSearch.length || props.productSearch) || !isMobile) &&
            <div className='Cards__topPanel'>
              <p>Найдено {countProductsSearch} препаратов</p>
              <div className='Cards__topPanel-right'>
                <p className='Cards__sortText'>Сортировать: </p>
                <SortCards selectItem={(idMethod) => sortCards(idMethod)}
                           methodSort={methodSort}
                           items={sortItems}
                />
              </div>
            </div>
          }

          <div className='Cards__mainContainer'>

            <div className='Cards__cardList'>
              {
                productsFromSearch.length
                  ? productsFromSearch.map((item) => {
                    const {guid, product, manufacturer, img = null, minPrice, countLast} = item;
                    const itemIndex = cart.findIndex((item) => item.itemId === guid);
                    const isBuy = itemIndex >= 0;
                    const count = isBuy ? props.cart[itemIndex].count : 0
                    return (
                      isMobile
                        ? <CardItemMobile key={guid}
                                          onItemSelected={onItemSelected}
                                          itemProps={{
                                            onIncrement: () => props.addedToCart(guid),
                                            onDecrement: () => props.itemRemovedFromCart(guid),
                                            isBuy,
                                            count,
                                            countLast,
                                            id: guid,
                                            title: product,
                                            maker: manufacturer,
                                            img,
                                            minPrice,
                                          }}/>
                        : <CardItem key={guid}
                                    onItemSelected={onItemSelected}
                                    itemProps={{
                                      onIncrement: () => addedToCart(guid),
                                      onDecrement: () => itemRemovedFromCart(guid),
                                      isBuy,
                                      count,
                                      countLast,
                                      id: guid,
                                      title: product,
                                      maker: manufacturer,
                                      img,
                                      minPrice,
                                    }}/>
                    )
                  })
                  : <>
                    {
                      (props.productSearch || !isMobile) &&
                      <div style={{fontSize: '1.3rem'}}>
                        <p>По вашему запросу ничего не найдено.</p>
                        <p>Попробуйте изменить запрос.</p>
                      </div>
                    }
                  </>
              }
            </div>

          </div>

          {
            ((props.productSearch || !isMobile) && (productsFromSearch.length > 0)) &&
            <div style={{paddingTop: 15}}>
              <Pagination totalRecords={countProductsSearch}
                          page={currentPage}
                          pageLimitItems={32}
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