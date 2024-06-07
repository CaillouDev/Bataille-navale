const myBoard = document.getElementById("my-board");
const myBoardTbody = myBoard.querySelector("tbody");
const ennemyBoard = document.getElementById("ennemy-board");
const ennemyBoardTbody = ennemyBoard.querySelector("tbody");
const allLinesMyBoard = myBoardTbody.querySelectorAll("tr");
const allLinesEnnemyBoard = ennemyBoardTbody.querySelectorAll("tr");
const myFleet = document.querySelector("#my-fleet");
const gameScreen = document.querySelector("#game-screen");

// --------------------------------------------------------
// Compteur pour déroulement
// --------------------------------------------------------
let w = 0;
sessionStorage.setItem("w", JSON.stringify(w));
// --------------------------------------------------------
// Définir les navires à placer, leur nom, leur longueur
// --------------------------------------------------------

let fleet = [
  { name: "Porte-avions", cases: 5, number: 1 },
  { name: "Croiseur", cases: 4, number: 2 },
  { name: "Contre-torpilleurs", cases: 3, number: 3 },
  { name: "Torpilleur", cases: 2, number: 4 },
];

let shipLength = "no length yet";
let totalShipLength = "";
let currentShipName = "";

// --------------------------------------------------------
// Créer l'interface gauche de l'utilisateur, affichant ses navires à placer ainsi que les boutons liés à chaque navire.
// --------------------------------------------------------

const createFleets = () => {
  const msgBox = document.createElement("p");
  msgBox.id = "msg-box";
  const containerMsgBox = document.createElement("div");
  containerMsgBox.id = "container-msg-box";
  const shipsCards = document.createElement("div");
  shipsCards.id = "card-ships";
  myFleet.insertAdjacentElement("afterbegin", shipsCards);
  containerMsgBox.appendChild(msgBox);
  myFleet.append(containerMsgBox);
  fleet.forEach((element) => {
    let remaigningShipsToPlace = element.number;
    const ship = document.createElement("div");
    ship.id = `card-${element.name}`;
    shipsCards.appendChild(ship);
    const shipName = document.createElement("p");
    shipName.id = `${element.name}-name`;
    shipName.innerText = `${element.name} : ${remaigningShipsToPlace}`;
    const shipAdd = document.createElement("button");
    shipAdd.innerText = "Ajouter";
    shipAdd.id = `add-${element.name}`;
    shipAdd.classList.add("add");
    const shipRemove = document.createElement("button");
    shipRemove.id = `remove-${element.name}`;
    shipRemove.innerText = "Supprimer";
    shipRemove.setAttribute("disabled", true);
    shipRemove.classList.add("delete");
    shipRemove.classList.add("deactivate");
    shipRemove.addEventListener("click", () => {
      if (shipRemove.innerText === "Annuler") {
        shipRemove.innerText = "Supprimer";
        shipRemove.classList.add("deactivate");
        shipRemove.setAttribute("disabled", true);
        const allUncompleteShips = myBoard.querySelectorAll(`.${element.name}`);
        allUncompleteShips.forEach((ship) => {
          ship.removeAttribute("class");
        });
        myBoard.querySelectorAll("td:not(.occupied)").forEach((cell) => {
          if (!cell.classList.contains("deactivated")) {
            cell.classList.add("deactivated");
          }
        });
        msgBox.innerText = "";
        const allShips = myBoard.querySelectorAll(`.full${element.name}`);
        remaigningShipsToPlace =
          element.number - Math.floor(allShips.length / element.cases);
        shipName.innerText = `${element.name} : ${remaigningShipsToPlace}`;
        if (
          shipRemove.classList.contains("deactivate") &&
          remaigningShipsToPlace !== element.number
        ) {
          shipRemove.classList.remove("deactivate");
        }
        if (shipAdd.classList.contains("deactivate")) {
          shipAdd.classList.remove("deactivate");
        }
        myFleet.querySelectorAll(".add").forEach((button) => {
          if (!button.classList.contains("deactivate")) {
            button.removeAttribute("disabled");
          }
        });
        myFleet.querySelectorAll(".delete").forEach((button) => {
          if (!button.classList.contains("deactivate")) {
            button.removeAttribute("disabled");
          }
        });
      } else if (shipRemove.innerText === "Supprimer") {
        remaigningShipsToPlace = element.number;
        shipRemove.setAttribute("disabled", true);
        shipRemove.classList.add("deactivate");
        shipAdd.classList.remove("deactivate");
        shipAdd.removeAttribute("disabled");
        shipName.innerText = `${element.name} : ${remaigningShipsToPlace}`;
        const allShips = myBoard.querySelectorAll(`.full${element.name}`);
        allShips.forEach((ship) => {
          ship.removeAttribute("class");
        });
        myBoard.querySelectorAll("td:not(.occupied)").forEach((cell) => {
          if (!cell.classList.contains("deactivated")) {
            cell.classList.add("deactivated");
          }
        });
      }
    });
    ship.append(shipName, shipAdd, shipRemove);
  });
};

