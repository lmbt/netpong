import React from 'react'
import { connect } from 'react-redux'
/*
TO CENTER IN PARENT APPLY THIS

    position: fixed;
    top: 50%;
    left: 50%;
    margin-top: -201px;
    margin-left: -160px;
*/

const MultiplayerConnect = ({...props}) => {
  let closeMultiplayerConnectWindow = () => {
    props.dispatch({
      type: 'MULTIPLAYER_SETTINGS',
      payload: {
        multiplayerSettingsWindow: 'closed'
      }
    })
  }

  return (
    <div
      className={'max-w-xs fixed'}
      style={{
        top: '50%',
        left: '50%',
        marginTop: '-201px',
        marginLeft: '-160px'
      }}
    >
      <form className={'bg-gray-300 shadow-md rounded px-8 pt-6 pb-8 mb-4'}>
        <div className={'mb-4'}>
          <label className={'block text-gray-700 text-sm font-bold mb-2'} htmlFor={'playerId'}>
            Player ID
          </label>
          <input
            className={'shadow appearance-none border rounded  py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'}
            id={'playerid'}
            type={'text'}
            value={props.pong.playerId}
            readOnly={true}
          />
        </div>
        <div className={'mb-4 flex items-center justify-between'}>
          <button
            className={'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'}
            type={'button'}
            onClick={() => {
              props.getLocalPeerId()
            }}
          >
            Generate Player ID
          </button>
        </div>
        <div className={'mb-4'}>
          <label className={'block text-gray-700 text-sm font-bold mb-2'} htmlFor={'playerId'}>
            Remote player's ID:
          </label>
          <input
            className={'shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'}
            id={'hostId'}
            type={'text'}
            placeholder={'put other player\'s id here'}
          />
        </div>
        <div className={'mb-4 flex items-center justify-between'}>
          <button
            className={'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'}
            type={'button'}
            onClick={() => {
              props.connectToRemotePeer(document.getElementById('hostId').value)
            }}
          >
            Connect to Player
          </button>
        </div>
        <div className={'mb-4'}>
          <label
            className={'block text-gray-700 text-sm font-bold mb-2'}
            htmlFor={'playerId'}
            style={{
              marginTop: '0.5rem',
              marginBottom: '0.5rem'
            }}
          >
            Connection status: {
              props.pong.connected
              ? <span style={{color: 'red'}}>Connected</span>
              : <span style={{color: 'red'}}>Disconnected</span>
            }
          </label>
        </div>
        <div className={'flex items-center justify-between'}>
          <button
            className={'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'}
            type={'button'}
            onClick={() => {closeMultiplayerConnectWindow()}}
          >
            Close
          </button>
        </div>
      </form>
    </div>
  )
}

export default connect(state => state)(MultiplayerConnect)