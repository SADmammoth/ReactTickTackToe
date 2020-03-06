import React from "react";
import propTypes, { string } from "prop-types";
import Square from "./Square";

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={this.props.gameEnd ? () => {} : () => this.handleClick(i)}
      />
    );
  }

  handleClick = i => {
    const squares = [...this.props.squares];
    squares[i] = this.props.xIsNext ? "X" : "O";
    console.log(squares);
    this.props.makeTurn(squares);
  };

  render() {
    return (
      <div>
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

Board.propTypes = {
  squares: propTypes.arrayOf(propTypes.string),
  xIsNext: propTypes.bool,
  gameEnd: propTypes.bool,
  makeTurn: propTypes.func
};

export default Board;
