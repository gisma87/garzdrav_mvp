import React from "react"
import './SearchPanel.scss'
import {withRouter} from 'react-router-dom'
import searchIcon from "../../img/search-solid.svg"

class SearchPanel extends React.Component {

  state = {
    value: '',
  }

  handleInputChange = (e) => {
    const input = e.target
    // const id = e.target.id
    const value = input.value;

    this.setState({value})
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({value: ''})
    this.props.history.push('/Cards/')
    window.scroll(0, 0)
  }

  render() {
    return (
      <form className='SearchPanel' onSubmit={this.handleSubmit}>
        <input
          id="searchPanel"
          type="text"
          placeholder={window.innerWidth > 1000 ? "Поиск по названию, действующему веществу, производителю" : "Поиск по названию"}
          onChange={this.handleInputChange}
          value={this.state.value}
        />
        <button>
          <img src={searchIcon} alt=""/>
        </button>
      </form>
    )
  }
}

export default withRouter(SearchPanel)