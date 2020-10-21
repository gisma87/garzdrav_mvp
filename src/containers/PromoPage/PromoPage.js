import React from "react"
import './PromoPage.scss'
import LayoutDesktop from "../../hoc/LayoutDesktop";
import imgPromo1 from "../../img/test/breakingPrices.jpg"
import imgPromo2 from "../../img/test/timthumb.jpg"
import imgPromo3 from "../../img/test/imgPromo3.jpg"
import PromoItem from "../../components/PromoItem";


const data = [
  {
    id: 1,
    title: 'Ломаем цены!',
    description: 'C 1 по 31 октября очень низкие цены на необходимые препараты.',
    image: imgPromo2,
    date: '1 октября 2020 г.'
  },
  {
    id: 2,
    title: 'Опять скидки!',
    description: 'Снова скидки на полезные товары для здоровья!',
    image: imgPromo3,
    date: '2 cентября 2020 г.'
  },
  {
    id: 3,
    title: 'Опять скидки!',
    description: 'Снова скидки на полезные товары для здоровья!',
    image: imgPromo3,
    date: '2 cентября 2020 г.'
  },
  {
    id: 4,
    title: 'Опять скидки!',
    description: 'Снова скидки на полезные товары для здоровья!',
    image: imgPromo3,
    date: '2 cентября 2020 г.'
  },
  {
    id: 5,
    title: 'Ломаем цены!',
    description: 'C 1 по 31 октября очень низкие цены на необходимые препараты.',
    image: imgPromo2,
    date: '1 октября 2020 г.'
  },
  {
    id: 6,
    title: 'Ломаем цены!',
    description: 'C 1 по 31 октября очень низкие цены на необходимые препараты.',
    image: imgPromo2,
    date: '1 октября 2020 г.'
  }
]

const PromoPage = () => {

  return (
    <LayoutDesktop>
      <div className='PromoPage wrapper'>
        <h1 className='PromoPage__mainTitle'>Страница Акций</h1>
        <div className='PromoPage__container'>
          {
            data.map((item, id) => {
              return <PromoItem key={id} item={item}/>
            })
          }
        </div>
      </div>
    </LayoutDesktop>
  )
}

export default PromoPage