import React, {useState} from "react"
import './SearchPanel.scss'
import {withRouter} from 'react-router-dom'
import {
  getProductsFromSearchLimit,
  onRequestFromSearchPanel
} from "../../actions";
import {connect} from "react-redux";
import SearchForm from "../UI/SearchForm/SearchForm";

const SearchPanel = (props) => {

  const {
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

    props.getProductsFromSearchLimit({productName: value}) // запрос

    // requestFromSearchPanelThisTime = true, чтобы другие компоненты знали, что запрос пошёл именно с панели поиска
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
    getProductsFromSearchLimit: (options) => dispatch(getProductsFromSearchLimit(options)),
    onRequestFromSearchPanel: () => dispatch(onRequestFromSearchPanel())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SearchPanel))
