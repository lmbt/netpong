import React from 'react'
import { connect } from 'react-redux'
import { FaCog } from 'react-icons/fa'

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
      className={'flex bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg border-2 border-gray-600'}
      onClick={openSettings}
    >
    <FaCog style={{marginRight: '10px'}}/> Settings
    </button>
  )
}

export default connect(state => state)(Settings)