const Player = (name, marker) => ({ name, marker });

const gameBoard = (() => {
  let boardState = [];
  const testMarker = "x";

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
  const arrayDOM = [tl, tm, tr, ml, m, mr, bl, bm, br]

  // Event handler
  const _eventHandler = (e) => {
    const selectedSquare = e.id;
    const marker = testMarker;
    boardState.push({ marker, selectedSquare });
    _render(marker, selectedSquare);
  };

  // Bind events
  board.addEventListener("click", (e) => _eventHandler(e.target));

  // Render board
  const _render = (marker, selectedSquare) => {
    const elem = document.createElement("p");
    elem.textContent = marker;
    arrayDOM.forEach((dom) => {
        if ((selectedSquare == dom.id) && !dom.hasChildNodes()) {
            dom.appendChild(elem)
        }
    })
  };
})();
