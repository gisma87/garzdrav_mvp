import React, {useEffect, useRef} from "react";
import './SearchForm.scss'
import SvgSearchIcon from "../../../img/SVGcomponents/SvgSearchIcon";

const SearchForm = (props) => {
  const input = useRef()
  useEffect(() => {
    if (props.focus) {
      input.focus()
      props.setFocus(false)
    }
  }, [props.focus])
  return (
    <form className='SearchForm' onSubmit={props.onSubmit}>
      <input
        id={props.idInput}
        style={props.isMobile ? {'font-size': 14} : {}}
        type="text"
        placeholder={props.placeholder}
        onChange={props.onChange}
        value={props.value}
        ref={input}
      />
      <button className='SearchForm__button'>
        <SvgSearchIcon className='SearchForm__icon'/>
      </button>
    </form>
  )
}

export default SearchForm