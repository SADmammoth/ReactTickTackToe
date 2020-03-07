import React from "react";
import propTypes, { string } from "prop-types";
import Square from "./Square";

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        crossDirection={
          !this.props.gameEnd.result ||
          !this.props.gameEnd.wonIndexes.includes(i) ||
          this.props.gameEnd.wonDirection
        }
        onClick={
          this.props.gameEnd.result || this.props.squares[i]
            ? () => {}
            : () => this.handleClick(i)
        }
      />
    );
  }

  renderSquares() {
    if (this.props.squares) {
      return this.props.squares.map((el, i) => this.renderSquare(i));
    }
  }

  handleClick = i => {
    const squares = [...this.props.squares];
    squares[i] = this.props.xIsCurrent ? "X" : "O";
    this.props.makeTurn(squares, this.props.width, this.props.height);
  };

  render() {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${this.props.width},1fr)`,
          gridTemplateRows: `repeat(${this.props.height},1fr)`
        }}
      >
        {this.renderSquares()}
      </div>
    );
  }
}

Board.propTypes = {
  squares: propTypes.arrayOf(propTypes.string),
  xIsCurrent: propTypes.bool,
  gameEnd: propTypes.shape({
    result: propTypes.oneOf(propTypes.bool, propTypes.string),
    wonIndexes: propTypes.arrayOf(propTypes.number),
    wonDirection: propTypes.number
  }),
  makeTurn: propTypes.func,
  height: propTypes.number,
  width: propTypes.number
};

export default Board;