// --------------------------------------------------------
// Fonction exécutée pour chaque cellule
// --------------------------------------------------------

const actionOnCell = (cell) => {
  const w = JSON.parse(sessionStorage.getItem("w"));
  if (cell.classList.contains("deactivated")) {
  } else if (w >= 2) {
    let box = document.getElementById("msg-box");
    if (isNaN(shipLength)) {
    }
    if (totalShipLength === shipLength) {
      cell.classList.add(`occupied`);
      cell.classList.add(`${currentShipName}`);
      cell.classList.add("deactivated");
      shipLength--;
    } else if (shipLength === totalShipLength - 1) {
      const idOfFirstCell = parseInt(
        myBoard.querySelectorAll(`.${currentShipName}`)[0].id
      );
      if (
        parseInt(cell.id) === idOfFirstCell + 1 ||
        parseInt(cell.id) === idOfFirstCell - 1 ||
        parseInt(cell.id) === idOfFirstCell + 10 ||
        parseInt(cell.id) === idOfFirstCell - 10
      ) {
        cell.classList.add(`occupied`);
        cell.classList.add(`${currentShipName}`);
        cell.classList.add("deactivated");
        shipLength--;
      }
    } else if (shipLength === totalShipLength - 2) {
      const idOfSecondCell = parseInt(
        myBoard.querySelectorAll(`.${currentShipName}`)[1].id
      );
      directionOfShip(cell, idOfSecondCell);
    } else if (shipLength === totalShipLength - 3) {
      const idOfThirdCell = parseInt(
        myBoard.querySelectorAll(`.${currentShipName}`)[2].id
      );
      directionOfShip(cell, idOfThirdCell);
    } else if (shipLength === totalShipLength - 4) {
      const idOfFourthCell = parseInt(
        myBoard.querySelectorAll(`.${currentShipName}`)[3].id
      );
      directionOfShip(cell, idOfFourthCell);
    }
    if (shipLength > 1) {
      document.getElementById(
        "msg-box"
      ).innerText = `Il reste ${shipLength} cases à sélectionner pour placer votre navire.`;
    }
    if (shipLength === 1) {
      document.getElementById(
        "msg-box"
      ).innerText = `Il reste ${shipLength} case à sélectionner pour placer votre navire.`;
    }
    if (shipLength === 0) {
      box.innerText = `Vous avez placé votre ${currentShipName.toLowerCase()}.`;
      document.getElementById(`remove-${currentShipName}`).innerText =
        "Supprimer";
      const ships = myBoard.querySelectorAll(`.${currentShipName}`);
      ships.forEach((ship) => {
        ship.classList.add(`full${currentShipName}`);
        ship.classList.remove(`${currentShipName}`);
      });
      const buttons = myFleet.querySelectorAll("button");
      buttons.forEach((button) => {
        if (!button.classList.contains("deactivate")) {
          button.removeAttribute("disabled");
        }
      });
      myBoard
        .querySelectorAll(`.${currentShipName}`)
        .forEach((ship) => ship.classList.remove(`${currentShipName}`));
      cell.classList.add("deactivated");
      shipLength = "no length specified";
      myBoard
        .querySelectorAll("td:not(.occupied")
        .forEach((cell) => cell.classList.add("deactivated"));
      const cellsOccupied = myBoard.querySelectorAll("td.occupied").length;
      if (cellsOccupied === 30) {
        const w = 3;
        sessionStorage.setItem("w", JSON.stringify(w));
        scenario(w);
      }
    }
  }
};

