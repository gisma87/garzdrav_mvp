import React from "react";
import './Promotion.scss'
// import data from "../../testData/articlesANDpromo";
import BlockWrapper from "../../components/BlockWrapper";
import imgPromo1 from "../../img/test/promotion1.jpg";
import imgPromo2 from "../../img/test/promotion2.png";

const Promotion = ({itemId}) => {
  // const {title, description, image, date} = data[itemId - 1]
  return (
    <section className='Promotion wrapper'>

      <img className='Promotion__image' src={imgPromo1} alt=""/>

      <BlockWrapper classStyle='Promotion__moreInfo'>
        <h3>Ломаем цены!</h3>
        <div className='Promotion__description'>
          <h4>C 1 по 31 октября</h4>
          <p>
            Осень - время горячего чая и долгих посиделок в кругу друзей и близких. К сожалению, не всегда
            получается наслаждаться осенним уютом из-за проблем со здоровьем.
            Осенью традиционно обостряются некоторые хронические заболевания и увеличивается частота простуд.
          </p>
          <p>
            В это время особенно важно следить за своим здоровьем. Берегите себя и будьте здоровы!
          </p>
          <p>
            Только с 1 по 31 октября во всех аптеках "Гармония здоровья", "Дешевая аптека", "Аптека Всем" очень
            низкие цены на необходимые препараты.
          </p>
          <p>
            ИМЕЮТСЯ ПРОТИВОПОКАЗАНИЯ, НЕОБХОДИМА КОНСУЛЬТАЦИЯ СПЕЦИАЛИСТА!
          </p>
        </div>
      </BlockWrapper>

      <img className='Promotion__image' src={imgPromo2} alt=""/>

    </section>
  )
}

export default Promotion