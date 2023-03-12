const Player = (name, marker) => ({ name, marker });

const gameBoard = (() => {
  // Setup module variables
  let boardState = [];
  let x = [];
  let o = [];
  let currentPlayer;
  let playerOne;
  let playerTwo;

  // Cache DOM
  const board = document.querySelector("#board");
  const tl = document.querySelector("#tl");
  const tm = document.querySelector("#tm");
  const tr = document.querySelector("#tr");
  const ml = document.querySelector("#ml");
  const m = document.querySelector("#m");
  const mr = document.querySelector("#mr");
  const bl = document.querySelector("#bl");
  const bm = document.querySelector("#bm");
  const br = document.querySelector("#br");
  const arrayDOM = [tl, tm, tr, ml, m, mr, bl, bm, br];

  // Event handler
  const _eventHandler = (e) => {
    const event = e.target;
    arrayDOM.forEach((dom) => {
      if (event.id === dom.id && !dom.hasChildNodes()) {
        _updateVariables(event);
        _render(currentPlayer, dom);
        _checkBoardState();
        _switchPlayerMarker();
      }
    });
  };

  // Bind events
  const _bindEvent = () => {
    board.addEventListener("click", _eventHandler);
  };
  // Unbind events
  const _unbindEvents = () => {
    board.removeEventListener("click", _eventHandler);
  };

  // Switch player turn
  const _switchPlayerMarker = () => {
    if (currentPlayer == playerOne) {
      currentPlayer = playerTwo;
    } else {
      currentPlayer = playerOne;
    }
    infoBoard.updateCurrentPlayer(currentPlayer);
  };

  // Update player and boardState variables
  const _updateVariables = (e) => {
    const obj = { marker: currentPlayer.marker, square: e.id };
    boardState.push(obj);
    if (obj.marker == "X") {
      x.push(obj.square);
    } else {
      o.push(obj.square);
    }
  };

  // Check for matching win combinations or tie
  const _checkBoardState = () => {
    const topRow = ["tl", "tm", "tr"];
    const midRow = ["ml", "m", "mr"];
    const botRow = ["bl", "bm", "br"];
    const leftCol = ["tl", "ml", "bl"];
    const midCol = ["tm", "m", "bm"];
    const rightCol = ["tr", "mr", "br"];
    const crossLR = ["tl", "m", "br"];
    const crossRL = ["tr", "m", "bl"];
    const arrayList = [
      topRow,
      midRow,
      botRow,
      leftCol,
      midCol,
      rightCol,
      crossLR,
      crossRL,
    ];

    const matchArrays = (playerArr, arr) =>
      arr.every((i) => playerArr.includes(i));

    arrayList.forEach((arr) => {
      if (matchArrays(x, arr)) {
        _endGame(arr);
        console.log("X wins");
      }
      if (matchArrays(o, arr)) {
        _endGame(arr);
        console.log("O wins");
      }
    });
    if (boardState.length == 9) {
      _endGame();
      console.log("Game tie!");
    }
  };
  // Reset board
  const _resetBoard = () => {
    boardState.length = 0;
    x.length = 0;
    o.length = 0;
    arrayDOM.forEach((dom) => {
      if (dom.hasChildNodes()) {
        const child = dom.firstChild;
        dom.removeChild(child);
        dom.removeAttribute("class", "higlight");
      }
    });
  };

  // Game start
  const startGame = (firstPlayer, secondPlayer) => {
    playerOne = firstPlayer;
    playerTwo = secondPlayer;
    currentPlayer = playerOne;
    infoBoard.updateCurrentPlayer(currentPlayer);
    _resetBoard();
    _bindEvent();
  };

  // Game end
  const _endGame = (arr) => {
    if (arr !== undefined) {
      _render(undefined, undefined, arr);
    }
    _unbindEvents();
  };

  // Render board
  const _render = (currentPlayer, dom, arr) => {
    const renderMarker = function (currentPlayer, dom) {
      const elem = document.createElement("p");
      elem.textContent = currentPlayer.marker;
      dom.appendChild(elem);
    };

    const highlightSquare = function (arr) {
      console.log(`Winning squares: ${arr}`);
      arr.forEach((i) => {
        const id = i;
        const elem = document.getElementById(id);
        elem.setAttribute("class", "highlight");
      });
    };

    if (currentPlayer !== undefined && dom !== undefined) {
      renderMarker(currentPlayer, dom);
    }
    if (arr !== undefined) {
      highlightSquare(arr);
    }
  };

  return { startGame };
})();

const infoBoard = (() => {
  // Setup module variables
  let playerOne;
  let playerTwo;

  //Cache DOM
  const btn = document.getElementById("start-btn");
  const playerOneDom = document.getElementById("player-one");
  const playerTwoDom = document.getElementById("player-two");
  const currentPlayerDom = document.getElementById("current-player");

  // Bind button event
  const _bindBtn = () => {
    btn.addEventListener("click", _startGame);
  };

  // Start game signal
  const _startGame = () => {
    gameBoard.startGame(playerOne, playerTwo);
  };

  // Setup players
  const setUpPlayers = (firstPlayer, secondPlayer) => {
    playerOne = firstPlayer;
    playerTwo = secondPlayer;
    _updatePlayerNames(playerOne, playerTwo);
  };

  // Update player names
  const _updatePlayerNames = (playerOne, playerTwo) => {
    playerOneDom.textContent = `Player 1: ${playerOne.name} (${playerOne.marker})`;
    playerTwoDom.textContent = `Player 2: ${playerTwo.name} (${playerTwo.marker})`;
  };

  // Update current player
  const updateCurrentPlayer = (currentPlayer) => {
    currentPlayerDom.textContent = `Current player: ${currentPlayer.name}`;
  };

  _bindBtn();
  return { setUpPlayers, updateCurrentPlayer };
})();

const playerOne = Player("Bob", "X");
const playerTwo = Player("Cat", "O");

infoBoard.setUpPlayers(playerOne, playerTwo);
