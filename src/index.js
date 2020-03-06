import React from "react";
import ReactDOM from "react-dom";

import Game from "./Game";
import * as serviceWorker from "./serviceWorker";

import "jquery";
import "popper.js";
import "bootstrap/js/dist/modal";
import "bootstrap/scss/bootstrap.scss";
import "./scss/Game.scss";

ReactDOM.render(<Game />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