// --------------------------------------------------------
// Passer hit and target en sunken
// --------------------------------------------------------

const testToBecomeSunken = () => {
  if (myBoard.querySelectorAll("td.hit").length >= 1) {
    for (i = 0; i < myBoard.querySelectorAll("td.hit").length; i++) {
      let temp = [
        myBoard.querySelectorAll("td.hit")[i].id - 1,
        parseInt(myBoard.querySelectorAll("td.hit")[i].id) + 1,
        myBoard.querySelectorAll("td.hit")[i].id - 10,
        parseInt(myBoard.querySelectorAll("td.hit")[i].id) + 10,
      ];
      for (let j = 0; j < temp.length; j++) {
        if (temp[j] < 1 || temp[j] > 100) {
          temp.splice(j, 1);
          j--;
        }
      }

      for (k = 0; k < temp.length; k++) {
        if (
          document.getElementById(`${temp[k]}`).classList.contains("hit") ||
          document.getElementById(`${temp[k]}`).classList.contains("target") ||
          document.getElementById(`${temp[k]}`).classList.contains("sunk")
        ) {
          temp.splice(k, 1, 1);
        } else {
          temp.splice(k, 1, 0);
        }
      }
      const somme = temp.reduce((sum, current) => sum + current, 0);
      if (somme === temp.length) {
        myBoard.querySelectorAll("td.hit")[i].classList.remove("target");
        myBoard.querySelectorAll("td.hit")[i].classList.add("sunk");
        myBoard.querySelectorAll("td.hit")[i].classList.remove("hit");
      } 
    }
  }
};

// --------------------------------------------------------
// Fonction liée au tour de l'ordinateur qui tire et essaye de toucher les navires du joueur
// --------------------------------------------------------

const computerTurn = async (box) => {
  let possibilitiesNearHit = [];
  let possibilities;
  testToBecomeSunken();
  myBoard.querySelectorAll("td.hit").forEach((hit) => {
    if (parseInt(hit.id) % 10 === 1) {
      possibilitiesNearHit.push(
        parseInt(hit.id) + 1,
        hit.id - 10,
        parseInt(hit.id) + 10
      );
    } else if (parseInt(hit.id) % 10 === 0) {
      possibilitiesNearHit.push(
        parseInt(hit.id) - 1,
        hit.id - 10,
        parseInt(hit.id) + 10
      );
    } else {
      possibilitiesNearHit.push(
        parseInt(hit.id) - 1,
        parseInt(hit.id) + 1,
        parseInt(hit.id) - 10,
        parseInt(hit.id) + 10
      );
    }
  });

  for (i = 0; i < possibilitiesNearHit.length; i++) {
    let test = parseInt(possibilitiesNearHit[i]);
    if (test < 1 || test > 100) {
      possibilitiesNearHit.splice(i, 1);
      i--;
    } else if (
      myBoard.querySelectorAll("td")[test - 1].classList.contains("hit") ||
      myBoard.querySelectorAll("td")[test - 1].classList.contains("target") ||
      myBoard.querySelectorAll("td")[test - 1].classList.contains("sunk")
    ) {
      possibilitiesNearHit.splice(i, 1);
      i--;
    }
  }
  possibilitiesNearHit = possibilitiesNearHit.filter((element, index) => {
    return possibilitiesNearHit.indexOf(element) === index;
  });
  possibilitiesNearHit.forEach((cell, index) => {
    possibilitiesNearHit.splice(index, 1, document.getElementById(cell));
  });

  if (
    myBoard.querySelectorAll("td.hit").length > 0 &&
    possibilitiesNearHit.length > 0
  ) {
    possibilities = possibilitiesNearHit;
  } else {
    possibilities = myBoard.querySelectorAll("td:not(.target,.sunk,.hit)");
  }

  const randomIndex = Math.floor(Math.random() * possibilities.length);
  const target = possibilities[randomIndex];
  target.classList.add("target");
  box.innerText = `L'ennemi vise la case ${target.name}.`;
  setTimeout(() => {
    if (target.classList.contains("occupied")) {
      target.style.backgroundColor = "red";
      target.classList.add("hit");
      box.innerText += `\nTouché !`;
    } else {
      target.style.backgroundColor = "lightblue";
      box.innerText += `\nRaté !`;
    }
  }, 3000);
};

