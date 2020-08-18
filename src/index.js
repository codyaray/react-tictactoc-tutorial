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
		for (let i=0; i<3; i++) {
			const row = [];
			for (let j=0; j<3; j++) {
				const index = 3*i+j;
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
		const current = history[history.length-1];
		const squares = current.squares.slice();
		const winner = calculateWinner(squares)[0];
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
		const [winner, winningSquares] = calculateWinner(current.squares);

		let moves = history.map((step, move) => {
			let loc = '';
			if (move) {
				const prev = history[move-1].squares;
				const curr = history[move].squares;
				for (let i=0; i<curr.length; i++) {
					if (curr[i] !== prev[i]) {
						loc = ' (' + i % 3 + ', ' + Math.floor(i / 3) + ')';
					}
				}
			}
			const desc = move ?
				'Go to move #' + move + loc:
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
		if (!this.state.ascMoves) {
			moves = moves.slice().reverse()
		}

		let status;
		if (winner) {
			status = 'Winner: ' + winner;
		} else if (isDraw(current.squares)) {
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
}

function calculateWinner(squares) {
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
	for (let i=0; i<lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return [squares[a], lines[i]];
		}
	}
	return [null, []];
}

function isDraw(squares) {
	return squares.every(v => v !== null);
}

ReactDOM.render(
	<Game />,
	document.getElementById('root')
);
