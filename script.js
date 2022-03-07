/*
- Create a shuffled deck

- User input 1 - 6 players, click "start" to start
  -- Input players' names, and show the game table
  -- Players take turn to input their bets
  -- Click "start round" to start play
  -- Draw two cards for each player(face up) and dealer,  one of dealer's card face down
  -- Players take turns to "hit" or "stand" based on their hand:
     --- If player is busted, then block the player
     --- If player clicks "stand" and compute total point, if it is <= 21, then wait next player to do "hit" or "stand"
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

var main = function (input) {
  if (gameState == "inputNumOfPlayers") return enterPlayerCount(input);
  if (gameState == "enterPlayersName") return enterPlayersName(input);
  if (gameState == "deal") return deal();
  if (gameState == "hit") return computePoint();
};

function displayHand(hand, isDealer) {
  let point = 0;
  let cardImg = "";

  if (isDealer == "yes") {
    for (let i = 0; i < hand.length - 1; i++) {
      point += hand[i].rank;
      cardImg += `<img src="${hand[i].img}" />`;
    }
    cardImg += `<img src="imgs/cardback.svg" />`;
    if (gameState == "stand") {
      return `Dealer Hand<br>Point:${point}<br>${cardImg}<br><hr>Players Hand: `;
    }
    return `Dealer Hand<br><br>${cardImg}<br><hr>Players Hand: `;
  }
  if (isDealer == "no") {
    for (let i = 0; i < hand.length; i++) {
      point += hand[i].rank;
      cardImg += `<img src="${hand[i].img}" />`;
    }
    return `Point: ${point}<br>${cardImg}`;
  }
}

// Distribute cards to dealer and players hand
function deal() {
  dealBtn.style.display = "none";
  hitBtn.style.display = "inline-block";
  standBtn.style.display = "inline-block";
  restartBtn.style.display = "inline-block";

  computerHandArr.push(deck.pop());
  computerHandArr.push(deck.pop());

  const dealerHandDiv = document.getElementById("dealerHandDiv");
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
  const playerHandDiv = document.getElementById("playerHandDiv");

  for (let i = 0; i < playerArr.length; i++) {
    const handDiv = document.createElement("div");
    handDiv.id = `Player${i}`;
    handDiv.classList.add("playerHand");
    handDiv.innerHTML = `<br>${playerArr[i].name}<br>${displayHand(
      playerArr[i].hand,
      "no"
    )}`;
    playerHandDiv.appendChild(handDiv);
  }

  return `Please click "Hit" or "Stand". <br> `;
}

// Enter Players' Name
function enterPlayersName(input) {
  inputField.type = "text";
  inputField.placeholder = `Name`;
  if (input) {
    playerNamesArr[playerNum] = input;
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

// Enter how many players
function enterPlayerCount(input) {
  numOfPlayers = Number(input);
  gameState = "enterPlayersName";
  return (
    `Welcome to Rocket Blackjack Table! <br>We have ${numOfPlayers} players joining this table.<hr>` +
    enterPlayersName()
  );
}
