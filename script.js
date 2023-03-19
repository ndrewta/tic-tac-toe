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
  let gameActive = false;
  let aiActive = false;

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
  const arrayDom = [tl, tm, tr, ml, m, mr, bl, bm, br];

  // Event handler
  const _eventHandler = (e) => {
    const event = e.target;
    arrayDom.forEach((dom) => {
      if (event.id === dom.id && !dom.hasChildNodes()) {
        _updateVariables(event);
        _render(currentPlayer, dom);
        _checkBoardState();
        _switchPlayer();
      }
    });
  };

  // Bind events
  const _bindEvents = () => {
    board.addEventListener("click", _eventHandler);
    board.addEventListener("mousedown", _disableMouseEvent);
  };

  // Unbind events
  const _unbindEvent = () => {
    board.removeEventListener("click", _eventHandler);
  };

  // Disable mouse drag
  const _disableMouseEvent = (e) => {
    e.preventDefault();
  };

  // Switch player turn
  const _switchPlayer = () => {
    if (gameActive) {
      if (currentPlayer == playerOne) {
        currentPlayer = playerTwo;
        infoBoard.updateCurrentPlayer(currentPlayer);
        if (aiActive) {
          _aiMove();
        }
      } else {
        currentPlayer = playerOne;
        infoBoard.updateCurrentPlayer(currentPlayer);
      }
    }
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
    arrayDom.forEach((dom) => {
      if (dom.hasChildNodes()) {
        const child = dom.firstChild;
        dom.removeChild(child);
        dom.removeAttribute("class", "higlight");
      }
    });
  };

  // Game start
  const startGame = (firstPlayer, secondPlayer, firstMove, aiCheck) => {
    playerOne = firstPlayer;
    playerTwo = secondPlayer;
    currentPlayer = firstMove;
    gameActive = true;
    aiActive = aiCheck;
    infoBoard.updateCurrentPlayer(currentPlayer);
    _resetBoard();
    _bindEvents();
    if (currentPlayer == playerTwo && aiActive) {
      _aiMove();
    }
  };

  // Game end
  const _endGame = (arr) => {
    if (arr !== undefined) {
      _render(undefined, undefined, arr);
    }
    gameActive = false;
    _unbindEvent();
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

  // AI logic
  const _aiMove = () => {
    let arrayIndex;
    let clicked = false;

    function generateIndex() {
      let index;
      index = Math.floor(Math.random() * 9);
      arrayIndex = arrayDom[index];
    }

    function click() {
      arrayIndex.click();
      clicked = true;
    }

    function run() {
      while (!clicked) {
        generateIndex();
        if (!arrayIndex.hasChildNodes()) {
          _bindEvents();
          click();
        }
        if (clicked) {
          break;
        }
      }
    }

    _unbindEvent();
    setTimeout(run, 1000);
  };
  return { startGame };
})();

const infoBoard = (() => {
  // Setup module variables
  let playerOne;
  let playerTwo;
  let firstMovePlayer;
  let aiActive;
  let playerOneScore = 0;
  let playerTwoScore = 0;

  //Cache DOM
  const newgameBtn = document.getElementById("newgame-btn");
  const startgameBtn = document.getElementById("startgame-btn");
  const resetBtn = document.getElementById("reset-btn");
  const playerOneDom = document.getElementById("player-one");
  const playerTwoDom = document.getElementById("player-two");
  const formDom = document.querySelector(".form");
  const formElem = document.querySelector("form");
  const announcementDom = document.getElementById("announcement");
  const aiCheckBox = document.getElementById("ai-check");
  const playerTwoInput = document.getElementById("player-two-name");
  const playerOneScoreDom = document.getElementById("player-one-score");
  const playerTwoScoreDom = document.getElementById("player-two-score");

  // Bind events
  const _bindEvents = () => {
    newgameBtn.addEventListener("click", _newGame);
    startgameBtn.addEventListener("click", (e) => _startGame(e));
    resetBtn.addEventListener("click", _resetGame);
    aiCheckBox.addEventListener("click", _checkboxToggle);
  };

  // Checkbox toggle input name
  const _checkboxToggle = () => {
    if (aiCheckBox.checked) {
      playerTwoInput.value = "John [AI]";
      playerTwoInput.disabled = true;
    }
    if (!aiCheckBox.checked) {
      playerTwoInput.value = "";
      playerTwoInput.disabled = false;
    }
  };

  // Submit form and start game
  const _startGame = (e) => {
    playerTwoInput.disabled = false;
    _submitForm(e);
    _resetScores();
    _renderScores();
    _randomFirstPlayer();
    gameBoard.startGame(playerOne, playerTwo, firstMovePlayer, aiActive);
  };

  // New game
  const _newGame = () => {
    _resetInfo();
    _alternateFirstPlayer();
    gameBoard.startGame(playerOne, playerTwo, firstMovePlayer, aiActive);
    if (playerOneScore == 5 || playerTwoScore == 5) {
      _resetScores();
    }
  };

  // Submit form
  const _submitForm = (e) => {
    e.preventDefault();
    const data = new FormData(formElem);
    const playerOneData = data.get("player-one-name");
    const playerTwoData = data.get("player-two-name");
    const aiCheckData = data.get("ai-check");
    const playerOneObj = Player(playerOneData, "X");
    const playerTwoObj = Player(playerTwoData, "O");
    _setUpPlayers(playerOneObj, playerTwoObj, aiCheckData);
    _toggleForm();
    formElem.reset();
  };

  // Setup players
  const _setUpPlayers = (firstPlayer, secondPlayer, aiCheck) => {
    playerOne = firstPlayer;
    playerTwo = secondPlayer;
    aiActive = aiCheck;
    _updatePlayerNames(playerOne, playerTwo);
  };

  // Random first move player
  const _randomFirstPlayer = () => {
    const int = Math.floor(Math.random() * 2);
    if (int === 0) {
      firstMovePlayer = playerOne;
    } else {
      firstMovePlayer = playerTwo;
    }
  };

  // Alternate first move player
  const _alternateFirstPlayer = () => {
    if (firstMovePlayer == playerOne) {
      firstMovePlayer = playerTwo;
    } else {
      firstMovePlayer = playerOne;
    }
  };

  // Reset players
  const _resetGame = () => {
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

  // Display outcome
  const displayOutcome = (winner) => {
    if (winner) {
      announcementDom.textContent = `${winner.name} won this round!`;
      _updateScore(winner);
    } else {
      announcementDom.textContent = "Game tie!";
    }
  };

  // Update scores
  const _updateScore = (winner) => {
    if (winner == playerOne) {
      playerOneScore += 1;
    } else if (winner == playerTwo) {
      playerTwoScore += 1;
    }
    _checkScores();
  };

  // Check overall score
  const _checkScores = () => {
    if (playerOneScore == 5) {
      announcementDom.textContent = `${playerOne.name} is the winner!`;
    } else if (playerTwoScore == 5) {
      announcementDom.textContent = `${playerTwo.name} is the winner!`;
    }
    _renderScores();
  };

  // Render scores
  const _renderScores = () => {
    playerOneScoreDom.textContent = playerOneScore;
    playerTwoScoreDom.textContent = playerTwoScore;
  };

  // Reset scores
  const _resetScores = () => {
    playerOneScore = 0;
    playerTwoScore = 0;

    _renderScores();
  };

  // Reset infoboard
  const _resetInfo = () => {
    announcementDom.textContent = "";
  };

  // Toggle form
  const _toggleForm = () => {
    formDom.classList.toggle("toggle-form");
  };

  _bindEvents();
  return { updateCurrentPlayer, displayOutcome };
})();
