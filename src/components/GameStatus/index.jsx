import React from 'react'
import { connect } from 'react-redux'

const GameStatus = ({...props}) => {
  console.log(props)
  return (
    <div>
      {props.pong.mode === 'SP' ? 'Single Player' : 'Multiplayer'}
    </div>
  )
}

export default connect(state => state)(GameStatus)