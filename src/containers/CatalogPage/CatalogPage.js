import React, {useEffect, useState} from "react";
import './CatalogPage.scss'
import {connect} from "react-redux";
import {addedToCart, itemRemovedFromCart, setActiveCategory, setProductsToCategory} from "../../actions";
import CardItemMobile from "../../components/CardItemMobile";
import CardItem from "../../components/CardItem";
import {useMediaQuery} from "react-responsive";
import {withRouter} from 'react-router-dom'
import Pagination from "../../components/Pagination/Pagination";
import SortCards from "../../components/SortCards/SortCards";

const CatalogPage = props => {

  const [arraySort, setArraySort] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [currentCards, setCurrentCards] = useState([]) // массив карточке отображаемый на текущей странице

  useEffect(() => {
    if (props.activeCategory) {
      props.setProductsToCategory(props.activeCategory.guid)
    }// eslint-disable-next-line
  }, [props.activeCategory])

  useEffect(() => {
    sortCards() // eslint-disable-next-line
  }, [props.productsToCategory])


  const isMobile = useMediaQuery({query: '(max-width: 800px)'})

  const onItemSelected = (itemId, event) => {
    if (!event.target.closest('button')) props.history.push(`/Cards/${itemId}`)
  }

  const getActiveItem = (index) => {
    let activeItem = [props.catalog]
    const title = [props.catalog.title]
    for (let i = 1; i < props.activeCategory.historyGuid.length; i++) {
      activeItem.push(activeItem[i - 1].child.find(item => item.guid === props.activeCategory.historyGuid[i]))
      title.push(activeItem[i].title)
    }
    return {title: title[index], activeItem: activeItem[index]}
  }

  const onPageChanged = (data, arrSortPrevState) => {
    const allCards = arrSortPrevState ? arrSortPrevState : (arraySort ? arraySort : props.productsToCategory) // массив всех карточек
    const {currentPage, pageLimitItems} = data;
    const offset = (currentPage - 1) * pageLimitItems;
    const currentCardsData = allCards.slice(offset, offset + pageLimitItems);

    setCurrentCards(currentCardsData)
  }

  const sortCards = (method) => {
    const arr = [...props.productsToCategory]

    const minToMax = () => arr.sort((a, b) => a.minPrice > b.minPrice ? 1 : -1)
    const maxToMin = () => arr.sort((a, b) => a.minPrice < b.minPrice ? 1 : -1)

    switch (method) {
      case 2:
        minToMax()
        setArraySort(arr)
        goToPage(1, arr)
        return arr

      case 3:
        maxToMin()
        setArraySort(arr)
        goToPage(1, arr)
        return arr

      case 4:
        arr.sort()
        setArraySort(arr)
        goToPage(1, arr)
        return arr

      default:
        setArraySort(arr)
        goToPage(1, arr)
        return arr
    }
  }

  function goToPage(page = 1, arrSortPrevState) {
    const pageLimitItems = 32 // количество карточек на странице
    const totalRecords = props.productsToCategory?.length
    const totalPages = Math.ceil(totalRecords / pageLimitItems); // общее количество страниц
    const curPage = Math.max(0, Math.min(page, totalPages)); // текущая страница

    const paginationData = {
      currentPage: curPage, // текущая страница
      totalPages, // общее количество страниц
      pageLimitItems, // количество карточек на странице
      totalRecords
    }

    setCurrentPage(curPage)
    onPageChanged(paginationData, arrSortPrevState)
  }

  return (
    <div className='CatalogPage'>
      {props.activeCategory &&
      <>
        <div>
          {props.activeCategory.historyGuid.map((item, i) => {
            return (
              <p key={item} className='CatalogPage__pathname'>
              <span className='CatalogPage__pathItem'
                    onClick={() => props.setActiveCategory(getActiveItem(i).activeItem)}
              >
                {getActiveItem(i).title}
              </span>
                <span className='CatalogPage__pathArrow'> > </span>
              </p>

            )
          })}
        </div>

        <ul className='CatalogPage__list'>
          {props.activeCategory.child.length > 0
          && props.activeCategory.child.map((item, i) => {
            return (<li key={i + item}
                        onClick={() => props.setActiveCategory(item)}
                        className='CatalogPage__item'>{item.title}</li>)
          })
          }
        </ul>
      </>}

      <SortCards items={[
        {id: 1, text: 'По популярности'},
        {id: 4, text: 'По наименованию'},
        {id: 2, text: 'Сначала дешевые'},
        {id: 3, text: 'Сначала дорогие'}
      ]}
                 selectItem={(val) => sortCards(val)}

      />

      <div className="CatalogPage__cardList">
        {
          props.productsToCategory.length > 0 && currentCards.length > 0
          && currentCards.map((item) => {
            const {guid, product, manufacturer, img = null, minPrice} = item;
            const itemIndex = props.cart.findIndex((item) => item.itemId === guid);
            const isActive = itemIndex >= 0;
            return (
              isMobile
                ? <CardItemMobile onItemSelected={onItemSelected}
                                  updateToCart={() => {
                                    !isActive ? props.addedToCart(guid) : props.itemRemovedFromCart(guid);
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
                              !isActive ? props.addedToCart(guid) : props.itemRemovedFromCart(guid);
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

      {
        props.productsToCategory.length > 0 &&
        <div style={{paddingTop: 15}}>
          <Pagination totalRecords={props.productsToCategory.length}
                      page={currentPage}
                      setPage={(page) => goToPage(page)}
                      pageLimitItems={32}
                      onPageChanged={onPageChanged}/>
        </div>
      }


    </div>
  )
}

const mapStateToProps = (
  {
    catalog, activeCategory,
    productsFromSearch, cart,
    productsToCategory
  }
) => {
  return {
    catalog,
    activeCategory,
    productsFromSearch,
    cart,
    productsToCategory
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveCategory: (categoryItem) => dispatch(setActiveCategory(categoryItem)),
    setProductsToCategory: (categoryId) => dispatch(setProductsToCategory(categoryId)),
    addedToCart: (item) => dispatch(addedToCart(item)),
    itemRemovedFromCart: (item) => dispatch(itemRemovedFromCart(item)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CatalogPage))