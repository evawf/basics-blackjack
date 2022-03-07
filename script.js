/*
- Create a shuffled deck

- User input 1 - 6 players, click "start" to start
  -- Input players' names, and show the game table
  -- Players take turn to input their bets
  -- Click "start round" to start play
  -- Draw two cards for each player(face up) and dealer,  one of dealer's card face down
  -- Players take turns to "hit" or "stand" based on their hand:
     --- If player is busted, then block the player
     --- If player clicks "stand" and compute total points, if it is <= 21, then wait next player to do "hit" or "stand"
     --- Last player click "stand"(unless the last player has blackjack, then skip "hit" or "stand"), reveal dealer's cards and show round results
     --- If player has blackjack, player wins 1.5 times bet
  
- If player choose "hit":
  -- Player draw one or more card, until the total points is as high as possible but <= 21
  -- If player's point >21, then busted, block player

- If player choose "stand":
  -- Dealer: if Dealer's hand total value < 17, dealer must draw one more card, until the total value is >= 17
  -- Compare the total value of player hand and dealer hand, the highest value wins
  -- Compute the winning points for each player

- Reset game mode
*/

let gameState = "inputNumOfPlayers";
let deck = shuffleCards(makeDeck());

// Create all the cards
function makeDeck() {
  // var makeDeck = function () {
  var cardDeck = [];
  var suits = ["hearts", "diamonds", "clubs", "spades"];
  // var suits = ["♥️", "♦️", "♣️", "♠️"];
  var suitIdx = 0;
  while (suitIdx < suits.length) {
    var rankCounter = 1;
    var currentSuit = suits[suitIdx];
    while (rankCounter < 14) {
      var cardName = rankCounter;
      var cardRank = rankCounter;
      if (rankCounter == 1) cardName = "ace";
      if (rankCounter == 11) {
        cardName = "jack";
        cardRank = 10;
      }
      if (rankCounter == 12) {
        cardName = "queen";
        cardRank = 10;
      }
      if (rankCounter == 13) {
        cardName = "king";
        cardRank = 10;
      }

      var card = {
        name: cardName,
        suit: currentSuit,
        rank: cardRank,
        img: "imgs/" + `${cardName}` + "_of_" + `${currentSuit}` + ".png",
      };

      cardDeck.push(card);
      rankCounter += 1;
    }
    suitIdx += 1;
  }
  return cardDeck;
}

// Generate random index
function getRandomIndex(max) {
  return Math.floor(Math.random() * max);
}

// Shuffle card deck
function shuffleCards(cardDeck) {
  let currentIdx = 0;
  while (currentIdx < cardDeck.length) {
    let currentCard = cardDeck[currentIdx];
    let randomIdx = getRandomIndex(cardDeck.length);
    let randomCard = cardDeck[randomIdx];
    // Swap cards
    cardDeck[currentIdx] = randomCard;
    cardDeck[randomIdx] = currentCard;
    currentIdx += 1;
  }
  return cardDeck;
}

let playerNamesArr = [];
let numOfPlayers = 0;
let playerNum = 0;
let computerHandArr = [];
let playerArr = [];
let player = {
  name: "",
  hand: [],
};
const inputField = document.getElementById("inputField");
const hitBtn = document.getElementById("hitBtn");
const standBtn = document.getElementById("standBtn");
const restartBtn = document.getElementById("restartBtn");
const playerHandDiv = document.getElementById("playerHandDiv");
const dealerHandDiv = document.getElementById("dealerHandDiv");

restartBtn.addEventListener("click", function () {
  location.reload();
});

hitBtn.addEventListener("click", function () {
  gameState = "hit";
  outputDiv.innerHTML = main();
});

standBtn.addEventListener("click", function () {
  gameState = "stand";
  outputDiv.innerHTML = main();
});

// Enter how many players
function enterPlayerCount(input) {
  if (input != "") {
    numOfPlayers = Number(input.trim());
    gameState = "enterPlayersName";
    return (
      `Welcome to Rocket Blackjack Table! <br>We have ${numOfPlayers} players joining this table.<hr>` +
      enterPlayersName()
    );
  } else {
    return "Please enter a number from 1 to 6!";
  }
}

