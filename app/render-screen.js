export function renderScreen() {
    const canvas = document.getElementById('board');
    const ctx = canvas.getContext('2d');
    const gap = canvas.width/8;

    function updateBoard(command){
        _defaultBackground();
        _paintSelected(command.selectedRock);
        _paintTargets(command.targets);
        _renderRocks(command.rocks);
    }

    function _paintSelected(command) {
        if (!command) return;

        ctx.fillStyle = 'green';
        ctx.fillRect(_handleSize(command.x), _handleSize(command.y), _handleSize(1), _handleSize(1));
    }

    function _paintTargets(command) {
        if (!command) return;

        for (const target of command) {
            ctx.fillStyle = target.background;
            ctx.fillRect(_handleSize(target.x), _handleSize(target.y), _handleSize(1), _handleSize(1));
        }
    }

    function _renderRocks(rocks) {
        for (const rock of rocks) {
            _drawRoundedRect(
                rock.x,
                rock.y,
                (gap * .4),
                rock.team
            );
        }
    }

    function _defaultBackground() {
        for (let line = 0; line < 8; line++) {
            for (let column = 0; column < 8; column++) {
                ctx.fillStyle = (line + column)%2 === 0 ? 'black' : 'white';
                ctx.fillRect(_handleSize(line), _handleSize(column), _handleSize(1), _handleSize(1));
            }
        }
    }

    function _drawRoundedRect(x, y, radius, color) {
        ctx.beginPath();
        ctx.arc(_handleSize(x + .5), _handleSize(y + .5), radius, 0, Math.PI * 2);
        ctx.closePath();

        // Preenche o retângulo arredondado
        ctx.fillStyle = color;
        ctx.fill();

        // Desenha a borda arredondada
        ctx.lineWidth = 15;
        ctx.strokeStyle = 'gray';
        ctx.stroke();
    }

    function _handleSize(number) {
        return (number * gap);
    }

    return {
        updateBoard,
        canvas
    };
}