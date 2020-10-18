import React from 'react'
import './Section-index.css'
import {alphabet} from '../../data/alphabet'
import AlphabetItem from "../AlphabetItem/Alphabet-Item";

class SectionIndex extends React.Component {

  render() {
    return (
      <div className='section-index-wrapper'>
        <section className='section-index'>
          <a href="/" className='logo' />
          <div className="section-index__form">
            <div className="input">
              <input type="text"
                     placeholder="Поиск товара"
                     className="input__field--search"
              />
              <button className="section-index__form-clear">
                <svg id="cross" viewBox="0 0 24 16">
                  <path
                    d="M18.7151 13.3011L6.25512 0.841053C5.78786 0.373801 5.09979 0.31427 4.70696 0.707107C4.31412 1.09994 4.37365 1.78801 4.8409 2.25527L17.3009 14.7153C17.7682 15.1825 18.4563 15.2421 18.8491 14.8492C19.2419 14.4564 19.1762 13.7621 18.7151 13.3011Z" />
                  <path
                    d="M17.3011 0.841007L4.84105 13.301C4.3738 13.7683 4.31427 14.4564 4.70711 14.8492C5.09994 15.242 5.78801 15.1825 6.25527 14.7153L18.7153 2.25522C19.1825 1.78797 19.2421 1.0999 18.8492 0.707061C18.4564 0.314224 17.7621 0.379986 17.3011 0.841007Z" />
                </svg>
              </button>
            </div>
          </div>

          <p className="section-index__text">
            Введите название, активное вещество, симптом, производителя или штрих-код
          </p>
        </section>

        <div className="section-index__alphabet-container">
          <div className="section-index__alphabet-heading">Список лекарств по алфавиту:</div>
          <div className="section-index__alphabet">
            <div className="alphabet">
              {alphabet.map((item, index) => {
                return (
                  <AlphabetItem
                    key={index}
                    letter={item}
                  />
                )
              })}
            </div>
          </div>
          <p className="section-index__footer-text">Любая информация, размещенная на сайте, не является публичной
            офертой</p>
        </div>
      </div>
    )
  }

}

export default SectionIndex