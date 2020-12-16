import React, {useState} from "react"
import './SearchPanel.scss'
import {withRouter} from 'react-router-dom'
import {
  ProductsFromSearchLoaded,
  loadingTrue,
  setError,
  getProductsFromSearchLimit,
  onRequestFromSearchPanel
} from "../../actions";
import {connect} from "react-redux";
import SearchForm from "../UI/SearchForm/SearchForm";

const SearchPanel = (props) => {

  const {
    loadingTrue,
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

    props.getProductsFromSearchLimit({productName: value})
    props.onRequestFromSearchPanel()

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
  )
}


const mapStateToProps = ({productsFromSearch, isCity}) => {
  return {productsFromSearch, isCity}
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadingTrue: () => dispatch(loadingTrue()),
    setError: (e) => dispatch(setError(e)),
    ProductsFromSearchLoaded: (data) => dispatch(ProductsFromSearchLoaded(data)),
    getProductsFromSearchLimit: (options) => dispatch(getProductsFromSearchLimit(options)),
    onRequestFromSearchPanel: () => dispatch(onRequestFromSearchPanel())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SearchPanel))
