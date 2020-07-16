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

const MultiPlayerSettings = ({...props}) => {
  let activeToggleClasses = 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700'
  let inactiveToggleClasses = 'bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent'
  let toggleSecure = e => {
    if (e.target.getAttribute('name') === 'secure-false') {
      e.target.setAttribute('id', 'secure')
      e.target.setAttribute('class', activeToggleClasses)
      let other = document.getElementsByName('secure-true')[0]
      other.setAttribute('class', inactiveToggleClasses)
      other.setAttribute('id', 'secure-inactive')
    } else {
      e.target.setAttribute('id', 'secure')
      e.target.setAttribute('class', activeToggleClasses)
      let other = document.getElementsByName('secure-false')[0]
      other.setAttribute('class', inactiveToggleClasses)
      other.setAttribute('id', 'secure-inactive')
    }
  }
  let applySettings = settings => {
    props.dispatch({
      type: 'MULTIPLAYER_SETTINGS',
      payload: {
        ...settings
      }
    })
  }
  let cancelSettings = () => {
    props.dispatch({
      type: 'MULTIPLAYER_SETTINGS',
      payload: {
        gameSettingsWindow: 'closed'
      }
    })
  }

  return (
    <div className={'w-full max-w-xs'}>
      <form className={'bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'}>
        <div className={'mb-4'}>
          <label className={'block text-gray-700 text-sm font-bold mb-2'} htmlFor={'name'}>
            Name
          </label>
          <input
            className={'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'}
            id={'name'}
            type={'text'}
            defaultValue={props.pong.name}
          />
        </div>
        <div className={'mb-4'}>
          <label
            className={'block text-gray-700 text-sm font-bold mb-2'}
            htmlFor={'host'}
          >
            Host
          </label>
          <input
            className={'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'}
            id={'host'}
            type={'text'}
            defaultValue={props.pong.host}
          />
        </div>
        <div className={'mb-4'}>
          <label
            className={'block text-gray-700 text-sm font-bold mb-2'}
            htmlFor={'path'}
          >
            Path
          </label>
          <input
            className={'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'}
            id={'path'}
            type={'text'}
            defaultValue={props.pong.path}
          />
        </div>
        <div className={'mb-4'}>
          <label className={'block text-gray-700 text-sm font-bold mb-2'} htmlFor={'port'}>
            Port
          </label>
          <input
            className={'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'}
            id={'port'}
            type={'text'}
            defaultValue={props.pong.port}
          />
        </div>
        <div className={'mb-4'}>
          <label className={'block text-gray-700 text-sm font-bold mb-2'} htmlFor={'secure'}>
            Secure
          </label>
          <button
            onClick={(e)=>{toggleSecure(e)}}
            type={'button'}
            value={false}
            name={'secure-false'}
            id={'secure-inactive'}
            className={inactiveToggleClasses}
          >
            False
          </button>
          <button
            onClick={(e)=>{toggleSecure(e)}}
            type={'button'}
            value={true}
            name={'secure-true'}
            id={'secure'}
            className={activeToggleClasses}
          >
            True
          </button>
        </div>
        <div className={'flex items-center justify-between'}>
          <button className={'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'} type={'button'}
            onClick={() => {
              applySettings({
                name: document.getElementById('name').value,
                host: document.getElementById('host').value,
                port: document.getElementById('port').value,
                path: document.getElementById('path').value,
                secure: document.getElementById('secure').getAttribute('value'),
                gameSettingsWindow: 'closed'
              })
            }}
          >
            Confirm
          </button>
          <button
            className={'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'}
            type={'button'}
            onClick={() => {cancelSettings()}}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default connect(state => state)(MultiPlayerSettings)