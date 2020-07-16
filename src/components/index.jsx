import Settings from './Settings'
import Controls from './Controls'
import { connect } from 'react-redux'
import React from 'react'
import MultiplayerConnect from './MultiplayerConnect'
import Multiplayer from './Controls/Multiplayer'

const UI = ({...props}) => {
  let pauseButton = () => {
    console.log('tried to pause...')
    props.game.shareEmitter().emit('pauseGame')
  }
  let unpauseButton = () => {
    props.game.shareEmitter().emit('unpauseGame')
  }
  let resetButton = () => {
    props.game.shareEmitter().emit('resetGame')
  }
  let getLocalPeerId = () => {
    props.game.createPeer(
      props.pong.host,
      props.pong.port,
      props.pong.path,
      props.pong.secure === 'true'
    ).then(() => {
      console.log(props.game.getPeerID())
      props.dispatch({
        type: 'MULTIPLAYER_SETTINGS',
        payload: {
          playerId: props.game.getPeerID()
        }
      })
    })
  }
  let connectToRemotePeer = (remotePlayerID) => {
    if (props.pong.playerId === '') {
      getLocalPeerId()
    }
    props.game.connectToPeer(remotePlayerID)
  }
  return (
    <div>
      {props.pong.gameSettingsWindow === 'open' ? <Settings/> : null}
      {props.pong.multiplayerSettingsWindow === 'open' ? <MultiplayerConnect getLocalPeerId={getLocalPeerId} connectToRemotePeer={connectToRemotePeer}/> : null}
      <div
        id={'gameRoot'}
        style={
          {width: '800px'},
          {height: '400px'}
        }
      />
      <Controls
        pause={pauseButton}
        unpause={unpauseButton}
        reset={resetButton}
      />
    </div>
  )
}

export default connect(state => state)(UI)