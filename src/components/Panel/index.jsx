import React from 'react'
import { connect } from 'react-redux'

const Panel = ({...props}) => {
  let score
  let isActivePlayer = false
  let classes
  if (props.player === 1) {
    score = props.pong.player1Score
    classes = 'flex-1 bg-gray-400 h-full rounded-l-lg'
    if (props.activePlayer === 1) {
      isActivePlayer = true
    }
  } else {
    score = props.pong.player2Score
    classes = 'flex-1 bg-gray-400 h-full rounded-r-lg'
    if (props.activePlayer === 2) {
      isActivePlayer = true
    }
  }
  return (
    <div
      className={classes}
    >panel</div>
  )
}

export default connect(state => state)(Panel)