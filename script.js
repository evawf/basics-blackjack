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
const startBtn = document.querySelector("#start-button");
const playerDiv = document.querySelector("#playerDiv");
const inputDiv = document.querySelector("#inputDiv");
const outputDiv = document.querySelector("#outputDiv");
const playerHandDiv = document.querySelectorAll(".playerHand");
let numOfPlayers = 0;

var main = function (input) {
  let myOutputValue = "";
  if (gameState == "preGame") {
    numOfPlayers = input;
    // Display Players
    for (let i = 1; i <= numOfPlayers; i++) {
      let player = document.createElement("div");
      player.classList.add("playerHand");
      player.innerHTML = `Player ${[i]}`;
      playerDiv.appendChild(player);
      let amount = document.createElement("div");
      amount.innerHTML = "Amount: 100";
      player.appendChild(amount);
      let bet = document.createElement("input");
      bet.type = "number";
      bet.classList.add("bet");
      bet.min = 1;
      bet.max = 100;
      player.appendChild(bet);
    }
    inputDiv.style.display = "none";
    startBtn.style.display = "none";
    newHandBtn.style.display = "inline-block";
  }

  if (gameState == "newHand") {
    const bet = document.querySelectorAll(".bet");
    const playerHandDiv = document.querySelectorAll(".playerHand");

    let betArr = [];
    console.log(bet);
    for (let i = 0; i < bet.length; i++) {
      if (bet[i].value == "") {
        myOutputValue = "Please input your bet!";
      }
      betArr.push(bet[i].value);
      const showBet = document.createElement("div");
      showBet.innerHTML = `Bet: ${bet[i].value}`;
      playerHandDiv[i].appendChild(showBet);
      bet[i].style.display = "none";
    }
    console.log(betArr);
  }

  return myOutputValue;
};

const newHandBtn = document.getElementById("newHandBtn");
newHandBtn.addEventListener("click", function () {
  gameState = "newHand";
  outputDiv.innerHTML = main(inputDiv.value);
});
