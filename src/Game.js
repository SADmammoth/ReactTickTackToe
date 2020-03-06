import React from "react";
import Board from "./components/Board";
import BoardCreator from "./components/BoardCreator";
import shortid from "shortid";

class Game extends React.Component {
  constructor(state) {
    super(state);
    this.state = {
      width: 0,
      height: 0,
      xIsNext: true,
      gameEnd: false,
      history: [],
      currentStep: -1,
      wins: { X: 0, O: 0 },
      init: true
    };
  }

  componentDidMount() {
    let history = JSON.parse(localStorage.getItem("history"));
    if (history == null || history.length == 1) {
      return;
    }
    let size = JSON.parse(
      localStorage.getItem(
        "size",
        JSON.stringify({ width: this.state.width, height: this.state.height })
      )
    );
    let currentStep = JSON.parse(localStorage.getItem("currentStep"));

    this.setState({
      history: history,
      currentStep: currentStep,
      xIsNext: JSON.parse(localStorage.getItem("xIsNext")),
      width: size.width,
      height: size.height,
      gameEnd: this.checkWinner(history[currentStep], size.width, size.height),
      wins: JSON.parse(localStorage.getItem("wins")),
      init: false
    });
  }

  componentDidUpdate() {
    localStorage.setItem("wins", JSON.stringify(this.state.wins));
    localStorage.setItem("history", JSON.stringify(this.state.history));
    localStorage.setItem("currentStep", JSON.stringify(this.state.currentStep));
    localStorage.setItem("xIsNext", JSON.stringify(this.state.xIsNext));
    localStorage.setItem(
      "size",
      JSON.stringify({ width: this.state.width, height: this.state.height })
    );
  }

  checkWinner = (squares, width, height) => {
    let wonIndexes = [];
    let wonDirection = "";

    function checkX(squares) {
      let count = 0;
      for (let i = 0; i < squares.length; i += width) {
        console.log("ds");
        for (let j = 0; j < width; j++) {
          console.log(squares[i], i + j);
          if (!squares[i] || squares[i] !== squares[i + j]) {
            wonIndexes = [];
            break;
          } else {
            wonIndexes.push(i + j);
            count++;
            console.log(count);
            if (count === width) {
              wonDirection = 0;
              return true;
            }
          }
        }
        count = 0;
      }
      return false;
    }

    function checkY(squares) {
      let count = 0;
      for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
          if (!squares[i] || squares[i] !== squares[i + width * j]) {
            wonIndexes = [];
            break;
          } else {
            wonIndexes.push(i + width * j);
            count++;
            if (count === height) {
              wonDirection = 1;
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
            wonIndexes = [];
            break;
          } else {
            wonIndexes.push(i + width * j + j);
            count++;
            if (count === Math.min(width, height)) {
              wonIndexes.push(i);
              wonDirection = 2;
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
            wonIndexes = [];
            break;
          } else {
            wonIndexes.push(i + width * j - j);
            count++;

            if (count === Math.min(width, height)) {
              wonIndexes.push(i);
              wonDirection = 3;
              return true;
            }
          }
        }
        count = 1;
      }
      return false;
    }

    let checkDraw = squares => squares.filter(el => !el).length == 0;

    return {
      result:
        checkX(squares) ||
        checkY(squares) ||
        checkDiagPos(squares) ||
        checkDiagNeg(squares) ||
        (checkDraw(squares) ? "Draw" : false),
      wonIndexes: wonIndexes,
      wonDirection: wonDirection
    };
  };

  makeTurn = (squares, width, height) => {
    console.log(squares);
    if (this.state.currentStep < 0) {
      this.setState({
        xIsNext: true,
        history: [squares],
        currentStep: 0
      });
      return;
    }
    let history = [...this.state.history];

    if (this.state.currentStep < history.length - 1) {
      history = history.slice(0, this.state.currentStep + 1);
    }
    let gameEnd = this.checkWinner(squares, width, height);
    let wins = Object.assign({}, this.state.wins);

    if (gameEnd.result) wins[this.state.xIsNext ? "X" : "O"]++;
    this.setState({
      xIsNext: !this.state.xIsNext,
      history: [...history, [...squares]],
      gameEnd: gameEnd,
      currentStep: this.state.currentStep + 1,
      wins: wins
    });
  };

