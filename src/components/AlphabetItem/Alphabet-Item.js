import React from 'react'

class AlphabetItem extends React.Component {
  render() {
    return(
      <button className="alphabet__item">
        {this.props.letter}
      </button>
    )
  }
}

export default AlphabetItem