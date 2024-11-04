export function createGame() {
    const observers = [];

    const state = {
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

    function _selectRock(command) {
        console.log(`Movendo pedra: ${command}`);

        const selectedRock = state.rocks.find(rock => rock.x === command.x && rock.y === command.y);

        if (!selectedRock) {
            console.log('No rock found for this game.');
            return;
        }

        if (!state.selectedRock) {
            state.selectedRock = selectedRock;
            state.targets = _findTargets(selectedRock);
            notifyAll(this);
            return;
        }

        const target = state.targets.find(target => target.x === command.x && target.y === command.y);

    }

    function setPlayer(player) {
        if (!state.player) {
            state.player = player;
        } else {
            state.secundPlayer = player;
            notifyAll(this);
        }
    }

    function addObserver(func) {
        observers.push(func);
    }

    function notifyAll(game){
        for (const func of observers) {
            func(game);
        }
    }

    function startListenner(canvas) {
        const gap = canvas.width/8;

        canvas.addEventListener('click', (event) => {
            let position = {
                x: Math.floor(event.offsetX/gap),
                y: Math.floor(event.offsetY/gap)
            };

            _selectRock(position);
        });
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
        startListenner
    };
}