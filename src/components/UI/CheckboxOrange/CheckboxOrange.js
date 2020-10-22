import React from "react";
import './CheckboxOrange.scss'

const CheckboxOrange = ({check, onCheck}) => {
  return (
    <label htmlFor="orange" className="CheckboxOrange">
      <input
        type="checkbox"
        id="orange"
        name="orange"
        className="CheckboxOrange__input CheckboxOrange__input_color_orange"
        checked={check}
        onChange={onCheck}
      />
      <span className="CheckboxOrange__span"/>
    </label>
  )
}

export default CheckboxOrange