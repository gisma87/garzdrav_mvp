import React from 'react'
import './Select.css'

type Props = {
    label: string,
    value: string,
    onChange(e: React.SyntheticEvent): void,
    options: { value: string, text: string }[]
}

const Select: React.FC<Props> = props => {
    const htmlFor = `${props.label}-${Math.random()}`
    return (
        <div className='Select'>
            <label htmlFor={htmlFor}>{props.label}</label>
            <select id={htmlFor}
                    value={props.value}
                    onChange={props.onChange}
            >
                {props.options.map((option, index) => {
                    return (
                        <option
                            key={option.value + index}
                            value={option.value}
                        >
                            {option.text}
                        </option>
                    )
                })}
            </select>
        </div>
    )
}

export default Select