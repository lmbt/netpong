import React from 'react'
import { connect } from 'react-redux'

const PausePlay = ({...props}) => {
  return (
    <button
      type={'button'}
      onClick={() => {props.togglePause()}}
    >Pause/Play</button>
  )
}

export default connect(state => state)(PausePlay)