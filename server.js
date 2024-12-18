import express from 'express';
import http from 'http';
import {Server} from 'socket.io';
import {createGame} from "./app/game.js";

const app = express();
const server = http.createServer(app);
const sockets = new Server(server);

app.use(express.static('app'));

let listGames = [];
let playerWaiting = null;

sockets.on('connection', (socket) => {
    console.log(`Jogador conectado: ${socket.id}`);

    socket.on('playerName', (playerName) => {
        socket.playerName = playerName;
        console.log(`Jogador ${socket.id} escolheu o nome ${playerName}`);

        if (!playerWaiting) {
            console.log(`Jogador: ${playerName} entrou na fila de espera!`);
            playerWaiting = socket;
        } else {
            // Iniciar um novo jogo
            const game = createGame();

            // Definir jogadores
            game.setPlayer(playerWaiting.id, playerWaiting.playerName, 'red');
            game.setPlayer(socket.id, playerName, 'black');

            const playersSockets = {secondPlayer: socket, firsPlayer: playerWaiting};

            // Adicionar um observador para notificar ambos os jogadores
            game.addObserver(function (gameState) {
                console.log(`Atualizando Jogo do player: ${playersSockets.firsPlayer.id}`)
                playersSockets.firsPlayer.emit('updateGame', gameState);

                console.log(`Atualizando Jogo do player: ${playersSockets.secondPlayer.id}`)
                playersSockets.secondPlayer.emit('updateGame', gameState);
            });

            game.addObserver(function (endGame) {
                console.log(`Finalizando Jogo para o player: ${playersSockets.firsPlayer.id}`)
                playersSockets.firsPlayer.emit('endGame', endGame);

                console.log(`Finalizando Jogo para o player: ${playersSockets.secondPlayer.id}`)
                playersSockets.secondPlayer.emit('endGame', endGame);
            });

            // Enviar evento 'startGame' para ambos os jogadores
            if (playerWaiting) playerWaiting.emit('startGame', game);
            socket.emit('startGame', game);

            console.log(`Jogador: ${playerName} (${socket.id}) encontrou partida com o jogador: ${playerWaiting.playerName} (${playerWaiting.id})`);

            // Resetar o jogador que está esperando
            playerWaiting = null;

            // Adicionar o jogo à lista
            listGames.push({game: game, playersSockets: playersSockets});
        }
    });

    socket.on("selectPlace", (param) => {
        console.log(param.click);

        // Encontrar o jogo em que o jogador está
        const game = listGames.find(game => game.game.hasPlayer(socket.id));
        if (game) {
            game.game.selectRock(param.click, socket.id);
        } else {
            console.log('Nenhum jogo encontrado para este jogador.');
        }
    });

    socket.on('disconnect', () => {
        console.log(`Jogador desconectado: ${socket.id}`);

        // Remover o jogador da fila de espera, se necessário
        if (playerWaiting && playerWaiting.id === socket.id) {
            playerWaiting = null;
        }

        // Remover o jogador do jogo ativo
        listGames = listGames.filter(game => {
            if (game.game.hasPlayer(socket.id)) {
                game.game.notifyAll = () => {}; // Parar de notificar este jogo
                return false;
            }
            return true;
        });
    });
});

server.listen(3000, () => {
    console.log(`Server started on port 3000!`);
});


