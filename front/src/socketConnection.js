//import ngrok from './ngrok'
const io = require("socket.io-client");
const socket = io.connect("http://192.168.1.13:3000")
//const socket = io.connect(`${ngrok}`)

export default socket