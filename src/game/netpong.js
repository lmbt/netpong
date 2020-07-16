const EventEmitter = require('events')

class NetPong {
  constructor(rootEl) {
    this.rootEl = rootEl
    this.createCanvas()
    this.isGameActive = false
    this.mpTickInterval = 10
    // 1000 / (ticksPerSecond)
    this.gameTickRate = 7
    this.lastTickTime = Date.now()
    this.connectedToPeer = false
    this.roundEnded = false
    this.role = null
    this.peer = null
    this.conn = null
    this.intervalID = null
    this.mpPlayer = 1
    this.gameObjects = {
      player1: {
        posX: 0,
        posY: this.canvas.height / 2,
        radius: this.canvas.height / 10,
        thickness: 5,
        upKey: 'KeyW',
        downKey: 'KeyS',
        points: 0
      },
      player2: {
        posX: this.canvas.width,
        posY: this.canvas.height / 2,
        radius: this.canvas.height / 10,
        thickness: 5,
        upKey: 'KeyO',
        downKey: 'KeyL',
        points: 0
      },
      ball: {
        velX: this.randomVel(),
        velY: this.randomVel(),
        posX: this.canvas.width / 2,
        posY: this.canvas.height / 2,
        radius: 15
      }
    }
    this.setupEmitter()
    let self = this
    document.addEventListener('keydown', this.keyPress)
    document.addEventListener('keyup', this.keyPress)
    this.render()
  }
  shareEmitter() {
    return this.emitter
  }
  setupEmitter() {
    this.emitter = new EventEmitter()
    this.emitter.on('unpauseGame', () => {
      this.unpauseGame()
    })
    this.emitter.on('pauseGame', () => {
      this.pauseGame()
    })
    this.emitter.on('resetGame', () => {
      this.resetGame()
    })
    this.emitter.on('togglePause', () => {
      if (this.isGameActive) {
        this.pauseGame()
      } else {
        this.unpauseGame()
      }
    })
  }
  createCanvas() {
    this.canvas = this.rootEl.appendChild(document.createElement('canvas'))
    this.canvas.width = 800
    this.canvas.height = 400
    this.canvas.setAttribute('style', 'border: 1px solid black;')
    this.context = this.canvas.getContext('2d')
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height)
    this.context.fillStyle = 'black'
  }
  setPlayer2Active() {
    this.emitter.emit('becomePlayer2')
    this.mpPlayer = 2
    this.gameObjects.player2.upKey = 'KeyW'
    this.gameObjects.player2.downKey = 'KeyS'
    this.gameObjects.player1.upKey = 'KeyO'
    this.gameObjects.player1.downKey = 'KeyL'
  }
  setPlayer1Active() {
    this.emitter.emit('becomePlayer1')
    this.mpPlayer = 1
    this.gameObjects.player1.upKey = 'KeyW'
    this.gameObjects.player1.downKey = 'KeyS'
    this.gameObjects.player2.upKey = 'KeyO'
    this.gameObjects.player2.downKey = 'KeyL'
  }
  createPeer(host, port, path, secure) {
    return new Promise((resolve, reject) => {
      this.peer = new Peer(
        {
          host: host,
          // '9000-d582543a-a7fd-443b-af8c-a59928d33dd4.ws-us02.gitpod.io'
          port: port,
          // '443'
          path: path,
          // '/'
          secure: true,
          debug: 3
        }
      )
      // Emitted when a new peer is successfully created.
      this.peer.on('open', () => {
        this.emitter.emit('localPeerCreate')
        resolve('Peer is alive.')
      })
      // Emitted when anything goes wrong. Peer is most likely destroyed after this.
      this.peer.on('error', (err) => {
        this.connectedToPeer = false
        this.role = null
        this.emitter.emit('localPeerError')
        reject(err)
      })
      // Emitted when a new connection is received from another Peer.
      this.peer.on('connection', (conn) => {
        this.conn = conn
        this.conn.on('open', () => {
          this.role = 'client'
          this.setPlayer2Active()
          this.connectedToPeer = true
          this.emitter.emit('connectionFromRemotePeer')
          this.intervalID = setInterval(this.sendStateToPeer, this.mpTickInterval)
        })
        this.conn.on('data', (data) => {
          this.handleMessage(data)
        })
        this.conn.on('error', (err) => {
          this.connectedToPeer = false
          this.role = null
          console.error(err)
          this.emitter.emit('peerConnectionError')
          clearInterval(this.intervalID)
        })
      })
    })
  }
  getPeerID() {
    return this.peer.id
  }
  sendMessage = (message) => {
    if (this.conn.open) {
      this.conn.send(message)
      this.emitter.emit('messageToRemotePeer')
    }
  }
  handleMessage(message) {
    if (this.role === 'host') {
      this.gameObjects.player2.posX = message.player2.posX
      this.gameObjects.player2.posY = message.player2.posY
    } else {
      this.gameObjects.player1.posX = message.player1.posX
      this.gameObjects.player1.posY = message.player1.posY
      this.gameObjects.ball = message.ball
      this.gameObjects.player1.points = message.player1.points
      this.gameObjects.player2.points = message.player2.points
      if (!this.isGameActive && message.active) {
        this.isGameActive = message.active
        this.render()
      }
      if (this.isGameActive && !message.active) {
        this.isGameActive = message.active
      }
    }
    this.emitter.emit('messageFromRemotePeer')
  }
  connectToPeer(id) {
    this.conn = this.peer.connect(id)
    this.conn.on('open', () => {
      this.role = 'host'
      this.connectedToPeer = true
      this.emitter.emit('connectionToRemotePeer')
      this.intervalID = setInterval(this.sendStateToPeer, this.mpTickInterval)
      this.setPlayer1Active()
    })
    this.conn.on('data', (data) => {
      this.handleMessage(data)
    })
    this.conn.on('error', (err) => {
      this.connectedToPeer = false
      this.role = null
      console.error(err)
      this.emitter.emit('peerConnectionError')
      clearInterval(this.intervalID)
    })
  }
  keyPress = (evt) => {
    if (evt.type === 'keydown') {
      switch (evt.code) {
        case this.gameObjects.player1.upKey:
          this.gameObjects.player1.upKeyPressed = true
          break
        case this.gameObjects.player1.downKey:
          this.gameObjects.player1.downKeyPressed = true
          break
        case this.gameObjects.player2.upKey:
          this.gameObjects.player2.upKeyPressed = true
          break
        case this.gameObjects.player2.downKey:
          this.gameObjects.player2.downKeyPressed = true
          break
        default:
      }
    } else {
      switch (evt.code) {
        case this.gameObjects.player1.upKey:
          this.gameObjects.player1.upKeyPressed = false
          break
        case this.gameObjects.player1.downKey:
          this.gameObjects.player1.downKeyPressed = false
          break
        case this.gameObjects.player2.upKey:
          this.gameObjects.player2.upKeyPressed = false
          break
        case this.gameObjects.player2.downKey:
          this.gameObjects.player2.downKeyPressed = false
          break
        default:
      }
    }
  }
  pauseGame() {
    console.log('game was paused')
    this.isGameActive = false
    this.emitter.emit('gamePaused')
  }
  unpauseGame() {
    console.log('game was unpaused')
    if (!this.isGameActive) {
      this.isGameActive = true
      this.render()
    }
    this.emitter.emit('gameUnpaused')
  }
  randomVel() {
    let num = Math.random() * 0.5 + 0.5
    return Math.random() > 0.49 ? num : num * -1
  }
  increaseBallVel() {
    let modifier = 0.1
    this.gameObjects.ball.velX > 0 ? this.gameObjects.ball.velX = this.gameObjects.ball.velX + modifier : this.gameObjects.ball.velX = this.gameObjects.ball.velX - modifier
    this.gameObjects.ball.velY > 0 ? this.gameObjects.ball.velY = this.gameObjects.ball.velY + modifier : this.gameObjects.ball.velY = this.gameObjects.ball.velY - modifier
  }
  resetGame() {
    if (!this.roundEnded) {
      this.resetScore()
    }
    this.pauseGame()
    this.gameObjects.player1.posX = 0
    this.gameObjects.player1.posY = this.canvas.height / 2
    this.gameObjects.player2.posX = this.canvas.width
    this.gameObjects.player2.posY = this.canvas.height / 2
    this.gameObjects.ball.posX = this.canvas.width / 2
    this.gameObjects.ball.posY = this.canvas.height / 2
    this.gameObjects.ball.velX = this.randomVel()
    this.gameObjects.ball.velY = this.randomVel()
    this.emitter.emit('gameReset')
    this.render()
  }
  resetScore() {
    this.gameObjects.player1.points = 0
    this.gameObjects.player2.points = 0
  }
  ballCollidePlayer1Wall() {
    if ((this.gameObjects.ball.posX - this.gameObjects.ball.radius) - this.gameObjects.ball.velX <= -5) {
      return true
    } else {
      return false
    }
  }
  ballCollidePlayer1Paddle() {
    let ballMinX = (this.gameObjects.ball.posX - this.gameObjects.ball.radius)
    let player1MaxX = this.gameObjects.player1.posX + this.gameObjects.player1.thickness
    if (ballMinX + this.gameObjects.ball.velX <= player1MaxX) {
      let ballMinY = this.gameObjects.ball.posY - this.gameObjects.ball.radius
      let ballMaxY = this.gameObjects.ball.posY + this.gameObjects.ball.radius
      let player1PaddleMinY = this.gameObjects.player1.posY - this.gameObjects.player1.radius
      let player1PaddleMaxY = this.gameObjects.player1.posY + this.gameObjects.player1.radius
      let ballCollideMinY = (player1PaddleMinY <= ballMinY) && (ballMinY <= player1PaddleMaxY)
      let ballCollideMaxY = (player1PaddleMinY <= ballMaxY) && (ballMaxY <= player1PaddleMaxY)
      if (ballCollideMinY || ballCollideMaxY) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }
  ballCollidePlayer2Paddle() {
    let ballMaxX = (this.gameObjects.ball.posX + this.gameObjects.ball.radius)
    let player2MinX = this.gameObjects.player2.posX - this.gameObjects.player2.thickness
    if (ballMaxX + this.gameObjects.ball.velX >= player2MinX) {
      let ballMinY = this.gameObjects.ball.posY - this.gameObjects.ball.radius
      let ballMaxY = this.gameObjects.ball.posY + this.gameObjects.ball.radius
      let player2PaddleMinY = this.gameObjects.player2.posY - this.gameObjects.player2.radius
      let player2PaddleMaxY = this.gameObjects.player2.posY + this.gameObjects.player2.radius
      let ballCollideMinY = (player2PaddleMinY <= ballMinY) && (ballMinY <= player2PaddleMaxY)
      let ballCollideMaxY = (player2PaddleMinY <= ballMaxY) && (ballMaxY <= player2PaddleMaxY)
      if (ballCollideMinY || ballCollideMaxY) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }
  ballCollidePlayer2Wall() {
    if ((this.gameObjects.ball.posX + this.gameObjects.ball.radius) + this.gameObjects.ball.velX >= this.canvas.width) {
      return true
    } else {
      return false
    }
  }
  ballCollideMinBoundary() {
    let ballMinY = this.gameObjects.ball.posY - this.gameObjects.ball.radius
    if (ballMinY + this.gameObjects.ball.velY <= 0) {
      return true
    } else {
      return false
    }
  }
  ballCollideMaxBoundary() {
    let ballMaxY = this.gameObjects.ball.posY + this.gameObjects.ball.radius
    if (ballMaxY + this.gameObjects.ball.velY >= this.canvas.height) {
      return true
    } else {
      return false
    }
  }
  checkIfPlayerScored() {
    if (this.ballCollidePlayer1Wall()) {
      this.gameObjects.player2.points++
      this.emitter.emit('player2Scored')
      this.pauseGame()
      this.roundEnded = true
    }
    if (this.ballCollidePlayer2Wall()) {
      this.gameObjects.player1.points++
      this.emitter.emit('player1Scored')
      this.pauseGame()
      this.roundEnded = true
    }
  }
  checkIfBallBounced() {
    if (this.ballCollidePlayer1Paddle() || this.ballCollidePlayer2Paddle()) {
      this.increaseBallVel()
      this.gameObjects.ball.velX = this.gameObjects.ball.velX * -1
    }
    if (this.ballCollideMinBoundary() || this.ballCollideMaxBoundary()) {
      this.increaseBallVel()
      this.gameObjects.ball.velY = this.gameObjects.ball.velY * -1
    }
  }
  moveBall() {
    this.gameObjects.ball.posX = this.gameObjects.ball.posX + this.gameObjects.ball.velX
    this.gameObjects.ball.posY = this.gameObjects.ball.posY + this.gameObjects.ball.velY
  }
  movePlayers() {
    if (this.gameObjects.player1.upKeyPressed) {
      let player1MinY = this.gameObjects.player1.posY - this.gameObjects.player1.radius
      if (player1MinY - 2 >= 0) {
        this.gameObjects.player1.posY = this.gameObjects.player1.posY - 2
      }
    }
    if (this.gameObjects.player1.downKeyPressed) {
      let player1MaxY = this.gameObjects.player1.posY + this.gameObjects.player1.radius
      if (player1MaxY + 2 <= this.canvas.height) {
        this.gameObjects.player1.posY = this.gameObjects.player1.posY + 2
      }
    }
    if (this.gameObjects.player2.upKeyPressed) {
      let player2MinY = this.gameObjects.player2.posY - this.gameObjects.player2.radius
      if (player2MinY - 2 >= 0) {
        this.gameObjects.player2.posY = this.gameObjects.player2.posY - 2
      }
    }
    if (this.gameObjects.player2.downKeyPressed) {
      let player2MaxY = this.gameObjects.player2.posY + this.gameObjects.player2.radius
      if (player2MaxY + 2 <= this.canvas.height) {
        this.gameObjects.player2.posY = this.gameObjects.player2.posY + 2
      }
    }
  }
  drawPlayer1() {
    this.context.fillStyle = 'black'
    this.context.fillRect(
      this.gameObjects.player1.posX,
      this.gameObjects.player1.posY - this.gameObjects.player1.radius,
      this.gameObjects.player1.thickness,
      this.gameObjects.player1.radius * 2
    )
  }
  drawPlayer2() {
    this.context.fillStyle = 'black'
    this.context.fillRect(
      this.gameObjects.player2.posX,
      this.gameObjects.player2.posY - this.gameObjects.player2.radius,
      this.gameObjects.player2.thickness * -1,
      this.gameObjects.player2.radius * 2
    )
  }
  drawBall() {
    this.context.beginPath()
    this.context.arc(
      this.gameObjects.ball.posX,
      this.gameObjects.ball.posY,
      this.gameObjects.ball.radius,
      0,
      2 * Math.PI
    )
    this.context.stroke()
  }
  sendStateToPeer = () => {
    this.sendMessage({
      player1: this.gameObjects.player1,
      player2: this.gameObjects.player2,
      ball: this.gameObjects.ball,
      active: this.isGameActive
    })
  }
  render() {
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height)
    this.drawPlayer1()
    this.drawPlayer2()
    this.drawBall()
    if (this.isGameActive) {
      if (Date.now() - this.lastTickTime >= this.gameTickRate) {
        this.lastTickTime = Date.now()
        this.checkIfPlayerScored()
        this.checkIfBallBounced()
        this.moveBall()
        this.movePlayers()
      }
      requestAnimationFrame(() => { this.render() })
    }
  }
}

export default NetPong