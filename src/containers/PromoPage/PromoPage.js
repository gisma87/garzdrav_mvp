import React from "react"
import {withRouter} from 'react-router-dom'
import './PromoPage.scss'
import PromoItem from "../../components/PromoItem";
import Pagination from "../../components/Pagination/Pagination";

import data from "../../testData/articlesANDpromo";

const PromoPage = (props) => {
  const {history} = props

  const onItemSelected = (itemId, event) => {
    history.push(`${itemId}`);
  }

  return (
    <div className='PromoPage wrapper'>
      <h1 className='PromoPage__title'>Акции</h1>
      <div className='PromoPage__container'>
        {
          data.map((item) => {
            return <PromoItem key={item.id} item={item} onItemSelected={onItemSelected}/>
          })
        }
      </div>
    </div>
  )
}

export default withRouter(PromoPage)