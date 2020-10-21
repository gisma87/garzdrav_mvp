import React, {useEffect} from "react"
import {withRouter} from 'react-router-dom'
import './Cards.scss'
import LayoutDesktop from "../../hoc/LayoutDesktop";
import CardItem from "../../components/CardItem";
import dataCatds from "../../testData/dataCards"
import SidebarCategories from "../../components/SidebarCategories";
import {connect} from 'react-redux'
import withStoreService from "../../hoc/withStoreService/withStoreService";
import {pillsLoaded} from "../../actions";
import {compose} from "../../utils";


const Cards = ({history, pills, storeService, pillsLoaded}) => {

  const onItemSelected = (itemId, event) => {
    if (!event.target.closest('button')) history.push(`${itemId}`);
  }

  useEffect(() => {
    const data = storeService.getBooks();
    pillsLoaded(data)
  }, [])

  console.log('pills: ', pills)

  return (
    <LayoutDesktop>
      <section className='Cards'>
        <h1 className='Cards__title'>Результаты поиска</h1>
        <div className='Cards__mainContainer'>

          <SidebarCategories styleName='Cards__SidebarCategories'/>

          <div className='Cards__cardList'>
            {
              dataCatds.map(({id, title, maker, img, minPrice}) => {
                return <CardItem onItemSelected={onItemSelected}
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

const mapStateToProps = (state) => {
  return {
    pills: state.pills
  }
}

const mapDispatchToProps = {pillsLoaded}

export default compose(
  withStoreService(),
  connect(mapStateToProps, mapDispatchToProps)
)(withRouter(Cards))

// withStoreService()(
//   connect(mapStateToProps, mapDispatchToProps)(withRouter(Cards))
// )