// --------------------------------------------------------
// Fonction pour limiter les cellules disponibles au placement d'un navire en fonction de sa direction (i.e. au moins 2 cellules placées)
// --------------------------------------------------------

const directionOfShip = (cell, lastcell) => {
  const idOfFirstCell = parseInt(
    myBoard.querySelectorAll(`.${currentShipName}`)[0].id
  );
  const idOfSecondCell = parseInt(
    myBoard.querySelectorAll(`.${currentShipName}`)[1].id
  );
  const direction = Math.abs(idOfFirstCell - idOfSecondCell);
  if (direction === 10) {
    if (
      parseInt(cell.id) === lastcell + 10 ||
      parseInt(cell.id) === lastcell - 10 ||
      parseInt(cell.id) === idOfFirstCell + 10 ||
      parseInt(cell.id) === idOfFirstCell - 10
    ) {
      cell.classList.add(`occupied`);
      cell.classList.add("deactivated");
      cell.classList.add(`${currentShipName}`);
      cell.removeEventListener("click", actionOnCell);
      shipLength--;
    }
  }
  if (direction === 1) {
    if (
      parseInt(cell.id) === lastcell + 1 ||
      parseInt(cell.id) === lastcell - 1 ||
      parseInt(cell.id) === idOfFirstCell + 1 ||
      parseInt(cell.id) === idOfFirstCell - 1
    ) {
      cell.classList.add(`occupied`);
      cell.classList.add("deactivated");
      cell.classList.add(`${currentShipName}`);
      cell.removeEventListener("click", actionOnCell);
      shipLength--;
    }
  }
};

// --------------------------------------------------------
//Fonction positionnement navires ennemis
// --------------------------------------------------------

