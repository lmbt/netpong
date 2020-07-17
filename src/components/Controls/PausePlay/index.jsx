import React from 'react'
import { connect } from 'react-redux'
import {
  FaPlay,
  FaPause
} from 'react-icons/fa'

const PausePlay = ({...props}) => {
  return (
    <button
      type={'button'}
      className={'flex bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg'}
      onClick={() => {props.togglePause()}}
    >
      <FaPlay style={{marginRight: '10px'}}/>
      <FaPause/>
    </button>
  )
}

export default connect(state => state)(PausePlay)