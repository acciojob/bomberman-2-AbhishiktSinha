const gridContainer = document.querySelector(".grid-container");
let checked = 0;
let flagged = 0;
let bombsFlagged = 0;

updateDisplayFlagCount();
createDefaultGrid();

let lastCheckedCell = undefined;

function createDefaultGrid() {
    for (let r = 0; r < 10; r++) {
        const bombCol = randomTo9();

        for (let c = 0; c < 10; c++) {
            // create a cell
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.id = `${r * 10 + c}`;

            if (c === bombCol) {
                cell.classList.add("bomb");
            } else {
                cell.classList.add("valid");
            }

            gridContainer.appendChild(cell);
        }
    }


    dataOfBombs();

    function randomTo9() {
        return Math.floor(Math.random() * 10);
    }
}

function dataOfBombs() {

    // get all valid cells, and attach data attribute which tells count of nbring bombs
    const cellsList = document.querySelectorAll(".grid-container > .cell.valid");

    /* range of search for bombs for every valid cell 
        if id = 34, grid coordinates: r = 3, c=4
        in general: r = id/10, c = id%10.
    */

    for (let cell of cellsList) {

        const cellId = parseInt(cell.id);

        // defining search range
        const r = Math.floor(cellId / 10);
        const c = Math.floor(cellId % 10);

        // search in range : cols: c-1 to c+1, in row r-1 to r+1
        let bombCount = 0;
        for (let i = r - 1; i <= r + 1; i++) {

            for (let j = c - 1; j <= c + 1; j++) {

                const nbr = document.getElementById(`${i * 10 + j}`);

                // if valid id
                if (nbr) {
                    bombCount += nbr.classList.contains("bomb") ? 1 : 0;
                }
            }
        }

        cell.setAttribute("data", bombCount);
    }

}

gridContainer.addEventListener("click", cellClickEventHandler);
gridContainer.addEventListener("contextmenu", rightClickHandler);

function cellClickEventHandler(event) {

    // if clicked on a cell
    if (event.target.classList.contains("cell")) {
        const cell = event.target;

        if (lastCheckedCell) {
            lastCheckedCell.textContent = '';
            if (lastCheckedCell.classList.contains("flag")) {
                lastCheckedCell.textContent = '🚩';
            }
            lastCheckedCell.classList.remove("highlight");
        }


        // if cell was valid, increase checked count
        if (cell.classList.contains("valid")) {

            if (cell.classList.contains("flag")) {
                cell.classList.remove("flag");
                flagged--;
                updateDisplayFlagCount();
            }

            cell.textContent = `${cell.getAttribute("data")}`;
            cell.classList.add("highlight");

            cell.classList.add("checked");

            increaseChecked();

            checkVictory();

            lastCheckedCell = cell;
        }
        else if (cell.classList.contains("bomb")) {

            cell.textContent = "💣";

            gridContainer.removeEventListener("click", cellClickEventHandler);
            gridContainer.removeEventListener("contextmenu", rightClickHandler);

            displayAll();
            document.getElementById("result").textContent = "YOU LOSE!";
        }
    }
}

function rightClickHandler(event) {

    event.preventDefault();

    // if rightclicked on a cell
    if (event.target.classList.contains("cell")) {
        const cell = event.target;

        // TODO: if already flagged
        if (cell.classList.contains("flag")) {
            cell.classList.remove("flag");
            cell.textContent = '';
            flagged--;
        }
        else if (flagged < 10) {
            cell.textContent = "🚩";
            cell.classList.add("flag");
            flagged++;

            if (cell.classList.contains("bomb")) {
                bombsFlagged++;
                checkVictory();
            }
        }

        updateDisplayFlagCount();
    }
}

function increaseChecked() {
    ++checked;
}
function getScore() {
    return checked;
}
function checkVictory() {
    if (checked === 90) {
        displayAll();
        document.getElementById("result").textContent = "YOU WIN!";
    }
    if (bombsFlagged == 10) {

        displayAll();
        document.getElementById("result").textContent = "YOU WIN!";
    }
}

function displayAll() {

    const allBombs = document.querySelectorAll(".cell.bomb");

    for (let cell of allBombs) {

        cell.textContent = "💣";
        cell.classList.add("checked");
    }
}

function updateDisplayFlagCount() {
    document.getElementById("flagsLeft").textContent = `${10 - flagged}`;
}