const placeEnnemyShips = (numberOfShips, numberOfCells) => {
  for (let i = 0; i < numberOfShips; i++) {
    const ennemyCells = ennemyBoard.querySelectorAll("td:not(.occupied)");
    let firstCell;
    let secondCell;
    let thirdCell;
    let fourthCell;
    let fifthCell;
    let secondCellPossibilities = [];
    sessionStorage.setItem(
      "secondCellPossibilities",
      JSON.stringify(secondCellPossibilities)
    );
    let allCases = [];
    let solution;
    let direction;

    // --------------------------------------------------------
    //Fonction directionOfEnnemyShip
    // --------------------------------------------------------

    const directionOfEnnemyShip = () => {
      let secondCellPossibilities = JSON.parse(
        sessionStorage.getItem("secondCellPossibilities")
      );
      while (secondCellPossibilities.length < 1) {
        firstCell = ennemyCells[Math.floor(Math.random() * ennemyCells.length)];
        const firstCellId = parseInt(firstCell.id);
        if (firstCellId % 10 === 1) {
          secondCellPossibilities.push(
            firstCellId + 1,
            firstCellId - 10,
            firstCellId + 10
          );
        } else if (firstCellId % 10 === 0) {
          secondCellPossibilities.push(
            firstCellId - 1,
            firstCellId - 10,
            firstCellId + 10
          );
        } else {
          secondCellPossibilities.push(
            firstCellId - 1,
            firstCellId + 1,
            firstCellId - 10,
            firstCellId + 10
          );
        }
        secondCellPossibilities = secondCellPossibilities
          .filter((number) => number > 1 && number < 100)
          .filter(
            (number) =>
              !document
                .getElementById(`${number}Ennemy`)
                .classList.contains("occupied")
          );
      }
      sessionStorage.setItem(
        "secondCellPossibilities",
        JSON.stringify(secondCellPossibilities)
      );
      secondCell = document.getElementById(
        `${
          secondCellPossibilities[
            Math.floor(Math.random() * secondCellPossibilities.length)
          ]
        }Ennemy`
      );
      direction = Math.abs(parseInt(firstCell.id) - parseInt(secondCell.id));
    };

    // --------------------------------------------------------
    //Fonction filtrer les cas
    // --------------------------------------------------------
    const filterDifferentCases = (array, numberOfCases) => {
      if (direction === 1) {
        const range = Math.floor(parseInt(firstCell.id) / 10);
        if (range === 0) {
          array = array.filter((number) => number >= 1 && number <= 10);
        } else if (range === 10) {
          array = array.filter((number) => number >= 91 && number <= 100);
        } else if (Number.isInteger(parseInt(firstCell.id) / 10)) {
          array = array.filter(
            (number) => number > range * 10 - 10 && number <= range * 10
          );
        } else {
          array = array.filter(
            (number) => number > range * 10 && number <= range * 10 + 10
          );
        }
      } else {
        array = array.filter((number) => number > 1 && number < 100);
      }
      array = array.filter(
        (id) =>
          !document.getElementById(`${id}Ennemy`).classList.contains("occupied")
      );
      if (array.length === numberOfCases) {
        allCases.push(array);
      }
    };

    switch (numberOfCells) {
      // ----------------------
      // Cas 2
      // ----------------------
      case 2:
        directionOfEnnemyShip();
        break;
      // ----------------------
      // Cas 3
      // ----------------------
      case 3:
        while (allCases.length < 1) {
          allCases = [];
          directionOfEnnemyShip();
          let cas1 = [
            parseInt(firstCell.id) + direction,
            parseInt(firstCell.id) + direction * 2,
          ];
          filterDifferentCases(cas1, 2);
          let cas2 = [
            parseInt(firstCell.id) + direction,
            parseInt(firstCell.id) - direction,
          ];
          filterDifferentCases(cas2, 2);
          let cas3 = [
            parseInt(firstCell.id) - direction,
            parseInt(firstCell.id) - direction * 2,
          ];
          filterDifferentCases(cas3, 2);
          let secondCellPossibilities = JSON.parse(
            sessionStorage.getItem("secondCellPossibilities")
          );
          if (allCases.length < 1 && secondCellPossibilities.length > 0) {
            secondCellPossibilities = [];
            sessionStorage.setItem(
              "secondCellPossibilities",
              JSON.stringify(secondCellPossibilities)
            );
          }
        }
        solution = allCases[Math.floor(Math.random() * allCases.length)];
        secondCell = document.getElementById(`${solution[0]}Ennemy`);
        thirdCell = document.getElementById(`${solution[1]}Ennemy`);
        thirdCell.classList.add("occupied");
        break;
      // ----------------------
      // Cas 4
      // ----------------------
      case 4:
        while (allCases.length < 1) {
          allCases = [];
          directionOfEnnemyShip();
          let cas1 = [
            parseInt(firstCell.id) + direction,
            parseInt(firstCell.id) + direction * 2,
            parseInt(firstCell.id) + direction * 3,
          ];
          filterDifferentCases(cas1, 3);
          let cas2 = [
            parseInt(firstCell.id) + direction,
            parseInt(firstCell.id) + direction * 2,
            parseInt(firstCell.id) - direction,
          ];
          filterDifferentCases(cas2, 3);
          let cas3 = [
            parseInt(firstCell.id) + direction,
            parseInt(firstCell.id) - direction,
            parseInt(firstCell.id) - direction * 2,
          ];
          filterDifferentCases(cas3, 3);
          let cas4 = [
            parseInt(firstCell.id) - direction,
            parseInt(firstCell.id) - direction * 2,
            parseInt(firstCell.id) - direction * 3,
          ];
          filterDifferentCases(cas4, 3);
          let secondCellPossibilities = JSON.parse(
            sessionStorage.getItem("secondCellPossibilities")
          );
          if (allCases.length < 1 && secondCellPossibilities.length > 0) {
            secondCellPossibilities = [];
            sessionStorage.setItem(
              "secondCellPossibilities",
              JSON.stringify(secondCellPossibilities)
            );
          }
        }
        solution = allCases[Math.floor(Math.random() * allCases.length)];
        secondCell = document.getElementById(`${solution[0]}Ennemy`);;
        thirdCell = document.getElementById(`${solution[1]}Ennemy`);
        thirdCell.classList.add("occupied");
        fourthCell = document.getElementById(`${solution[2]}Ennemy`);
        fourthCell.classList.add("occupied");
        break;
      // ----------------------
      // Cas 5
      // ----------------------
      case 5:
        while (allCases.length < 1) {
          allCases = [];
          directionOfEnnemyShip();
          let cas1 = [
            parseInt(firstCell.id) + direction,
            parseInt(firstCell.id) + direction * 2,
            parseInt(firstCell.id) + direction * 3,
            parseInt(firstCell.id) + direction * 4,
          ];
          filterDifferentCases(cas1, 4);
          let cas2 = [
            parseInt(firstCell.id) + direction,
            parseInt(firstCell.id) + direction * 2,
            parseInt(firstCell.id) + direction * 3,
            parseInt(firstCell.id) - direction,
          ];
          filterDifferentCases(cas2, 4);
          let cas3 = [
            parseInt(firstCell.id) + direction,
            parseInt(firstCell.id) + direction * 2,
            parseInt(firstCell.id) - direction,
            parseInt(firstCell.id) - direction * 2,
          ];
          filterDifferentCases(cas3, 4);
          let cas4 = [
            parseInt(firstCell.id) + direction,
            parseInt(firstCell.id) - direction,
            parseInt(firstCell.id) - direction * 2,
            parseInt(firstCell.id) - direction * 3,
          ];
          filterDifferentCases(cas4, 4);
          let cas5 = [
            parseInt(firstCell.id) - direction,
            parseInt(firstCell.id) - direction * 2,
            parseInt(firstCell.id) - direction * 3,
            parseInt(firstCell.id) - direction * 4,
          ];
          filterDifferentCases(cas5, 4);
          let secondCellPossibilities = JSON.parse(
            sessionStorage.getItem("secondCellPossibilities")
          );
          if (allCases.length < 1 && secondCellPossibilities.length > 0) {
            secondCellPossibilities = [];
            sessionStorage.setItem(
              "secondCellPossibilities",
              JSON.stringify(secondCellPossibilities)
            );
          }
        }
        solution = allCases[Math.floor(Math.random() * allCases.length)];
        secondCell = document.getElementById(`${solution[0]}Ennemy`);
        thirdCell = document.getElementById(`${solution[1]}Ennemy`);
        thirdCell.classList.add("occupied");
        fourthCell = document.getElementById(`${solution[2]}Ennemy`);
        fourthCell.classList.add("occupied");
        fifthCell = document.getElementById(`${solution[3]}Ennemy`);
        fifthCell.classList.add("occupied");
        break;
    }
    firstCell.classList.add("occupied");
    secondCell.classList.add("occupied");
  }
};

