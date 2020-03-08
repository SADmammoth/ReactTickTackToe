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
      xIsCurrent: true,
      gameEnd: {
        result: false
      } /* { result: true|false|"Draw", 
        wonIndexes: [<indexes of won sequence>], 
        wonDirection: 0..4} */,
      history: [],
      currentStep: 0, // Index of element in history, represents current board state
      wins: { X: 0, O: 0 },
      init: true //Should show board creation modal or not
    };
  }

  componentDidMount() {
    let history = JSON.parse(localStorage.getItem("history"));

    //*If history is empty then load only wins count
    if (history == null || history.length <= 1) {
      this.setState({
        wins: JSON.parse(localStorage.getItem("wins"))
      });
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
      xIsCurrent: JSON.parse(localStorage.getItem("xIsCurrent")),
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
    localStorage.setItem("xIsCurrent", JSON.stringify(this.state.xIsCurrent));
    localStorage.setItem(
      "size",
      JSON.stringify({ width: this.state.width, height: this.state.height })
    );
  }

  checkWinner = (squares, width, height) => {
    let wonIndexes = [];
    let wonDirection = "";

    //*Checks for won horizontal sequences
    function checkX(squares) {
      let count = 0;
      for (let i = 0; i < squares.length; i += width) {
        for (let j = 0; j < width; j++) {
          if (!squares[i] || squares[i] !== squares[i + j]) {
            wonIndexes = [];
            break;
          } else {
            wonIndexes.push(i + j);
            count++;
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

    //*Checks for won vertical sequences
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

    /*
     * Checks for won sequences like:
     *    +--
     *    -+-
     *    --+
     */
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

    /*
     * Checks for won sequences like:
     *    --+
     *    -+-
     *    +--
     */
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

    //*If no empty squares on board and no won sequences then draw
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
    let history = [...this.state.history];

    //*Clean history after current history step on turn
    if (this.state.currentStep < history.length - 1) {
      history = history.slice(0, this.state.currentStep + 1);
    }

    let gameEnd = this.checkWinner(squares, width, height);
    let wins = Object.assign({}, this.state.wins);
    if (gameEnd.result) wins[this.state.xIsCurrent ? "X" : "O"]++;

    this.setState({
      xIsCurrent: !this.state.xIsCurrent,
      history: [...history, [...squares]],
      gameEnd: gameEnd,
      currentStep: this.state.currentStep + 1,
      wins: wins
    });
  };

  jumpTo(i) {
    let gameEnd = Object.assign({}, this.state.gameEnd);
    let wins = Object.assign({}, this.state.wins);

    //*If current history step is before win, then is no win
    if (this.state.gameEnd.result && i < this.state.history.length - 1) {
      gameEnd.result = false;
      wins[this.state.xIsCurrent ? "O" : "X"]--;
    } else {
      gameEnd = this.checkWinner(
        this.state.history[i],
        this.state.width,
        this.state.height
      );
      if (gameEnd.result) {
        wins[this.state.xIsCurrent ? "X" : "O"]++;
      }
    }

    this.setState({
      currentStep: i,
      xIsCurrent: i % 2 === 0,
      gameEnd: gameEnd,
      wins: wins
    });
  }

  resetTo(i) {
    let history = [...this.state.history];
    let gameEnd = Object.assign({}, this.state.gameEnd);
    let wins = Object.assign({}, this.state.wins);

    //*If current history step is before win, then is no win
    if (this.state.gameEnd.result && i < this.state.history.length - 1) {
      gameEnd.result = false;
      if (i != 0) {
        wins[this.state.xIsCurrent ? "O" : "X"]--;
      }
    } else {
      gameEnd = this.checkWinner(
        this.state.history[i],
        this.state.width,
        this.state.height
      );
      if (gameEnd.result) {
        wins[this.state.xIsCurrent ? "X" : "O"]++;
      }
    }

    this.setState({
      currentStep: i,
      xIsCurrent: i % 2 === 0,
      history: history.slice(0, i + 1),
      gameEnd: gameEnd,
      wins: wins
    });
  }

  logTurns() {
    //* Mini-component for history button
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
        {!reset || (
          <button className="button_reset" onClick={() => this.resetTo(move)}>
            {reset}
          </button>
        )}
      </li>
    );

    let moves = this.state.history.map((step, move, arr) => {
      if (move == 0) {
        return btn(0, "Go to start", "New game");
      } else if (arr.length - 1 == move && this.state.gameEnd.result) {
        return btn(move, "Game end");
      } else {
        return btn(move, "Go to move #" + move, "Reset");
      }
    });

    return moves;
  }

  render() {
    let status = "";
    if (this.state.gameEnd.result == "Draw") {
      status = "Draw";
    } else if (this.state.gameEnd.result) {
      status = (this.state.xIsCurrent ? "O" : "X") + " won";
    } else {
      status = "Current player: " + (this.state.xIsCurrent ? "X" : "O");
    }

    return (
      <div className="game">
        {/*IF*/
        this.state.init ? (
          <BoardCreator
            inputs={[
              {
                description: "Width",
                type: "number",
                name: "width",
                attributes: { min: 3, max: 10 },
                required: true
              },
              {
                description: "Height",
                type: "number",
                name: "height",
                attributes: { min: 3, max: 10 },
                required: true
              }
            ]}
            id={shortid.generate()}
            open={true}
            onSubmit={data =>
              this.setState({
                width: parseInt(data.width),
                height: parseInt(data.height),
                history: [
                  Array(parseInt(data.width) * parseInt(data.height)).fill(null)
                ],
                init: false
              })
            }
          />
        ) : (
          /*ELSE*/ <>
            <div className="game-board">
              <Board
                squares={this.state.history[this.state.currentStep]}
                xIsCurrent={this.state.xIsCurrent}
                gameEnd={this.state.gameEnd}
                makeTurn={this.makeTurn}
                width={this.state.width}
                height={this.state.height}
                currentStep={this.state.currentStep}
              />
            </div>

            <div className="game-info">
              <div className="win-log">
                <div>X wins: {this.state.wins.X}</div>
                <div>O wins: {this.state.wins.O}</div>
              </div>
              <div className="status">{status}</div>
              <ol className="turns-log">{this.logTurns()}</ol>
            </div>
          </>
        )}
      </div>
    );
  }
}

export default Game;
