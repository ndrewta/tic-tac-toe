const Player = (name, marker) => ({ name, marker });

const gameBoard = (() => {
  // Setup module variables
  let boardState = [];
  let x = [];
  let o = [];
  let tie = true;
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
        _switchPlayerMarker();
        _checkBoardState();
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
        tie = false;
        _endGame(arr);
        infoBoard.displayOutcome(playerOne);
      }
      if (matchArrays(o, arr)) {
        tie = false;
        _endGame(arr);
        infoBoard.displayOutcome(playerTwo);
      }
    });
    if (boardState.length == 9 && tie === true) {
      _endGame();
      infoBoard.displayOutcome();
    }
  };
  // Reset board
  const _resetBoard = () => {
    boardState.length = 0;
    x.length = 0;
    o.length = 0;
    tie = true;
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
  const newgameBtn = document.getElementById("newgame-btn");
  const startgameBtn = document.getElementById("startgame-btn");
  const renameBtn = document.getElementById("rename-btn");
  const playerOneDom = document.getElementById("player-one");
  const playerTwoDom = document.getElementById("player-two");
  const currentPlayerDom = document.getElementById("current-player");
  const outcomeDom = document.getElementById("outcome");
  const formDom = document.querySelector(".form");
  const formElem = document.querySelector("form");
  const announcementDom = document.getElementById("announcement");

  // Bind button event
  const _bindBtn = () => {
    newgameBtn.addEventListener("click", _newGame);
    startgameBtn.addEventListener("click", (e) => _startGame(e));
    renameBtn.addEventListener("click", _renamePlayers);
  };

  // Submit form and start game
  const _startGame = (e) => {
    _submitForm(e);
    _resetInfo();
    gameBoard.startGame(playerOne, playerTwo);
  };

  // New game
  const _newGame = () => {
    _resetInfo();
    gameBoard.startGame(playerOne, playerTwo);
  };

  // Submit form
  const _submitForm = (e) => {
    e.preventDefault();
    const data = new FormData(formElem);
    const playerOneData = data.get("player-one-name");
    const playerTwoData = data.get("player-two-name");
    const playerOneObj = Player(playerOneData, "X");
    const playerTwoObj = Player(playerTwoData, "O");
    _setUpPlayers(playerOneObj, playerTwoObj);
    _toggleForm();
    formElem.reset();
  };

  // Setup players
  const _setUpPlayers = (firstPlayer, secondPlayer) => {
    playerOne = firstPlayer;
    playerTwo = secondPlayer;
    _updatePlayerNames(playerOne, playerTwo);
  };

  // Rename players
  const _renamePlayers = () => {
    _resetInfo();
    _toggleForm();
    announcementDom.textContent = "Tic Tac Toe";
  };

  // Update player names
  const _updatePlayerNames = (playerOne, playerTwo) => {
    playerOneDom.textContent = `Player 1: ${playerOne.name}`;
    playerTwoDom.textContent = `Player 2: ${playerTwo.name}`;
  };

  // Update current player
  const updateCurrentPlayer = (currentPlayer) => {
    announcementDom.textContent = `${currentPlayer.name}'s turn!`;
  };

  // Display Winner
  const displayOutcome = (winner) => {
    if (winner) {
      announcementDom.textContent = `${winner.name} is the winner!`;
    } else {
      announcementDom.textContent = "Game tie!";
    }
  };

  // Reset infoboard
  const _resetInfo = () => {
    announcementDom.textContent = "";
  };

  // Toggle form
  const _toggleForm = () => {
    formDom.classList.toggle("toggle-form");
  };

  _bindBtn();
  return { updateCurrentPlayer, displayOutcome };
})();
