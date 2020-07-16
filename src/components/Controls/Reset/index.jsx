import React from 'react'
import { connect } from 'react-redux'

const Reset = ({...props}) => {
  return (
    <button
      type={'button'}
      onClick={() => {props.reset()}}
    >Reset</button>
  )
}

export default connect(state => state)(Reset)