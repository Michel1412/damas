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

game.addObserver(function (game) {sockets.emit('updateGame', game)})

sockets.on('connection', (socket) => {
    const player = socket.id;
    console.log(`Player: ${player}`);

    if (listPlayers.length === 2) {
        socket.disconnect(true);
    } else {
        console.log(`Jogador: ${player} logado`);

        listPlayers.push(socket);
        game.setPlayer(player);
    }
    if (listPlayers.length === 2) {
        for (const socket of listPlayers) {
            socket.emit('updateGame', game);
        }
    }

    socket.on("my-event", (param) => {
        console.log(param.click);
        game.selectRock(param.click, socket.id);
    });

    socket.on('disconnect', (socket) => {
        console.log(`Jogador: ${player} Desconectado`);
        delete listPlayers[socket]
    })
})

server.listen(3000, () => {
    console.log(`Server started on port 3000!`);
});


