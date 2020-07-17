import React from 'react'
import { connect } from 'react-redux'

const Panel = ({...props}) => {
  let score
  let isActivePlayer = false
  let classes
  if (props.player === 1) {
    score = props.pong.player1Score
    classes = 'flex-1 bg-gray-400 h-full border rounded-bl-lg border-black border-solid flex flex-col justify-center items-center'
    if (props.activePlayer === 1) {
      isActivePlayer = true
    }
  } else {
    score = props.pong.player2Score
    classes = 'flex-1 bg-gray-400 h-full border rounded-br-lg border-black border-solid flex flex-col justify-center items-center'
    if (props.activePlayer === 2) {
      isActivePlayer = true
    }
  }
  return (
    <div
      className={classes}
      style={
        {
          padding: '1px',
          width: '100px'
        }
      }
    >
      <div
        className={'font-serif text-lg text-gray-800 text-center'}
        style={{minHeight: '1px'}}
      >{isActivePlayer ? 'You' : ''}</div>
      <div
        style={{minHeight: '1px'}}
        className={'font-serif text-lg text-gray-800 text-center'}
      >{score}</div>
    </div>
  )
}

export default connect(state => state)(Panel)