/*
- Create a shuffled deck

- User input 1 - 6 players, click "start" to start the game
  -- Players take turns to draw 2 cards face up
  -- Dealer(computer) draw 2 cards: 1st card face up, 2nd card face down
  -- Players take turns to "hit" or "stand" based on their hand:
     --- If player is busted, then block the player
     --- If player click "stand" and total point is <= 21, then wait next player to do "hit" or "stand"
     --- Last player click "stand", reveal dealer's cards and show round results
  
- If player choose "hit":
  -- Player draw 3rd card face up

- If player choose "stand":
  -- Dealer: if Dealer's hand total value < 17, dealer must draw one more card, until the total value is >= 17
  -- Compare the total value of player hand and dealer hand, the highest value wins

- Reset game mode

*/

let gameState = "preGame";
let playerHand = [];
let computerHand = [];
let deck = shuffleCards(makeDeck());

// Create all the cards
function makeDeck() {
  // var makeDeck = function () {
  var cardDeck = [];
  var suits = ["hearts", "diamonds", "clubs", "spades"];
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

// Display player's table
function displayTable(num) {
  return;
}

var main = function (input) {
  if (gameState == "preGame") {
    let numOfPlayer = input;

    displayTable(numOfPlayer);
    const startBtn = document.querySelector("#start-button");
    startBtn.style.display = "none";
    const inputBlk = document.querySelector("#input");
    inputBlk.style.display = "none";
  }
  return myOutputValue;
};
