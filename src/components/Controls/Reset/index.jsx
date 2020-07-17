import React from 'react'
import { connect } from 'react-redux'
import { FaUndo } from 'react-icons/fa'

const Reset = ({...props}) => {
  return (
    <button
      type={'button'}
      className={'flex bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg'}
      onClick={() => {props.reset()}}
    >
    <FaUndo style={{marginRight: '10px'}}/>Reset
    </button>
  )
}

export default connect(state => state)(Reset)