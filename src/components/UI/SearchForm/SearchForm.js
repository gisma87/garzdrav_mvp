import React from "react";
import './SearchForm.scss'
import SvgSearchIcon from "../../../img/SVGcomponents/SvgSearchIcon";

const SearchForm = (props) => {
  return (
    <form className='SearchForm' onSubmit={props.onSubmit}>
      <input
        id={props.idInput}
        style={props.isMobile ? {'font-size': 14} : {}}
        type="text"
        placeholder={props.placeholder}
        onChange={props.onChange}
        value={props.value}
      />
      <button className='SearchForm__button'>
        <SvgSearchIcon className='SearchForm__icon' />
      </button>
    </form>
  )
}

export default SearchForm