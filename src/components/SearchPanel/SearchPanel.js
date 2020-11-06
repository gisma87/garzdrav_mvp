import React, {useState} from "react"
import './SearchPanel.scss'
import {withRouter} from 'react-router-dom'
import searchIcon from "../../img/search-solid.svg"
import {ProductsFromSearchLoaded, loadingTrue} from "../../actions";
import {compose} from "../../utils";
import withStoreService from "../../hoc/withStoreService/withStoreService";
import {connect} from "react-redux";

const SearchPanel = (props) => {

  const {isCity, productsFromSearch, ProductsFromSearchLoaded, isMobile = false} = props;

  const [value, setValue] = useState('')

  const handleInputChange = (e) => {
    const input = e.target
    // const id = e.target.id
    const value = input.value;

    setValue(value)
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    props.storeService.getProductsFromSearch(value, isCity.guid)
      .then((data) => {
        ProductsFromSearchLoaded(data)
        console.log(data);
      })
      .catch((error) => console.log(error));


    setValue('')
    props.history.push('/Cards/')
    window.scroll(0, 0)
  }

  return (
    <form className='SearchPanel' onSubmit={handleSubmit}>
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

const mapDispatchToProps = (dispatch, ownProps) => {
  const {storeService} = ownProps;
  return {
    // fetchProductsFromSearch: fetchProductsFromSearch(storeService, dispatch),
    // loadingTrue: dispatch(loadingTrue),
    ProductsFromSearchLoaded: (data) => dispatch(ProductsFromSearchLoaded(data))
  }
}

export default compose(
  withStoreService(),
  connect(mapStateToProps, mapDispatchToProps)
)(withRouter(SearchPanel))
