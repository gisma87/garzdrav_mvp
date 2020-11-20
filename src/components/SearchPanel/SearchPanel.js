import React, {useState} from "react"
import './SearchPanel.scss'
import {withRouter} from 'react-router-dom'
import searchIcon from "../../img/search-solid.svg"
import {ProductsFromSearchLoaded, loadingTrue} from "../../actions";
import {connect} from "react-redux";
import apiServise from "../../service/StoreService";

const SearchPanel = (props) => {

  const {
    isCity,
    loadingTrue,
    ProductsFromSearchLoaded,
    isMobile = false,
    touched = true,
    onTouched = () => {
    }
  } = props;

  const [value, setValue] = useState('')

  const handleInputChange = (e) => {
    const input = e.target
    const value = input.value;
    setValue(value)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onTouched()
    loadingTrue()
    apiServise.getProductsFromSearch(value, isCity.guid)
      .then((data) => ProductsFromSearchLoaded(data))
      .catch((error) => console.log(error));

    setValue('')
    props.history.push('/Cards/')
    window.scroll(0, 0)
  }

  return (
    <form className={'SearchPanel' + (touched ? '' : ' SearchPanel-mobile')} onSubmit={handleSubmit}>
      <input
        id="searchPanel"
        style={isMobile ? {'font-size': 14} : {}}
        type="text"
        placeholder={window.innerWidth > 1000 ? "Поиск по названию, действующему веществу, производителю" : "Поиск по названию"}
        onChange={handleInputChange}
        value={value}
      />
      <button>
        <img src={searchIcon} alt=""/>
      </button>
    </form>
  )
}


const mapStateToProps = ({productsFromSearch, isCity}) => {
  return {productsFromSearch, isCity}
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadingTrue: () => dispatch(loadingTrue()),
    ProductsFromSearchLoaded: (data) => dispatch(ProductsFromSearchLoaded(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SearchPanel))
