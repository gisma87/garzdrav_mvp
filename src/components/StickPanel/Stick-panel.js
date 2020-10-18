import React from "react"
import './Stick-panel.css'
import ButtonBurgerMobile from "../BurgerMobule/Button-burger-mobile";
import Menu from "../MenuMobile/Menu";

class StickPanel extends React.Component {

  state = {
    showCatalog: false
  };

  render() {
    return (
      <section className="stick-panel">
        <ButtonBurgerMobile>
          <Menu/>
        </ButtonBurgerMobile>

        <div className="stick-panel__item stick-panel__item--catalog" style={{flex: '1 0 auto'}}
             onClick={() => this.setState({showCatalog: !this.state.showCatalog})}
        >
          <div className="stick-panel__catalog-container" >
            <i className={"fas fa-archive stick-panel__img-catalog" + (this.state.showCatalog ? " className-hidden" : "")}/>
            <i className={"fas fa-times stick-panel__img-catalog" + (!this.state.showCatalog ? " className-hidden" : "")}/>
          </div>
          <p className="stick-panel__catalog-title">Каталог</p>
        </div>
        <a href="#" className="stick-panel__item">
          <svg viewBox="0 0 23 22">
            <path fillRule="evenodd" clipRule="evenodd"
                  d="M18.5 9.5C18.5 13.8467 14.7678 17.5 10 17.5C5.23215 17.5 1.5 13.8467 1.5 9.5C1.5 5.15329 5.23215 1.5 10 1.5C14.7678 1.5 18.5 5.15329 18.5 9.5ZM16.5871 16.6479C14.8277 18.1124 12.523 19 10 19C4.47715 19 0 14.7467 0 9.5C0 4.25329 4.47715 0 10 0C15.5228 0 20 4.25329 20 9.5C20 11.8236 19.1219 13.9524 17.6637 15.6031L22.4467 20.3861C22.7396 20.679 22.7396 21.1539 22.4467 21.4468C22.1538 21.7397 21.6789 21.7397 21.386 21.4468L16.5871 16.6479Z"/>
          </svg>
        </a>
        <a href="#" className="stick-panel__item">
          <div className="stick-panel__image-cart"/>
          <div className="stick-panel__counter">3</div>
        </a>
        <a href="#" className="stick-panel__item">
          <svg viewBox="0 0 18 16">
            <path
              d="M16.546 1.485A4.914 4.914 0 0013.024.012a4.926 4.926 0 00-3.526 1.477l-.492.498-.5-.505a4.938 4.938 0 00-7.048-.008A5.017 5.017 0 000 5.039 5.03 5.03 0 001.465 8.6l7.167 7.246c.099.1.233.154.362.154.13 0 .264-.05.363-.15l7.181-7.235A5.037 5.037 0 0018 5.05a5.013 5.013 0 00-1.454-3.565zm-.733 6.393l-6.819 6.868-6.804-6.88A3.994 3.994 0 011.03 5.04c0-1.069.409-2.072 1.157-2.824a3.902 3.902 0 012.79-1.17c1.056 0 2.052.417 2.8 1.173l.862.872a.51.51 0 00.73 0l.854-.864a3.914 3.914 0 012.797-1.173c1.053 0 2.045.417 2.793 1.17A3.99 3.99 0 0116.97 5.05a3.975 3.975 0 01-1.157 2.828z"/>
          </svg>
        </a>
      </section>
    )
  }
}

export default StickPanel