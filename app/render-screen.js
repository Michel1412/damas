export class Board {
    canvas = null;
    ctx = null;
    gap = null;
    selectedSpace = null;

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.gap = canvas.width/8;
    }

    renderBoard(command) {
        console.log('Render board');
        this._defaultBackground();
        this._renderRocks(command.rocks);
    }

    selectSpace = (command) => {
        if (this.selectedSpace) {
            this._defaultBackground();
            this.selectedSpace = null;
            return
        }

        this._paintSpace(command);
        this.selectedSpace = command;
    }

    _paintSpace(command) {
        this.ctx.fillStyle = 'green';
        this.ctx.fillRect(this._handleSize(command.x), this._handleSize(command.y), this._handleSize(1), this._handleSize(1));
    }

    _renderRocks(rocks) {
        for (const rock of rocks) {
            this._drawRoundedRect(
                rock.x,
                rock.y,
                (this.gap * .4),
                rock.team
            );
        }
    }

    _defaultBackground = function () {
        for (let line = 0; line < 8; line++) {
            for (let column = 0; column < 8; column++) {
                this.ctx.fillStyle = (line + column)%2 === 0 ? 'black' : 'white';
                this.ctx.fillRect(this._handleSize(line), this._handleSize(column), this._handleSize(1), this._handleSize(1));
            }
        }
    }

    _drawRoundedRect(x, y, radius, color) {
        this.ctx.beginPath();
        this.ctx.arc(this._handleSize(x + .5), this._handleSize(y + .5), radius, 0, Math.PI * 2);
        this.ctx.closePath();

        // Preenche o retângulo arredondado
        this.ctx.fillStyle = color;
        this.ctx.fill();

        // Desenha a borda arredondada
        this.ctx.lineWidth = 15;
        this.ctx.strokeStyle = 'gray';
        this.ctx.stroke();
    }

    _handleSize = function (number) {
        return (number * this.gap);
    }

}
