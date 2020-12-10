import React, {useEffect, useState} from "react"
import {withRouter} from 'react-router-dom'
import './PromoPage.scss'
import PromoItem from "../../components/PromoItem";
import data from "../../testData/articlesANDpromo";
import Pagination from "../../components/Pagination/Pagination";

const PromoPage = (props) => {
  const {history} = props
  const [currentCards, setCurrentCards] = useState([]) // массив карточке отображаемый на текущей странице
  const [allCards, setAllCards] = useState([]) // массив всех карточек

  useEffect(() => setAllCards(data), [])

  const onPageChanged = data => {
    const {currentPage, pageLimitItems} = data;
    const offset = (currentPage - 1) * pageLimitItems;
    const currentCardsData = allCards.slice(offset, offset + pageLimitItems);

    setCurrentCards(currentCardsData)
  }


  const onItemSelected = (itemId, event) => {
    history.push(`${itemId}`);
  }

  const totalCards = allCards.length;

  if (totalCards === 0) return null;

  return (
    <div className='PromoPage wrapper'>
      <h1 className='PromoPage__title'>Акции</h1>

      <div className='PromoPage__container'>
        {currentCards.map(item => <PromoItem key={item.id} item={item} onItemSelected={onItemSelected}/>)}
      </div>
      <div style={{paddingTop: 15}}>
        <Pagination totalRecords={totalCards}
                    pageLimitItems={20}
                    onPageChanged={onPageChanged}/>
      </div>
    </div>
  )
}

export default withRouter(PromoPage)