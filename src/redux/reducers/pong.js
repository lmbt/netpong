const defaultState = {
  name: 'Player',
  host: '',
  port: '443',
  path: '/',
  secure: 'true',
  connected: false,
  gameActive: false,
  mode: 'SP',
  gameSettingsWindow: 'closed',
  multiplayerSettingsWindow: 'closed',
  playerId: '',
  connectedTo: ''
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'MULTIPLAYER_SETTINGS':
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}