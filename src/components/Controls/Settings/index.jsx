import React from 'react'
import { connect } from 'react-redux'

const Settings = ({...props}) => {
  let openSettings = () => {
    props.dispatch({
      type: 'MULTIPLAYER_SETTINGS',
      payload: {
        gameSettingsWindow: 'open'
      }
    })
  }
  return (
    <button
      type={'button'}
      onClick={openSettings}
    >Settings</button>
  )
}

export default connect(state => state)(Settings)