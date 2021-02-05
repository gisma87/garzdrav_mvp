import React from "react"
import './Articles.scss'
import ArticleCard from "../../components/ArticleCard";
import data from "../../testData/articlesANDpromo";


const Articles = () => {
  return (
    <div className='Articles wrapper'>
      <h1 className='Articles__title'>Полезные советы и интересные статьи</h1>
      <div className='Articles__container'>
        {
          data.map((item, id) => {
            return <ArticleCard key={id} item={item}/>
          })
        }
      </div>
    </div>
  )
}

export default Articles