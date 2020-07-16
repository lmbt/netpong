import React from 'react'
import { connect } from 'react-redux'
import PausePlay from './PausePlay'
import Reset from './Reset'
import Settings from './Settings'
import Multiplayer from './Multiplayer'

const Controls = ({...props}) => {
  return (
    <div>
      <div>Controls</div>
      <PausePlay
        pause={props.pause}
        unpause={props.unpause}
      />
      <Reset
        reset={props.reset}
      />
      <Settings/>
      <Multiplayer/>
    </div>
  )
}

export default connect(state => state)(Controls)