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

serviceWorker.unregister();
