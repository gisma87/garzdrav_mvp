import React, {useState} from "react"
import './SearchPanel.scss'
import {withRouter} from 'react-router-dom'
import {ProductsFromSearchLoaded, loadingTrue, setError} from "../../actions";
import {connect} from "react-redux";
import apiServise from "../../service/StoreService";
import SearchForm from "../UI/SearchForm/SearchForm";

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
      .catch((error) => {
        setError(error)
      });

    setValue('')
    props.history.push('/Cards/')
    window.scroll(0, 0)
  }

  return (
    <SearchForm formClass={touched ? '' : ' SearchPanel-mobile'}
                onSubmit={handleSubmit}
                idInput="searchPanel"
                isMobile={isMobile}
                placeholder={window.innerWidth > 1000 ? "Поиск по названию, действующему веществу, производителю" : "Поиск по названию"}
                onChange={handleInputChange}
                value={value}
    />
    // <form className={'SearchPanel' + (touched ? '' : ' SearchPanel-mobile')} onSubmit={handleSubmit}>
    //   <input
    //     id="searchPanel"
    //     style={isMobile ? {'font-size': 14} : {}}
    //     type="text"
    //     placeholder={props.text ? props.text : (window.innerWidth > 1000 ? "Поиск по названию, действующему веществу, производителю" : "Поиск по названию")}
    //     onChange={handleInputChange}
    //     value={value}
    //   />
    //   <button>
    //     <img src={searchIcon} alt=""/>
    //   </button>
    // </form>
  )
}


const mapStateToProps = ({productsFromSearch, isCity}) => {
  return {productsFromSearch, isCity}
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadingTrue: () => dispatch(loadingTrue()),
    setError: (e) => dispatch(setError(e)),
    ProductsFromSearchLoaded: (data) => dispatch(ProductsFromSearchLoaded(data))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SearchPanel))
