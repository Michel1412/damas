import express from 'express';
import http from 'http';
import {Server} from 'socket.io';
import {createGame} from "./app/game.js";

const app = express();

const server = http.createServer(app);
const sockets = new Server(server);
app.use(express.static('app'));

let listPlayers = [];
const game = createGame();

game.addObserver(() => sockets.emit('updateGame', game))

sockets.on('connection', (socket) => {
    const player = socket.id;
    console.log(`Player: ${player}`);

    if (listPlayers.length === 2) {
        socket.disconnect(true);
    } else {
        console.log(`Jogador: ${player} logado`);

        game.setPlayer(player);
        listPlayers.push(player);
    }
})

server.listen(3000, () => {
    console.log(`Server started on port 3000!`);
});
