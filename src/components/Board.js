import React from "react";
import Square from "./Square";

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true
    };
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={this.state.gameEnd ? () => {} : () => this.handleClick(i)}
      />
    );
  }

  handleClick = i => {
    const squares = [...this.state.squares];
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
      gameEnd: this.checkWinner(squares, 3, 3)
    });
  };

  checkWinner(squares, height, width) {
    function checkY(squares) {
      let count = 0;
      for (let i = 0; i < width; i++) {
        console.log(0);
        for (let j = 0; j < height; j++) {
          console.log(i + width * j, squares[i + width * j]);
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
        console.log(11, i);
        for (let j = i; j < width; j++) {
          console.log(j);
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
  }

  render() {
    const status = this.state.gameEnd
      ? (this.state.xIsNext ? "O" : "X") + " won"
      : "Current player: " + (this.state.xIsNext ? "X" : "O");

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

export default Board;
