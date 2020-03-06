import React from "react";
import Board from "./components/Board";

class Game extends React.Component {
  constructor(state) {
    super(state);
    this.state = {
      width: 4,
      height: 3,
      xIsNext: true,
      gameEnd: false,
      history: [],
      currentStep: -1
    };
  }

  componentDidMount() {
    if (localStorage.getItem("history") == null) {
      return;
    }
    let size = JSON.parse(
      localStorage.getItem(
        "size",
        JSON.stringify({ width: this.state.width, height: this.state.height })
      )
    );
    this.setState({
      history: JSON.parse(localStorage.getItem("history")),
      currentStep: JSON.parse(localStorage.getItem("currentStep")),
      xIsNext: JSON.parse(localStorage.getItem("xIsNext")),
      width: size.width,
      height: size.height
    });
  }

  componentDidUpdate() {
    localStorage.setItem("history", JSON.stringify(this.state.history));
    localStorage.setItem("currentStep", JSON.stringify(this.state.currentStep));
    localStorage.setItem("xIsNext", JSON.stringify(this.state.xIsNext));
    localStorage.setItem(
      "size",
      JSON.stringify({ width: this.state.width, height: this.state.height })
    );
  }

  checkWinner = (squares, width, height) => {
    function checkY(squares) {
      let count = 0;
      for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
          if (!squares[i] || squares[i] !== squares[i + width * j]) {
            break;
          } else {
            count++;
            if (count === height) {
              return true;
            }
          }
        }
        count = 0;
      }
      return false;
    }

    function checkX(squares) {
      let count = 0;
      let j = 0;
      for (let i = 0; i < squares.length - width; i += width) {
        for (let j = 0; j < width; j++) {
          if (!squares[i] || squares[i] !== squares[i + j]) {
            break;
          } else {
            count++;
            if (count === width) {
              return true;
            }
          }
        }
        count = 0;
      }
      return false;
    }

    function checkDiagPos(squares) {
      let count = 1;
      for (let i = 0; i < width; i++) {
        for (let j = 1; i < squares.length; j++) {
          if (!squares[i] || squares[i] !== squares[i + width * j + j]) {
            break;
          } else {
            count++;
            if (count === Math.min(width, height)) {
              return true;
            }
          }
        }
        count = 1;
      }
      return false;
    }

    function checkDiagNeg(squares) {
      let count = 1;
      for (let i = width - 1; i >= 0; i--) {
        for (let j = 1; j < Math.min(width, height); j++) {
          if (!squares[i] || squares[i] !== squares[i + width * j - j]) {
            break;
          } else {
            count++;

            if (count === Math.min(width, height)) {
              return true;
            }
          }
        }
        count = 1;
      }
      return false;
    }

    return (
      checkX(squares) ||
      checkY(squares) ||
      checkDiagPos(squares) ||
      checkDiagNeg(squares)
    );
  };

  makeTurn = (squares, width, height, changePlayer = false) => {
    let history = [...this.state.history];

    if (this.state.currentStep < history.length - 1) {
      history = history.slice(0, this.state.currentStep + 1);
    }
    this.setState({
      xIsNext: changePlayer || !this.state.xIsNext,
      history: [...history, [...squares]],
      gameEnd: this.checkWinner(squares, width, height),
      currentStep: this.state.currentStep + 1
    });
  };

  jumpTo(i) {
    this.setState({ currentStep: i, xIsNext: i % 2 === 0 });
  }

  resetTo(i) {
    let history = [...this.state.history];
    this.setState({
      currentStep: i,
      xIsNext: i % 2 === 0,
      history: history.slice(0, i + 1)
    });
  }

  logTurns() {
    let btn = (move, desc) => (
      <li key={move}>
        <button onClick={() => this.jumpTo(move)}>{desc}</button>
        <button onClick={() => this.resetTo(move)}>{"Reset"}</button>
      </li>
    );
    if (this.state.currentStep < 0) {
      return;
    }
    let moves = this.state.history.map((step, move) =>
      move == 0 ? btn(0, "Go to start") : btn(move, "Go to move #" + move)
    );
    if (this.state.gameEnd) {
      moves.push(btn(this.state.history.length - 1, "Game end"));
    }
    return moves;
  }

  render() {
    const status = this.state.gameEnd
      ? (this.state.xIsNext ? "O" : "X") + " won"
      : "Current player: " + (this.state.xIsNext ? "X" : "O");

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={this.state.history[this.state.currentStep]}
            xIsNext={this.state.xIsNext}
            gameEnd={this.state.gameEnd}
            makeTurn={this.makeTurn}
            width={this.state.width}
            height={this.state.height}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{this.logTurns()}</ol>
        </div>
      </div>
    );
  }
}

export default Game;
