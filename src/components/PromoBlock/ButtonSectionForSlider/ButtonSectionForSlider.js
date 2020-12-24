import React, {useState} from "react";
import './ButtonSectionForSlider.scss'
import ButtonForButtonSection from "../ButtonForButtonSection/ButtonForButtonSection";

const ButtonSectionForSlider = props => {
  const [acitveButton, setActiveButton] = useState(0)
  return (
    <div className='ButtonSectionForSlider'>
      {
        props.items.map((item, index) => {
          return (
            <ButtonForButtonSection key={index + Math.random()}
                                    title={item.title}
                                    isActive={acitveButton === index}
                                    onClick={() => setActiveButton(index)}
            />
          )
        })
      }
    </div>
  )
}

export default ButtonSectionForSlider