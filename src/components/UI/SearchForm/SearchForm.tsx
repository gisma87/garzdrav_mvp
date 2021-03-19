import React, {useEffect, useRef} from "react";
import './SearchForm.scss'
import SvgSearchIcon from "../../../img/SVGcomponents/SvgSearchIcon";

type Props = {
    focus: boolean,
    setFocus(type: boolean): void
    onSubmit(e: React.SyntheticEvent): void,
    keyPress(e: React.SyntheticEvent): void,
    onChange(e: React.SyntheticEvent): void,
    idInput: string,
    isMobile: boolean,
    placeholder: string,
    value: string
}

const SearchForm: React.FC<Props> = (props) => {
    const input = useRef<HTMLInputElement>(null)
    useEffect(() => {
        if (props.focus) {
            if (input) input.current!.focus();
            props.setFocus(false)
        }
        // eslint-disable-next-line
    }, [props.focus])
    return (
        <form className='SearchForm' onSubmit={props.onSubmit} onKeyDown={props.keyPress}>
            <input
                id={props.idInput}
                style={props.isMobile ? {fontSize: 14} : {}}
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