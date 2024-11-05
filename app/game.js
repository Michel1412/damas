export function createGame() {
    const state = {
        observers: [],
        rocks: [
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
        isRedTurns: true,
        secondPlayer: null,
        selectedRock: null,
        targets: []
    }

    function selectRock(command, player) {
        console.log(`Movendo pedra: { x: ${command.x}, y: ${command.y} } => ${player}`);

        console.log(`Observers: ${state.observers.length}`);
        return;

        const rock = state.rocks.find(rock => rock.x === command.x && rock.y === command.y);

        console.log(rock);

        if (!rock) {
            console.log('No rock found for this game.');
            return;
        }

        if (!state.selectedRock) {
            state.selectedRock = rock;
            state.targets = _findTargets(rock);
        } else {

        }

        console.log(state);
        notifyAll(this);
    }

    function setPlayer(player) {
        if (!state.player) {
            state.player = player;
        } else {
            state.secondPlayer = player;
            // notifyAll(this);
        }
    }

    function addObserver(func) {
        state.observers.push(func);
    }

    function notifyAll(game){
        console.log(`Notificando Alteração no Jogo para ${state.observers.length} observers`);

        for (const func of state.observers) {
            func(game);
        }
    }

    function _findTargets(selectedRock) {
        let killOpts = state.rocks.filter(rock => rock.team !== selectedRock.team)
        let targets = [];


        for (const opt in normalMov(selectedRock.team)) {
            let target = {
                x: (selectedRock.x + opt.x),
                y: (selectedRock.y + opt.y)
            };

            let kill = killOpts.find(op => op.x === target.x && op.y === target.y);

            if (kill) {
                let nextStep= {
                    x: target.x + opt.x,
                    y: target.y + opt.y
                }

                if (isValidPlace(nextStep)) {
                    nextStep.backgroud = 'yellow';
                    targets.push(nextStep);
                    target.backgroud = 'red';
                    targets.push(target);
                }
            } else if (isValidPlace(target)) {
                target.backgroud = 'yellow';
                targets.push(target);
            }
        }

        return targets;
    }

    function normalMov(team){
        if (team === 'red') {
            return [
                { x: 1, y: 1 },
                { x: -1, y: 1 }
            ];
        }

        if (team === 'black') {
            return [
                { x: -1, y: -1 },
                { x: 1, y: -1 }
            ];
        }

        return [
            { x: -1, y: -1 },
            { x: 1, y: -1 },
            { x: 1, y: 1 },
            { x: -1, y: 1 },
        ];
    }

    function isValidPlace(place) {
        return !(place.x < 0 || place.y < 0 || place.x > 7 || place.y > 7);
    }

    return {
        state,
        setPlayer,
        addObserver,
        notifyAll,
        selectRock
    };
}