// Enter Players' Name
function enterPlayersName(input) {
  inputField.type = "text";
  inputField.placeholder = `Name`;
  if (input) {
    playerNamesArr[playerNum] = input.trim();
    if (playerNum === numOfPlayers - 1) {
      gameState = "deal";
      dealBtn.style.display = "inline-block";
      inputField.style.display = "none";
      return `Click "Deal" to play!`;
    }
    playerNum += 1;
  }
  return `Please enter player ${playerNum + 1}'s name`;
}

// Distribute cards to dealer and players hand
function deal() {
  dealBtn.style.display = "none";
  hitBtn.style.display = "inline-block";
  standBtn.style.display = "inline-block";
  restartBtn.style.display = "inline-block";

  computerHandArr.push(deck.pop());
  computerHandArr.push(deck.pop());

  // const dealerHandDiv = document.getElementById("dealerHandDiv");
  dealerHandDiv.innerHTML = displayHand(computerHandArr, "yes");

  let playerCardArr = [];
  let playerIdx = 0;
  while (playerIdx < numOfPlayers) {
    player.name = playerNamesArr[playerIdx];
    playerCardArr.push(deck.pop());
    playerCardArr.push(deck.pop());
    player.hand = playerCardArr;
    playerArr.push(player);
    player = {};
    playerCardArr = [];
    playerIdx += 1;
  }
  console.log(computerHandArr);
  console.log(playerArr);
  // const playerHandDiv = document.getElementById("playerHandDiv");

  for (let i = 0; i < playerArr.length; i++) {
    const handDiv = document.createElement("div");
    handDiv.id = `player${i}`;
    handDiv.classList.add("playerHand");
    handDiv.innerHTML = `<br>${playerArr[i].name}<br>${displayHand(
      playerArr[i].hand,
      "no"
    )}`;
    playerHandDiv.appendChild(handDiv);
  }
  const playerOne = document.getElementById("player0");
  playerOne.style.border = "solid";
  return `${playerArr[0].name}, please click "Hit" or "Stand". <br> `;
}

// Calculate Dealer or Players' Point
function computePoints(hand) {
  // Ace is 11
  let points = 0;
  for (let i = 0; i < hand.length; i++) {
    let currentValue = hand[i].rank;
    if (currentValue === 1) currentValue = 11;
    points += currentValue;
  }
  if (points <= 21) {
    return points;
  } else {
    points = 0;
    for (let i = 0; i < hand.length; i++) {
      points += hand[i].rank;
    }
    return points;
  }
}

// Displayer Dealer and Player's Hand
function displayHand(hand, isDealer) {
  let cardImg = "";
  if (isDealer == "yes") {
    // Reveal Dealer Hand
    if (gameState == "stand") {
      for (let i = 0; i < hand.length; i++) {
        cardImg += `<img src="${hand[i].img}" />`;
      }
      return `Dealer Hand<br>Point: ${computePoints(
        hand
      )}<br>${cardImg}<br><hr>Players Hand: `;
    }
    // Hide Dealer's second card;
    for (let i = 0; i < hand.length - 1; i++) {
      cardImg += `<img src="${hand[i].img}" />`;
    }
    cardImg += `<img src="imgs/cardback.svg" />`;
    return `Dealer Hand<br><br>${cardImg}<br><hr>Players Hand: `;
  }
  if (isDealer == "no") {
    for (let i = 0; i < hand.length; i++) {
      cardImg += `<img src="${hand[i].img}" />`;
    }
    return `Point: ${computePoints(hand)}<br>${cardImg}`;
  }
}

