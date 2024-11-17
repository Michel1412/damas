export function createGame() {
    const state = {
        observers: [],
        rocks: [
            // Peças vermelhas
            {id: 'red1', team: 'red', x: 1, y: 0},
            {id: 'red2', team: 'red', x: 3, y: 0},
            {id: 'red3', team: 'red', x: 5, y: 0},
            {id: 'red4', team: 'red', x: 7, y: 0},
            {id: 'red5', team: 'red', x: 0, y: 1},
            {id: 'red6', team: 'red', x: 2, y: 1},
            {id: 'red7', team: 'red', x: 4, y: 1},
            {id: 'red8', team: 'red', x: 6, y: 1},
            {id: 'red9', team: 'red', x: 1, y: 2},
            {id: 'red10', team: 'red', x: 3, y: 2},
            {id: 'red11', team: 'red', x: 5, y: 2},
            {id: 'red12', team: 'red', x: 7, y: 2},
            // Peças pretas
            {id: 'black1', team: 'black', x: 0, y: 5},
            {id: 'black2', team: 'black', x: 2, y: 5},
            {id: 'black3', team: 'black', x: 4, y: 5},
            {id: 'black4', team: 'black', x: 6, y: 5},
            {id: 'black5', team: 'black', x: 1, y: 6},
            {id: 'black6', team: 'black', x: 3, y: 6},
            {id: 'black7', team: 'black', x: 5, y: 6},
            {id: 'black8', team: 'black', x: 7, y: 6},
            {id: 'black9', team: 'black', x: 0, y: 7},
            {id: 'black10', team: 'black', x: 2, y: 7},
            {id: 'black11', team: 'black', x: 4, y: 7},
            {id: 'black12', team: 'black', x: 6, y: 7}
        ],
        player: null,
        secondPlayer: null,
        turn: 'red',
        selectedRock: null,
        targets: [],
        players: {}
    };

    function setPlayer(playerId, playerName, team) {
        state.players[playerId] = {
            name: playerName,
            team: team,
            id: playerId
        };
    }

    function hasPlayer(playerId) {
        return !!state.players[playerId];
    }

    function selectRock(command, playerId) {
        console.log(`Jogador ${playerId} selecionou posição: { x: ${command.x}, y: ${command.y} }`);

        // Verificar se é a vez do jogador
        const player = state.players[playerId];

        if (state.turn !== player.team) {
            console.log('Não é a vez deste jogador.');
            return;
        }

        const rock = state.rocks.find(rock => rock.x === command.x && rock.y === command.y);

        if (!state.selectedRock) {
            if (!rock || rock.team !== player.team) {
                console.log('Você só pode selecionar suas próprias peças.');
                return;
            }
            state.selectedRock = rock;
            state.targets = _findTargets(rock);
        } else {
            const target = state.targets.find(t => t.x === command.x && t.y === command.y);

            if (target) {
                // Atualizar a posição da peça
                state.selectedRock.x = target.x;
                state.selectedRock.y = target.y;

                // Se houver uma peça adversária para capturar
                if (target.capture) {
                    // Remover a peça capturada
                    state.rocks = state.rocks.filter(r => !(r.x === target.capture.x && r.y === target.capture.y));
                }

                // Verificar se pode capturar novamente
                const newCaptures = _findTargets(state.selectedRock, true);
                if (newCaptures.length > 0 && target.capture) {
                    state.targets = newCaptures;
                } else {
                    // Resetar seleção e alternar turno
                    state.selectedRock = null;
                    state.targets = [];
                    state.turn = state.turn === 'red' ? 'black' : 'red';
                }
            } else {
                // Resetar seleção se o jogador clicar em uma posição inválida
                state.selectedRock = null;
                state.targets = [];
            }
        }

        notifyAll(this);
    }

    function addObserver(func) {
        state.observers.push(func);
    }

    function notifyAll(game){
        console.log(`Notificando alteração no jogo para ${state.observers.length} observadores`);

        for (const func of state.observers) {
            func(game);
        }
    }

    function _findTargets(selectedRock, onlyCaptures = false) {
        let targets = [];
        const directions = normalMov(selectedRock.team);

        for (const dir of directions) {
            let targetX = selectedRock.x + dir.x;
            let targetY = selectedRock.y + dir.y;

            // Verificar se a posição está dentro do tabuleiro
            if (!isValidPlace({ x: targetX, y: targetY })) continue;

            // Verificar se há uma peça na posição alvo
            const rockAtTarget = state.rocks.find(r => r.x === targetX && r.y === targetY);

            if (rockAtTarget) {
                // Se a peça é do time adversário, verificar se pode capturar
                if (rockAtTarget.team !== selectedRock.team) {
                    const jumpX = targetX + dir.x;
                    const jumpY = targetY + dir.y;

                    if (isValidPlace({ x: jumpX, y: jumpY }) && !state.rocks.find(r => r.x === jumpX && r.y === jumpY)) {
                        // Pode capturar
                        targets.push({
                            x: jumpX,
                            y: jumpY,
                            background: 'yellow',
                            capture: { x: targetX, y: targetY }
                        });
                    }
                }
            } else if (!onlyCaptures) {
                // Se a posição está vazia e não estamos buscando apenas capturas, pode mover
                targets.push({
                    x: targetX,
                    y: targetY,
                    background: 'yellow'
                });
            }
        }

        return targets;
    }

    function normalMov(team){
        if (team === 'red') {
            return [
                { x: -1, y: 1 },
                { x: 1, y: 1 }
            ];
        }

        if (team === 'black') {
            return [
                { x: -1, y: -1 },
                { x: 1, y: -1 }
            ];
        }

        // Se for uma dama (implementação futura)
        return [
            { x: -1, y: -1 },
            { x: 1, y: -1 },
            { x: 1, y: 1 },
            { x: -1, y: 1 },
        ];
    }

    function isValidPlace(place) {
        return place.x >= 0 && place.y >= 0 && place.x <= 7 && place.y <= 7;
    }

    return {
        state,
        setPlayer,
        hasPlayer,
        addObserver,
        notifyAll,
        selectRock
    };
}
