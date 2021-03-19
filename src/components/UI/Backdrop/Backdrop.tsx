import React from 'react'
import './Backdrop.css'

type Props = {
    onClick(): void
}

const Backdrop: React.FC<Props> = props => <div className='Backdrop' onClick={props.onClick}/>

export default Backdrop