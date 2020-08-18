import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className={"square" + (props.winner ? " square-won" : "")} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.num_rows = 3;
        this.num_cols = 3;
    }

    renderSquare(i, winner) {
        return (
            <Square
                winner={winner}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        )
    }

    render() {
        const board = [];
        for (let i = 0; i < this.num_rows; i++) {
            const row = [];
            for (let j = 0; j < this.num_cols; j++) {
                const index = this.num_cols * i + j;
                const winner = this.props.winningSquares.includes(index);
                row.push(this.renderSquare(index, winner))
            }
            board.push(<div className="board-row">
                {row}
            </div>)
        }
        return <div>{board}</div>;
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            ascMoves: true,
        };
    }

    handleSort() {
        this.setState(
            {
                ascMoves: !this.state.ascMoves,
            }
        )
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const winner = this.calculateWinner(squares)[0];
        if (winner || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const [winner, winningSquares] = this.calculateWinner(current.squares);

        let moves = this.buildMovesList(history);

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else if (this.isDraw(current.squares)) {
            status = 'You tied!';
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        const sort = 'Sort ' + (this.state.ascMoves ? 'Descending' : 'Ascending');

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        winningSquares={winningSquares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                    <button onClick={() => this.handleSort()}>{sort}</button>
                </div>
            </div>
        )
    }

    buildMovesList(history) {
        const moves = history.map((step, move) => {
            let loc = '';
            if (move) {
                const prev = history[move - 1].squares;
                const curr = history[move].squares;
                for (let i = 0; i < curr.length; i++) {
                    if (curr[i] !== prev[i]) {
                        loc = ' (' + i % 3 + ', ' + Math.floor(i / 3) + ')';
                    }
                }
            }
            const desc = move ?
                'Go to move #' + move + loc :
                'Go to game start';
            return (
                <li key={move}>
                    <button
                        className={move === this.state.stepNumber ? "current-step" : ""}
                        onClick={() => this.jumpTo(move)}
                    >
                        {desc}
                    </button>
                </li>
            )
        });
        return this.state.ascMoves ? moves : moves.reverse();
    }

    calculateWinner(squares) {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return [squares[a], lines[i]];
            }
        }
        return [null, []];
    }

    isDraw(squares) {
        return squares.every(v => v !== null);
    }
}

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);
