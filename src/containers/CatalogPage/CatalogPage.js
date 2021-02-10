import React, {useEffect, useState} from "react";
import './CatalogPage.scss'
import {connect} from "react-redux";
import {addedToCart, itemRemovedFromCart, setActiveCategory, setProductsToCategory} from "../../actions";
import CardItemMobile from "../../components/CardItemMobile";
import CardItem from "../../components/CardItem";
import {useMediaQuery} from "react-responsive";
import {withRouter} from 'react-router-dom'
import Pagination from "../../components/Pagination/Pagination";
import SortCards, {sortItems} from "../../components/SortCards/SortCards";

const CatalogPage = props => {

  const [currentPage, setCurrentPage] = useState(1)
  const [methodSort, setMethodSort] = useState(0)

  useEffect(() => {
    if (props.catalog) {
      if (!props.match.params.categoryId) {
        props.history.push(`/catalog/${props.catalog.guid}/`)
      } else {
        const categoryID = props.match.params.categoryId ? props.match.params.categoryId : props.catalog.guid;
        const page = props.match.params.page ? Number(props.match.params.page) : 1
        const activeCategory = getActiveCategory(categoryID)

        if (!activeCategory) {
          props.history.push(`/catalog/${props.catalog.guid}/`)
        } else {
          props.setActiveCategory(activeCategory)
          setCurrentPage(page)
          const parameters = {
            page,
            order: methodSort,
            categoryId: activeCategory.guid
          }

          props.setProductsToCategory(parameters)
        }
      }
    }
  }, [props.match.params.categoryId, props.match.params.page, methodSort, props.catalog])

  const isMobile = useMediaQuery({query: '(max-width: 800px)'})

  const onItemSelected = (itemId, event) => {
    if (!event.target.closest('button')) props.history.push(`/Card/${itemId}/`)
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

  const sortCards = (methodSort) => {
    setMethodSort(methodSort)
    props.history.push(`/catalog/${props.activeCategory.guid}/1`)
  }

  // ищет категорию по ID категории
  const getActiveCategory = (categoryID) => {
    let result = null

    function searchElement(element) {
      if (result) return result
      if (element.guid === categoryID) {
        result = element;
        return result
      }

      for (let i = 0; i < element.child.length; i++) {
        const item = element.child[i]

        const isElement = item.guid === categoryID
        if (isElement) {
          result = item
          return result
        }

        if (item.child.length) {
          searchElement(item) // спускаемся на самое дно
        } else {
          const isElement = item.guid === categoryID
          if (isElement) {
            result = item
          }
        }
      }

      if (result) {
        return result
      } else return 'категория не найдена'
    }

    searchElement(props.catalog)
    return result
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
                    onClick={() => props.history.push(`/catalog/${getActiveItem(i).activeItem.guid}/`)}
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
                        onClick={() => {
                          console.log(item)
                          console.log(item.guid)
                          props.history.push(`/catalog/${item.guid}/`)
                        }}
                        className='CatalogPage__item'>{item.title}</li>)
          })
          }
        </ul>
      </>}

      {
        props.productsToCategory.length > 0 &&
        <div className='CatalogPage__topPanel'>
          <p>В категории {props.countProductsCategory} препаратов</p>
          <div className='CatalogPage__topPanel-right'>
            <p>Сортировать: </p>
            <SortCards selectItem={(idMethod) => sortCards(idMethod)}
                       methodSort={methodSort}
                       items={sortItems}
            />
          </div>
        </div>
      }

      <div className="CatalogPage__cardList">
        {
          props.productsToCategory.length > 0
          && props.productsToCategory.map((item) => {
            const {guid, product, manufacturer, img = null, minPrice, countLast} = item;
            const itemIndex = props.cart.findIndex((item) => item.itemId === guid);
            const isBuy = itemIndex >= 0;
            const count = isBuy ? props.cart[itemIndex].count : 0
            return (
              isMobile
                ? <CardItemMobile onItemSelected={onItemSelected}
                                  updateToCart={() => {
                                    !isBuy ? props.addedToCart(guid) : props.itemRemovedFromCart(guid);
                                  }}
                                  active={isBuy}
                                  key={guid}
                                  id={guid}
                                  title={product}
                                  maker={manufacturer}
                                  img={img}
                                  minPrice={minPrice}/>
                : <CardItem onItemSelected={onItemSelected}
                            onIncrement={() => props.addedToCart(guid)}
                            onDecrement={() => props.itemRemovedFromCart(guid)}
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
        }
      </div>

      {
        props.productsToCategory.length > 0 &&
        <div style={{paddingTop: 15}}>
          <Pagination totalRecords={props.countProductsCategory}
                      page={currentPage}
                      pageLimitItems={32}/>
        </div>
      }
    </div>
  )
}

const mapStateToProps = (
  {
    catalog, activeCategory,
    productsFromSearch, cart,
    productsToCategory,
    countProductsCategory
  }
) => {
  return {
    catalog,
    activeCategory,
    productsFromSearch,
    cart,
    productsToCategory,
    countProductsCategory
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