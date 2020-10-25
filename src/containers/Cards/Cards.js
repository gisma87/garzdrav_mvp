import React from "react"
import {withRouter} from 'react-router-dom'
import './Cards.scss'
import LayoutDesktop from "../../hoc/LayoutDesktop";
import CardItem from "../../components/CardItem";
import dataCatds from "../../testData/dataCards"
import SidebarCategories from "../../components/SidebarCategories";
import {connect} from 'react-redux'
import withStoreService from "../../hoc/withStoreService/withStoreService";
import {addedToCart, itemRemovedFromCart, allItemRemovedFromCart} from "../../actions";
import {compose} from "../../utils";


const Cards = props => {

  const {history, cart, addedToCart, itemRemovedFromCart} = props;

  const onItemSelected = (itemId, event) => {
    if (!event.target.closest('button')) history.push(`${itemId}`);
  }

  // useEffect(() => {
  //   props.fetchCities();
  // }, [])

  // console.log('pills: ', pills)

  // if (loading) return <div>LOADING...</div>
  //
  // if (error) return <div>...ERROR...</div>

  return (
    <LayoutDesktop>
      <section className='Cards wrapper'>
        <h1 className='Cards__title'>Результаты поиска</h1>
        <div className='Cards__mainContainer'>

          {/*<SidebarCategories styleName='Cards__SidebarCategories'/>*/}

          <div className='Cards__cardList'>
            {
              dataCatds.map((item) => {
                const {id, title, maker, img, minPrice} = item;
                const itemIndex = cart.findIndex((item) => item.itemId === id);
                const isActive = itemIndex >= 0;
                return <CardItem onItemSelected={onItemSelected}
                                 updateToCart={() => {
                                   !isActive ? addedToCart(id) : itemRemovedFromCart(id)
                                 }}
                                 active={isActive}
                                 key={id}
                                 id={id}
                                 title={title}
                                 maker={maker}
                                 img={img}
                                 minPrice={minPrice}/>
              })
            }
          </div>
        </div>
      </section>
    </LayoutDesktop>
  )
}

const mapStateToProps = ({cart}) => {
  return {cart}
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