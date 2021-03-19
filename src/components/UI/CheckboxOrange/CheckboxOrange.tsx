import React from "react";
import './CheckboxOrange.scss'

type Props = {
    type: string,
    name :string,
    check: boolean,
    onCheck(): void
}

const CheckboxOrange: React.FC<Props> = ({check, onCheck, type, name}) => {
  return (
    <div
      // htmlFor="orange"
      className="CheckboxOrange">
      <input
        type={type}
        id="orange"
        name={name}
        className="CheckboxOrange__input CheckboxOrange__input_color_orange"
        checked={check}
        onChange={onCheck}
      />
      <span className="CheckboxOrange__span"/>
    </div>
  )
}

export default CheckboxOrange