// --------------------------------------------------------
// Fonction pour créer le tableau
// --------------------------------------------------------

let cellsMyBoard = [];
let cellEnnemyBoard = [];
const createLines = () => {
  let array = cellEnnemyBoard;
  let board = allLinesEnnemyBoard;
  let text = "Ennemy";
  for (let i = 0; i < 2; i++) {
    let cellid = 1;
    for (let j = 0; j < board.length; j++) {
      const currentLine = board[j];
      const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
      for (let k = 0; k < 10; k++) {
        const newCell = document.createElement("td");
        newCell.classList.add("deactivated");
        newCell.id = cellid + text;
        newCell.name = `${letters[k]}${j + 1}`;
        currentLine.appendChild(newCell);
        let newCellObject = {
          id: cellid,
          name: `${letters[k]}${j + 1}`,
        };
        array.push(newCellObject);
        cellid++;
      }
    }
    board = allLinesMyBoard;
    array = cellsMyBoard;
    text = "";
  }
};

// --------------------------------------------------------
// Fonction pour l'ajout de navires au clic sur "ajouter"
// --------------------------------------------------------

const lockButtonsOfMyFleetAndUpdateNumbers = (thisShipName) => {
  shipLength = fleet.find((ship) => ship.name === `${thisShipName}`).cases;
  totalShipLength = shipLength;
  currentShipName = thisShipName;
  const shipAdd = document.getElementById(`add-${thisShipName}`);
  let remaigningShipsToPlace = Math.floor(
    fleet.find((ship) => ship.name === thisShipName).number -
      myBoard.querySelectorAll(`.full${thisShipName}`).length /
        fleet.find((ship) => ship.name === thisShipName).cases -
      1
  );
  const buttons = myFleet.querySelectorAll("button");
  buttons.forEach((button) => button.setAttribute("disabled", true));
  const removeBtn = document.getElementById(`remove-${thisShipName}`);
  removeBtn.removeAttribute("disabled");
  removeBtn.classList.remove("deactivate");
  removeBtn.innerText = "Annuler";
  if (remaigningShipsToPlace === 0) {
    shipAdd.classList.add("deactivate");
  }
  const shipName = document.getElementById(`${thisShipName}-name`);
  shipName.innerText = `${thisShipName} : ${remaigningShipsToPlace}`;

  document.getElementById(
    "msg-box"
  ).innerText = `Les ${thisShipName} font ${shipLength} cases de long.\nCliquez dans votre grille pour placer votre navire.`;
};

