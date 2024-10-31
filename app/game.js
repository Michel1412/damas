export class Game {

    observers = [];
    state = {};

    constructor(player) {
        this.state = {
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
            player: player,
            isRedTurns: true,
            secundPlayer: null
        };
    }

    setSecundPlayer = (player) => {
        this.state.secundPlayer = player;
    }

    removeRock(command) {
        let id = command.id;
        delete this.state.rocks[id];
    }

    selectRock = (command) => {
        if (this.state.selectedRock) {
            this.state.targets.forEach(target => {
                if (target.x === command.x && target.y === command.y) {
                    this._emitEvent({
                        originId: this.state.selectedRock.id,
                        x: command.x,
                        y: command.y
                    });
                }
            });


        }

        let rock = this.state.rocks.find(rock => (rock.x === command.x) && (rock.y === command.y));

        if (!rock) {
            console.log('No rock found.');
            return;
        }

        if (rock.team !== this.state.player) {
            console.log('Ação Cancelada! vez do outro jogador');
            return;
        }


        this.state.selectedRock = command;
        this.notifyAll();
    }

   addListener = (func) => {
        this.observers.push(func);
   }

   notifyAll = () => {
        for (const func of this.observers) {
            func(this.state);
        }
   }

    _emitEvent = (param) => {
        console.log(`EVENTO -> Movimento do ${this.state.player} { peça: ${param.originId} para: {x: ${param.x}, y: ${param.y}}}`);
    }
}