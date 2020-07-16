import Settings from './Settings'
import Controls from './Controls'
import Panel from './Panel'
import { connect } from 'react-redux'
import React from 'react'
import MultiplayerConnect from './MultiplayerConnect'
import Multiplayer from './Controls/Multiplayer'

const UI = ({...props}) => {
  let togglePause = () => {
    props.game.shareEmitter().emit('togglePause')
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
        id={'pseudo-screen'}
        className={'flex mb-4'}
      >
        <Panel player={1}/>
        <div
          id={'gameRoot'}
          style={
            {width: '800px'},
            {height: '400px'}
          }
        />
        <Panel player={2}/>
      </div>
      <Controls
        togglePause={togglePause}
        reset={resetButton}
      />
    </div>
  )
}

export default connect(state => state)(UI)