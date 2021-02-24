import React, {useEffect, useState} from "react"
import {withRouter} from 'react-router-dom'
import {
  getProductsFromSearchLimit,
  onRequestFromSearchPanel
} from "../../actions";
import {connect} from "react-redux";
import SearchForm from "../UI/SearchForm/SearchForm";
import apiService from "../../service/ApiService";

const SearchPanel = (props) => {

  const [value, setValue] = useState('')

  // useEffect(() => {
  //   if (value.length) {
  //     apiService.yandexPredictor(value)
  //   }
  // }, [value])

  const {
    isMobile = false,
    onTouched = () => {
    }
  } = props;

  const handleInputChange = (e) => {
    const input = e.target
    const value = input.value;
    setValue(value)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onTouched()

    props.getProductsFromSearchLimit({productName: value}) // запрос

    // requestFromSearchPanelThisTime = true, чтобы другие компоненты знали, что запрос пошёл именно с панели поиска
    props.onRequestFromSearchPanel()

    setValue('')
    props.history.push('/Cards/')
    window.scroll(0, 0)
  }

  return (
    <SearchForm onSubmit={handleSubmit}
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
    getProductsFromSearchLimit: (options) => dispatch(getProductsFromSearchLimit(options)),
    onRequestFromSearchPanel: () => dispatch(onRequestFromSearchPanel())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SearchPanel))
