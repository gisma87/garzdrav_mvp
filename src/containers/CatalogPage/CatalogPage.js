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
    }
  }, [props.activeCategory])


  const isMobile = useMediaQuery({query: '(max-width: 800px)'})

  const onItemSelected = (itemId, event) => {
    if (!event.target.closest('button')) props.history.push(`/Cards/${itemId}`)
  }

  const getActiveItem = (historyGuid) => {
    console.log('historyGuid', historyGuid);
    let activeItem = props.catalog
    for (let i = 0; i < historyGuid.length; i++) {
      activeItem = activeItem.child.find(item => item.guid === historyGuid[i])
    }
    console.log(activeItem)
  }

  return (
    <div className='CatalogPage'>
      {props.activeCategory &&
      <>
        <div>
          {props.activeCategory.pathname.map((item, i) => <span key={item.guid}
                                                                style={{color: 'blue', cursor: 'pointer'}}
                                                                onClick={() => {
                                                                  console.log('item', item)
                                                                  console.log('item.historyGuid', item.historyGuid)
                                                                  getActiveItem(item.historyGuid)
                                                                  props.setActiveCategory(item)
                                                                }}
          > {item.title} /</span>)}

          {/*<span style={{color: 'blue', cursor: 'pointer'}}> {props.activeCategory.title} /</span>*/}
        </div>
        <ul className='CatalogPage__list'>
          {props.activeCategory.child.length > 0
            ? props.activeCategory.child.map((item, i) => {
              return (<li key={i + item}
                          onClick={() => {
                            // props.setProductsToCategory(item.guid)
                            props.setActiveCategory(item)
                          }}
                          className='CatalogPage__item'>{item.title}</li>)
            })
            : <li className='CatalogPage__item'>{props.activeCategory?.title}</li>
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