// --------------------------------------------------------
// Fonction pour cibler les navires de l'ordinateur
// --------------------------------------------------------

const targetEnnemyShip = async (cell) => {
  if (!cell.classList.contains("deactivated")) {
    document.getElementById(
      "msg-box"
    ).innerText = `Vous visez l'emplacement ${cell.name}.`;
    document
      .getElementById("ennemy-board")
      .querySelectorAll("td")
      .forEach((cell) => cell.classList.add("deactivated"));
    cell.removeEventListener("click", targetEnnemyShip);
    setTimeout(() => {
      if (cell.classList.contains("occupied")) {
        cell.classList.add("hit");
        document.getElementById("msg-box").innerText += `\nTouché !`;
        cell.style.backgroundColor = "red";
      } else {
        cell.classList.add("missed");
        document.getElementById("msg-box").innerText += `\nManqué !`;
        cell.style.backgroundColor = "lightblue";
      }
    }, 2000);
    setTimeout(() => {
      if (ennemyBoard.querySelectorAll("td.hit").length === 30) {
        return scenario("Player victory");
      } else {
        setTimeout(
          () => computerTurn(document.getElementById("msg-box")),
          4500
        );
        setTimeout(() => {
          document
            .getElementById("ennemy-board")
            .querySelectorAll("td")
            .forEach((cell) => cell.classList.remove("deactivated"));
          if (myBoard.querySelectorAll("td.hit, td.sunk").length === 30) {
            return scenario("Computer victory");
          }
        }, 7500);
      }
    }, 2000);
  }
};

