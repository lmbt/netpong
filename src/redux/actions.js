export const setMultiplayerSettings = settings => ({
  type: 'MULTIPLAYER_SETTINGS',
  payload: {
    name: settings.name,
    host: settings.host,
    port: settings.port,
    path: settings.path,
    secure: settings.secure
  }
})