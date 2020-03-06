import React from "react";
import propTypes from "prop-types";

class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={this.props.onClick}>
        {this.props.value}
      </button>
    );
  }
}

Square.propTypes = {
  value: propTypes.string,
  onClick: propTypes.func
};

export default Square;
