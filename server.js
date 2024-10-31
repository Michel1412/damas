import express from 'express';
import http from 'http';
import {Server} from 'socket.io';
import {Game} from "./app/game.js";

const app = express();
const server = http.createServer(app);
const sockets = new Server(server);

app.use(express.static('app'));

let listGames = [];
let playerWaiting;

sockets.on('connection', (socket) => {
    const player = socket.id;
    // console.log(`Player: ${player}`);

    if (!playerWaiting) {
        console.log(`Jogador: ${player}, entrou na fila de espera!`);
        const game = new Game(player);

        listGames.push(game);
        playerWaiting = player;
    } else {
        console.log(`ListGame: ${listGames}\nTamanho: ${listGames.length}`);

        const wGame = listGames[listGames.length - 1];

        if (!wGame) {
            console.log("Não foi achado um Game para se unir");
            return;
        }

        wGame.setSecundPlayer(player);
        console.log(wGame);
        console.log(`Player: ${player} achou uma partida com o player: ${wGame.state.player}`);

        playerWaiting = null;
        sockets.emit('startGame', wGame);
    }

    console.log(listGames);
})

server.listen(3000, () => {
    console.log(`Server started on port 3000!`);
});
