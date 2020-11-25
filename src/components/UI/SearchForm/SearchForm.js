import React from "react";
import './SearchForm.scss'
import searchIcon from "../../../img/search-solid.svg";

const SearchForm = (props) => {
  return (
    <form className={'SearchForm ' + props.formClass} onSubmit={props.onSubmit}>
      <input
        id={props.idInput}
        style={props.isMobile ? {'font-size': 14} : {}}
        type="text"
        placeholder={props.placeholder}
        onChange={props.onChange}
        value={props.value}
      />
      <button>
        <img src={searchIcon} alt=""/>
      </button>
    </form>
  )
}

export default SearchForm