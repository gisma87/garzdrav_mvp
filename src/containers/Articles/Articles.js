import React, {useEffect, useState} from "react"
import './Articles.scss'
import {useMediaQuery} from 'react-responsive'
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import CardItemMobile from "../../components/CardItemMobile";
import CardItem from "../../components/CardItem";
import {
  addedToCart,
  allItemRemovedFromCart,
  getProductsFromSearchLimit,
  itemRemovedFromCart,
  offRequestFromSearchPanel
} from "../../actions";
import PaginationFront from "../../components/PaginationFront/PaginationFront";
import SortCards, {sortItems} from "../../components/SortCards/SortCards";
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";


const Articles = props => {
  const isMobile = useMediaQuery({query: '(max-width: 900px)'})
  // const onItemSelected = (itemId, event) => {
  //   props.history.push(`${itemId}`);
  // }

  const [resetPagination, setResetPagination] = useState(false)
  const [currentArrItems, setCurrentArrItems] = useState()
  const [methodSort, setMethodSort] = useState(0)
  const [activePromoGroup, setActivePromoGroup] = useState([])

  useEffect(() => {
    if (props.activePromoGroup.arrPromo?.length) {
      setActivePromoGroup([...props.activePromoGroup.arrPromo])
    }
  }, [props.activePromoGroup])

  const onItemSelected = (itemId, event) => {
    if (!event.target.closest('button')) props.history.push(`/Card/${itemId}`);
  }

  const onPageChanged = data => {
    const {currentPage, pageLimitItems} = data;
    const offset = (currentPage - 1) * pageLimitItems;
    const currentArr = activePromoGroup.slice(offset, offset + pageLimitItems);
    setCurrentArrItems(currentArr)
  }

  function sortCards(methodSort) {
    setMethodSort(methodSort)
    const arr = [...activePromoGroup]
    switch (methodSort) {
      case 'TitleAscending':
        arr.sort((a, b) => a.product > b.product ? 1 : -1)
        setActivePromoGroup(arr)
        setResetPagination(true)
        break;
      case 'TitleDescending':
        arr.sort((a, b) => a.product > b.product ? -1 : 1)
        setActivePromoGroup(arr)
        setResetPagination(true)
        break;
      case 'PriceAscending':
        arr.sort((a, b) => a.minPrice > b.minPrice ? 1 : -1)
        setActivePromoGroup(arr)
        setResetPagination(true)
        break;
      case 'PriceDescending':
        arr.sort((a, b) => a.minPrice > b.minPrice ? -1 : 1)
        setActivePromoGroup(arr)
        setResetPagination(true)
        break;
      default:
        return

    }
  }

  return (
    <ErrorBoundary>
      <div className='Articles wrapper'>
        <h1 className='Articles__title'>{props.activePromoGroup.name}</h1>
        {
          (activePromoGroup.length > 0) &&
          <div className='Cards__topPanel'>
            <p>Найдено {activePromoGroup.length} препаратов</p>
            <div className='Cards__topPanel-right'>
              <p className='Cards__sortText'>Сортировать: </p>
              <SortCards selectItem={(idMethod) => sortCards(idMethod)}
                         methodSort={methodSort}
                         items={sortItems}
              />
            </div>
          </div>
        }
        <div className='Articles__container'>
          {/*{*/}
          {/*  data.map((item, id) => {*/}
          {/*    return <ArticleCard key={id} item={item} onItemSelected={onItemSelected}/>*/}
          {/*  })*/}
          {/*}*/}
          {
            currentArrItems &&
            currentArrItems.map(item => {
              const {guid, product, manufacturer, img = null, minPrice, countLast} = item;
              const itemIndex = props.cart.findIndex((item) => item.itemId === guid);
              const isBuy = itemIndex >= 0;
              const count = isBuy ? props.cart[itemIndex].count : 0
              return (
                isMobile
                  ? <CardItemMobile key={guid}
                                    onItemSelected={onItemSelected}
                                    updateToCart={() => {
                                      !isBuy ? props.addedToCart(guid) : props.itemRemovedFromCart(guid);
                                    }}
                                    active={isBuy}
                                    id={guid}
                                    title={product}
                                    maker={manufacturer}
                                    img={img}
                                    minPrice={minPrice}/>
                  : <CardItem key={guid}
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
                              }}
                  />
              )
            })
          }

        </div>
        {
          (activePromoGroup.length > 0) &&
          <div style={{paddingTop: 15}}>
            <PaginationFront totalRecords={activePromoGroup.length}
                             pageLimitItems={20}
                             onPageChanged={onPageChanged}
                             reset={{status: resetPagination, off: () => setResetPagination(false)}}
            />
          </div>
        }
      </div>
    </ErrorBoundary>
  )
}

const mapStateToProps = ({activePromoGroup, cart}) => {
  return {activePromoGroup, cart}
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Articles))