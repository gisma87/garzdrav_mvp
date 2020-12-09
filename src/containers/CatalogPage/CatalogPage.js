import React, {useEffect} from "react";
import './CatalogPage.scss'
import {connect} from "react-redux";
import {addedToCart, itemRemovedFromCart, setActiveCategory, setProductsToCategory} from "../../actions";
import CardItemMobile from "../../components/CardItemMobile";
import CardItem from "../../components/CardItem";
import {useMediaQuery} from "react-responsive";
import {withRouter} from 'react-router-dom'

const CatalogPage = props => {

  useEffect(() => {
    if (props.activeCategory) {
      props.setProductsToCategory(props.activeCategory.guid)
    }// eslint-disable-next-line
  }, [props.activeCategory])


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

      <div className="CatalogPage__cardList">
        {
          props.productsToCategory.length > 0
          && props.productsToCategory.map((item) => {
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