import React from "react"
import './Articles.scss'
import ArticleCard from "../../components/ArticleCard";
import data from "../../testData/articlesANDpromo";
import {withRouter} from "react-router-dom";


const Articles = props => {

  const onItemSelected = (itemId, event) => {
    props.history.push(`${itemId}`);
  }

  return (
    <div className='Articles wrapper'>
      <h1 className='Articles__title'>Полезные советы и интересные статьи</h1>
      <div className='Articles__container'>
        {
          data.map((item, id) => {
            return <ArticleCard key={id} item={item} onItemSelected={onItemSelected}/>
          })
        }
      </div>
    </div>
  )
}

export default withRouter(Articles)