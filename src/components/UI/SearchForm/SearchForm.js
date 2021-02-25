import React, {useEffect, useRef} from "react";
import './SearchForm.scss'
import SvgSearchIcon from "../../../img/SVGcomponents/SvgSearchIcon";

const SearchForm = (props) => {
  const input = useRef(null)
  useEffect(() => {
    if (props.focus) {
      if (input) input.current.focus();
      props.setFocus(false)
    }
    // eslint-disable-next-line
  }, [props.focus])
  return (
    <form className='SearchForm' onSubmit={props.onSubmit} onKeyDown={props.keyPress}>
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