import React from 'react'
import { connect } from 'react-redux'
import PausePlay from './PausePlay'
import Reset from './Reset'
import Settings from './Settings'
import Multiplayer from './Multiplayer'

const Controls = ({...props}) => {
  return (
    <div
      className={'mt-auto mb-auto'}
    >
      <div
        id={'buttons'}
        className={'flex justify-evenly'}
      >
        <PausePlay
          togglePause={props.togglePause}
        />
        <Reset
          reset={props.reset}
        />
        <Settings/>
        <Multiplayer/>
      </div>
    </div>
  )
}

export default connect(state => state)(Controls)