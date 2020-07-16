import React from 'react'
import { connect } from 'react-redux'

const PausePlay = ({...props}) => {
  let togglePause = () => {
    console.log(props)
    if (props.pong.gameActive === false) {
      props.dispatch({
        type: 'MULTIPLAYER_SETTINGS',
        payload: {
          gameActive: true
        }
      })
      props.unpause()
    } else {
      props.dispatch({
        type: 'MULTIPLAYER_SETTINGS',
        payload: {
          gameActive: false
        }
      })
      props.pause()
    }
  }
  return (
    <button
      type={'button'}
      onClick={() => {togglePause()}}
    >Pause/Play</button>
  )
}

export default connect(state => state)(PausePlay)