  jumpTo(i) {
    let gameEnd = Object.assign({}, this.state.gameEnd);
    let wins = Object.assign({}, this.state.wins);
    if (this.state.gameEnd.result && i < this.state.history.length - 1) {
      gameEnd.result = false;
      wins[this.state.xIsNext ? "O" : "X"]--;
    }
    gameEnd = this.checkWinner(
      this.state.history[i],
      this.state.width,
      this.state.height
    );
    if (gameEnd.result) {
      wins[this.state.xIsNext ? "X" : "O"]++;
    }
    this.setState({
      currentStep: i,
      xIsNext: i % 2 === 0,
      gameEnd: gameEnd,
      wins: wins
    });
  }

  resetTo(i) {
    let history = [...this.state.history];
    let gameEnd = Object.assign({}, this.state.gameEnd);
    let wins = Object.assign({}, this.state.wins);
    if (this.state.gameEnd.result && i < this.state.history.length - 1) {
      gameEnd.result = false;
      if (i != 0) {
        wins[this.state.xIsNext ? "O" : "X"]--;
      }
    }
    gameEnd = this.checkWinner(
      this.state.history[i],
      this.state.width,
      this.state.height
    );
    if (gameEnd.result) {
      wins[this.state.xIsNext ? "X" : "O"]++;
    }
    this.setState({
      currentStep: i,
      xIsNext: i % 2 === 0,
      history: history.slice(0, i + 1),
      gameEnd: gameEnd,
      wins: wins
    });
  }

  logTurns() {
    let btn = (move, desc, reset) => (
      <li key={move}>
        <button
          className={
            this.state.currentStep === move
              ? "button_history_current"
              : "button_history"
          }
          onClick={() => this.jumpTo(move)}
        >
          {desc}
        </button>
        {!reset || <button onClick={() => this.resetTo(move)}>{reset}</button>}
      </li>
    );
    if (this.state.currentStep < 0) {
      return;
    }
    let moves = this.state.history.map((step, move, arr) =>
      move == 0
        ? btn(0, "Go to start", "New game")
        : btn(
            move,
            "Go to move #" + move,
            move == arr.length - 1 ? null : "Reset"
          )
    );
    if (this.state.gameEnd.result) {
      moves.pop();
      moves.push(btn(this.state.history.length - 1, "Game end"));
    }
    return moves;
  }

  render() {
    const status =
      this.state.gameEnd.result !== "Draw"
        ? this.state.gameEnd.result
          ? (this.state.xIsNext ? "O" : "X") + " won"
          : "Current player: " + (this.state.xIsNext ? "X" : "O")
        : "Draw";
    return (
      <div className="game">
        {this.state.init ? (
          <BoardCreator
            inputs={[
              {
                description: "Width",
                type: "number",
                name: "width",
                attributes: { min: 3, max: 10 }
              },
              {
                description: "Height",
                type: "number",
                name: "height",
                attributes: { min: 3, max: 10 }
              }
            ]}
            id={shortid.generate()}
            open={true}
            onSubmit={data =>
              this.setState({
                width: parseInt(data.width),
                height: parseInt(data.height),
                init: false
              })
            }
          />
        ) : (
          <>
            <div className="game-board">
              <Board
                squares={this.state.history[this.state.currentStep]}
                xIsNext={this.state.xIsNext}
                gameEnd={this.state.gameEnd}
                makeTurn={this.makeTurn}
                width={this.state.width}
                height={this.state.height}
                currentStep={this.state.currentStep}
              />
            </div>

            <div className="game-info">
              <div>X wins: {this.state.wins.X}</div>
              <div>O wins: {this.state.wins.O}</div>
              <div>{status}</div>
              <ol>{this.logTurns()}</ol>
            </div>
          </>
        )}
      </div>
    );
  }
}

export default Game;
