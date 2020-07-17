import React from 'react'
import { connect } from 'react-redux'
import { FaNetworkWired } from 'react-icons/fa'

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
      className={'flex bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg'}
      onClick={() => {openMultiplayerConnect()}}
    >
      <FaNetworkWired style={{marginRight: '10px'}}/> Multiplayer
    </button>
  )
}

export default connect(state => state)(Multiplayer)