import React from "react"
import {withRouter} from 'react-router-dom'
import './PromoPage.scss'
import {articleCardData} from "../../data/articlesCardData";
import ArticleCard from "../../components/ArticleCard";

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
          articleCardData.map((card, index) => {
            return <ArticleCard key={index} item={card} onItemSelected={onItemSelected}/>
          })
        }
      </div>
    </div>
  )
}

export default withRouter(PromoPage)