// --------------------------------------------------------
// Scénario
// --------------------------------------------------------
const scenario = (w) => {
  const gameInfo = document.getElementById("text-info");
  const nextBtn = document.getElementById("script-go-next");
  switch (w) {
    case 1:
      gameInfo.innerText = "Voici votre zone de déploiement.";
      document.getElementById("boards").classList.remove("hidden");
      document
        .querySelector(".board.hidden:last-of-type")
        .classList.remove("hidden");
      nextBtn.innerText = "Continuer";
      break;
    case 2:
      document.getElementById("my-fleet").style.visibility = "visible";
      gameInfo.innerText =
        "Vous allez pouvoir placer vos navires sur le champ de bataille.";
      nextBtn.classList.add("hidden");

      break;
    case 3:
      myFleet.style.visibility = "hidden";
      gameInfo.innerText = `Tous vos navires sont en place, parés à engager à l'assaut.\nDe l'autre côté, l'ennemi aussi semble s'être préparé.`;
      nextBtn.classList.remove("hidden");
      nextBtn.innerText = "Envoyer un hélicoptère en reconnaissance";
      myBoard.querySelectorAll("td").forEach((cell) => {
        if (!cell.classList.contains("deactivated")) {
          cell.classList.add("deactivated");
        }
      });
      break;
    case 4:
      gameInfo.innerText = `Le brouillard est épais et votre hélicoptère de reconnaissance revient rapidement.\nImpossible de distinguer les navires ennemis.\nAucun doute toutefois, ils sont bien là, devant vous, quelque part.\nLe silence se fait plus lourd.`;
      nextBtn.innerText = "Prendre une grande inspiration";
      document
        .querySelector(".board.hidden:first-of-type")
        .classList.remove("hidden");
      placeEnnemyShips(1, 5);
      placeEnnemyShips(2, 4);
      placeEnnemyShips(3, 3);
      placeEnnemyShips(4, 2);
      break;
    case 5:
      const players = ["Player", "Computer"];
      let firstPlayer = players[Math.floor(Math.random() * 2)];
      sessionStorage.setItem("firstPlayer", JSON.stringify(firstPlayer));
      firstPlayer === "Player"
        ? ((gameInfo.innerText = `Alors que vos pensées s'égaraient dans la brume environnante, la réalité vous frappa : le moment était venu.`),
          (nextBtn.innerText = "Passer à l'attaque"))
        : ((gameInfo.innerText = `Alors que vos pensées s'égaraient dans la brume environnante, vous entendez subitement le sifflement caractéristique d'un obus dans l'air.`),
          (nextBtn.innerText = "Se préparer à l'impact"));
      break;
    case 6:
      resetGame.style.display = "block";
      document.getElementById("card-ships").classList.add("hidden");
      document.getElementById("msg-box").innerText = "";
      nextBtn.classList.add("hidden");
      gameInfo.classList.add("hidden");
      myFleet.style.visibility = "visible";
      let whoIsFirst = JSON.parse(sessionStorage.getItem("firstPlayer"));
      if (whoIsFirst === "Computer") {
        computerTurn(document.getElementById("msg-box"));
      }
      setTimeout(() => {
        ennemyBoard
          .querySelectorAll("td")
          .forEach((cell) => cell.classList.remove("deactivated"));
      }, 2000);
      break;
    case "Player victory":
      document
        .querySelectorAll("td")
        .forEach((cell) => cell.classList.add("deactivated"));
      gameInfo.classList.remove("hidden");
      msgBox.innerText = "";
      gameInfo.innerText = `L'écho de votre dernier tir résonne encore et seul le silence lui répond.\nVous quittez le champ de bataille alors que les derniers navires ennemis sombrent.`;
      break;
    case "Computer victory":
      document
        .querySelectorAll("td")
        .forEach((cell) => cell.classList.add("deactivated"));
      gameInfo.classList.remove("hidden");
      msgBox.innerText = "";
      gameInfo.innerText = `Un dernier tir s'abat sur votre unique navire survivant : c'en est fini.\nLe silence retombe calmement sur les eaux agitées.`;
      break;
  }
};

// --------------------------------------------------------
// Appel des fonctions
// --------------------------------------------------------

createFleets();
createLines();

// --------------------------------------------------------
// EventListeners
// --------------------------------------------------------

document.getElementById("add-Porte-avions").addEventListener("click", () => {
  myBoard
    .querySelectorAll("td:not(.occupied")
    .forEach((cell) => cell.classList.remove("deactivated"));
  lockButtonsOfMyFleetAndUpdateNumbers("Porte-avions");
});

document.getElementById("add-Croiseur").addEventListener("click", () => {
  myBoard
    .querySelectorAll("td:not(.occupied")
    .forEach((cell) => cell.classList.remove("deactivated"));
  lockButtonsOfMyFleetAndUpdateNumbers("Croiseur");
});

document
  .getElementById("add-Contre-torpilleurs")
  .addEventListener("click", () => {
    myBoard
      .querySelectorAll("td:not(.occupied")
      .forEach((cell) => cell.classList.remove("deactivated"));
    lockButtonsOfMyFleetAndUpdateNumbers("Contre-torpilleurs");
  });

document.getElementById("add-Torpilleur").addEventListener("click", () => {
  myBoard
    .querySelectorAll("td:not(.occupied")
    .forEach((cell) => cell.classList.remove("deactivated"));
  lockButtonsOfMyFleetAndUpdateNumbers("Torpilleur");
});

myBoard.querySelectorAll("td").forEach((cell) => {
  cell.addEventListener("click", () => actionOnCell(cell));
});

ennemyBoard.querySelectorAll("td").forEach((cell) =>
  cell.addEventListener("click", () => {
    const w = JSON.parse(sessionStorage.getItem("w"));
    if (w >= 6) {
      targetEnnemyShip(cell);
    }
  })
);

document.getElementById("script-go-next").addEventListener("click", () => {
  let w = JSON.parse(sessionStorage.getItem("w"));
  w++;
  sessionStorage.setItem("w", JSON.stringify(w));
  scenario(w);
});