let playerIdx = 0;
const playerHandDivs = document.getElementsByClassName("playerHand");
var main = function (input) {
  if (gameState == "inputNumOfPlayers") return enterPlayerCount(input);
  if (gameState == "enterPlayersName") return enterPlayersName(input);
  if (gameState == "deal") return deal();

  if (gameState == "hit") {
    let crtPlayerHand = playerArr[playerIdx].hand;
    crtPlayerHand.push(deck.pop());
    playerArr[playerIdx].hand = crtPlayerHand;
    let crtPlayerPoints = computePoints(playerArr[playerIdx].hand);
    playerHandDivs[playerIdx].innerHTML = `<br>${
      playerArr[playerIdx].name
    }<br>${displayHand(playerArr[playerIdx].hand, "no")}`;

    if (crtPlayerPoints > 21) {
      hitBtn.style.display = "none";
      playerHandDivs[playerIdx].style.filter = "blur(0.6px)";
      playerHandDivs[playerIdx].style.border = "none";
      return `${playerArr[playerIdx].name}, you are busted.`;
    }
    return `${playerArr[playerIdx].name}, you chose to hit.`;
  }

  if (gameState == "stand") {
    hitBtn.style.display = "inline-block";
    if (playerIdx === playerArr.length - 1) {
      playerHandDivs[playerIdx].style.border = "none";
      hitBtn.style.display = "none";
      standBtn.style.display = "none";
      let dealerHandPoints = revealDealerHand(computerHandArr);
      for (let i = 0; i < playerArr.length; i++) {
        playerArr[i].points = computePoints(playerArr[i].hand);
      }
      return handleRoundResult(dealerHandPoints, playerArr);
    }
    playerIdx += 1;
    playerHandDivs[playerIdx].style.border = "solid";
    playerHandDivs[playerIdx - 1].style.border = "none";
    return `${playerArr[playerIdx - 1].name} chose stand, ${
      playerArr[playerIdx].name
    }'s turn`;
  }
};

function revealDealerHand(hand) {
  let dealerPoints = computePoints(hand);
  while (dealerPoints < 17) {
    hand.push(deck.pop());
    dealerPoints = computePoints(hand);
  }
  dealerHandDiv.innerHTML = displayHand(hand, "yes");
  return dealerPoints;
}

function handleRoundResult(dealerHandPoints, playersHand) {
  let outputStr = "";
  let crtPlayerPoints = 0;
  // If dealer is busted
  if (dealerHandPoints > 21) {
    outputStr = `Dealer is busted.<br>`;
    for (let i = 0; i < playersHand.length; i++) {
      crtPlayerPoints = playersHand[i].points;
      console.log(crtPlayerPoints);
      if (crtPlayerPoints > 21) {
        playersHand[i].winOrLoose -= 1;
        outputStr += `${playersHand[i].name} has ${crtPlayerPoints} points, got busted, 1 chip lost!<br>`;
      } else if (crtPlayerPoints <= 21) {
        playersHand[i].winOrLoose += 1;
        outputStr += `${playersHand[i].name} has ${crtPlayerPoints} points, win 1 chip.<br>`;
      }
    }
  }
  // If dealer points <= 21
  if (dealerHandPoints <= 21) {
    outputStr = `Dealer has ${dealerHandPoints} points.<br>`;
    for (let i = 0; i < playersHand.length; i++) {
      crtPlayerPoints = playersHand[i].points;
      console.log(crtPlayerPoints);
      if (crtPlayerPoints > 21) {
        playersHand[i].winOrLoose -= 1;
        outputStr += `${playersHand[i].name} has ${crtPlayerPoints} points, got busted, 1 chip lost!<br>`;
      } else if (crtPlayerPoints < dealerHandPoints) {
        playersHand[i].winOrLoose -= 1;
        outputStr += `${playersHand[i].name} has ${crtPlayerPoints} points, 1 chip lost!<br>`;
      } else if (crtPlayerPoints > dealerHandPoints) {
        playersHand[i].winOrLoose += 1;
        outputStr += `${playersHand[i].name} has ${crtPlayerPoints} points, win 1 chip.<br>`;
      } else {
        outputStr += `${playersHand[i].name} has ${crtPlayerPoints} points, got 0 chip.<br>`;
      }
    }
  }

  console.log(playersHand);
  console.log(playerArr);

  return outputStr;
}
