const Player = (name, marker) => ({ name, marker });

const gameBoard = (() => {
  let boardState = [];
  let x = [];
  let o = [];
  let playerOneName;
  let playerOneMarker;
  let playerTwoName;
  let playerTwoMarker;
  let currentPlayerMarker;

  // Setup player variables
  const setUpPlayers = (playerOne, playerTwo) => {
    playerOneName = playerOne.name;
    playerOneMarker = playerOne.marker;
    playerTwoName = playerTwo.name;
    playerTwoMarker = playerTwo.marker;
    _switchPlayerMarker();
  };

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
        _render(currentPlayerMarker, dom);
        _checkWinCondition();
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
    if (currentPlayerMarker == playerOneMarker) {
      currentPlayerMarker = playerTwoMarker;
    } else {
      currentPlayerMarker = playerOneMarker;
    }
  };

  // Update player and boardState variables
  const _updateVariables = (e) => {
    const obj = { marker: currentPlayerMarker, square: e.id };
    boardState.push(obj);
    if (obj.marker == "x") {
      x.push(obj.square);
    } else {
      o.push(obj.square);
    }
  };

  // Check win combination
  const _checkWinCondition = () => {
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
      }
      if (matchArrays(o, arr)) {
        _endGame(arr);
      }
    });
  };

  // Game start
  const startGame = () => {
    _bindEvent();
  };

  // Game end
  const _endGame = (arr) => {
    _render(undefined, undefined, arr);
    console.log("Game end!");
    _unbindEvents();
  };

  // Render board
  const _render = (currentPlayerMarker, dom, arr) => {
    const renderMarker = function (currentPlayerMarker, dom) {
      const elem = document.createElement("p");
      elem.textContent = currentPlayerMarker;
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

    if (currentPlayerMarker !== undefined && dom !== undefined) {
      renderMarker(currentPlayerMarker, dom);
    }
    if (arr !== undefined) {
      highlightSquare(arr);
    }
  };
  return { setUpPlayers, startGame };
})();

const playerOne = Player("bob", "x");
const playerTwo = Player("cat", "o");

gameBoard.setUpPlayers(playerOne, playerTwo);
gameBoard.startGame();
