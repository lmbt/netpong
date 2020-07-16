import React from 'react'
import { connect } from 'react-redux'

const Multiplayer = ({...props}) => {
  let openMultiplayerConnect = () => {
    props.dispatch({
      type: 'MULTIPLAYER_SETTINGS',
      payload: {
        multiplayerSettingsWindow: 'open'
      }
    })
  }
  return (
    <button
      type={'button'}
      onClick={() => {openMultiplayerConnect()}}
    >Multiplayer</button>
  )
}

export default connect(state => state)(Multiplayer)