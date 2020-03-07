import React from "react";
import propTypes from "prop-types";

class Square extends React.Component {
  directions = [
    "strikethrough-horizontal",
    "strikethrough-vertical",
    "strikethrough-diag-positive",
    "strikethrough-diag-negative"
  ];

  render() {
    return (
      <button
        className={
          "square " +
          (this.directions[this.props.crossDirection] || "") +
          " " +
          (this.props.className || "")
        }
        onClick={() => this.props.onClick()}
      >
        {this.props.value}
      </button>
    );
  }
}

Square.propTypes = {
  value: propTypes.string,
  onClick: propTypes.func,
  crossDirection: propTypes.number,
  className: propTypes.string
};

export default Square;
