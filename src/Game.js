import React from "react";
import Board from "./components/Board";

class Game extends React.Component {
  constructor(state) {
    super(state);
    this.state = {
      xIsNext: true,
      gameEnd: false,
      history: [Array(7).fill(null)]
    };
  }

  checkWinner = (squares, height, width) => {
    function checkY(squares) {
      let count = 0;
      for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
          if (!squares[i] || squares[i] !== squares[i + width * j]) {
            break;
          } else {
            count++;
          }
        }
        if (count === height) {
          return true;
        } else {
          count = 0;
        }
      }
      return false;
    }

    function checkX(squares) {
      let count = 0;
      let j = 0;
      for (let i = 0; i < squares.length; i += width) {
        for (let j = i; j < width; j++) {
          if (!squares[i] || squares[i] !== squares[j]) {
            break;
          } else {
            count++;
          }
        }
        if (count === width) {
          return true;
        } else {
          count = 0;
        }
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
          }
        }
        if (count === Math.min(width, height)) {
          return true;
        } else {
          count = 0;
        }
      }
      return false;
    }

    function checkDiagNeg(squares) {
      let count = 1;
      for (let i = width - 1; i >= 0; i--) {
        for (let j = 1; i < squares.length; j++) {
          if (!squares[i] || squares[i] !== squares[i + width * j - j]) {
            break;
          } else {
            count++;
          }
        }
        if (count === Math.min(width, height)) {
          return true;
        } else {
          count = 0;
        }
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

  makeTurn = squares => {
    this.setState({
      xIsNext: !this.state.xIsNext,
      history: [...this.state.history, [...squares]],
      gameEnd: this.checkWinner(squares, 3, 3)
    });
  };

  render() {
    console.log(this.state.history);
    const status = this.state.gameEnd
      ? (this.state.xIsNext ? "O" : "X") + " won"
      : "Current player: " + (this.state.xIsNext ? "X" : "O");

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={this.state.history[this.state.history.length - 1]}
            xIsNext={this.state.xIsNext}
            gameEnd={this.state.gameEnd}
            makeTurn={this.makeTurn}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

export default Game;
