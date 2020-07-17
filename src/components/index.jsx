import Settings from './Settings'
import Controls from './Controls'
import Panel from './Panel'
import { connect } from 'react-redux'
import React from 'react'
import MultiplayerConnect from './MultiplayerConnect'
import Multiplayer from './Controls/Multiplayer'

const UI = ({...props}) => {
  if (props.game) {
    props.game.shareEmitter().on('player1Scored', () => {
      props.dispatch({
        type: 'MULTIPLAYER_SETTINGS',
        payload: {
          player1Score: props.game.gameObjects.player1.points
        }
      })
    })
    props.game.shareEmitter().on('player2Scored', () => {
      props.dispatch({
        type: 'MULTIPLAYER_SETTINGS',
        payload: {
          player2Score: props.game.gameObjects.player2.points
        }
      })
    })
    props.game.shareEmitter().on('scoreReset', () => {
      props.dispatch({
        type: 'MULTIPLAYER_SETTINGS',
        payload: {
          player1Score: props.game.gameObjects.player1.points,
          player2Score: props.game.gameObjects.player2.points
        }
      })
    })
  }
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
    <div
      className={'ml-auto mr-auto bg-gray-500 rounded-b-lg rounded-tl-md rounded-tr-md flex flex-col my-4 border border-black border-solid rounded-t-lg'}
      style={
        {width: '1000px'},
        {height: '500px'}
      }
    >
      {props.pong.gameSettingsWindow === 'open' ? <Settings/> : null}
      {props.pong.multiplayerSettingsWindow === 'open' ? <MultiplayerConnect getLocalPeerId={getLocalPeerId} connectToRemotePeer={connectToRemotePeer}/> : null}
      <div
        id={'pseudo-screen'}
        className={'flex'}
      >
        <Panel player={1} objects={props.game}/>
        <div
          id={'gameRoot'}
          style={
            {width: '800px'},
            {height: '400px'}
          }
          className={'border-2 border-gray-600'}
        />
        <Panel player={2} objects={props.game}/>
      </div>
      <Controls
        togglePause={togglePause}
        reset={resetButton}
      />
    </div>
  )
}

export default connect(state => state)(UI)