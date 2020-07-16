import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import store from './redux/store'
import UI from './components'
import { Provider } from 'react-redux'
import NetPong from './game/netpong'
const EventEmitter = require('events')

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pongGame: null
    }
  }
  componentDidMount(){
    this.setState({
      pongGame: new NetPong(document.getElementById('gameRoot'))
    })
  }
  render() {
    return (
      <Provider store={store}>
        <UI
          game={this.state.pongGame}
        />
      </Provider>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('app'))