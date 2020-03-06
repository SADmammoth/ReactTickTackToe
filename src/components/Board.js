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
    this.props.makeTurn(squares, this.props.width, this.props.height);
  };

  renderSquares() {
    if (this.props.squares) {
      return this.props.squares.map((el, i) => this.renderSquare(i));
    }
  }

  componentDidMount() {
    if (!this.props.squares) {
      this.props.makeTurn(
        Array(this.props.width * this.props.height).fill(null),
        this.props.width,
        this.props.height,
        true
      );
      return;
    }
  }

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
  xIsNext: propTypes.bool,
  gameEnd: propTypes.bool,
  makeTurn: propTypes.func,
  height: propTypes.number,
  width: propTypes.number
};

export default Board;
