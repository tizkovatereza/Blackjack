// Create the deck of cards
const suits = ["Hearts", "Diamonds", "Spades", "Clubs"];
const values = [
  "Ace",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "Jack",
  "Queen",
  "King",
];
let deck = [];

for (let suit of suits) {
  for (let value of values) {
    deck.push({ suit, value });
  }
}

// Define the card value function
function cardValue(card) {
  if (["Jack", "Queen", "King"].includes(card.value)) {
    return 10;
  } else if (card.value === "Ace") {
    return 11;
  } else {
    return parseInt(card.value);
  }
}

// Shuffle the deck
for (let i = deck.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [deck[i], deck[j]] = [deck[j], deck[i]];
}

// Deal the initial cards
let playerCards = [deck.pop(), deck.pop()];
let dealerCards = [deck.pop(), deck.pop()];

// Game loop
while (true) {
  let playerScore = playerCards.reduce(
    (score, card) => score + cardValue(card),
    0,
  );
  let dealerScore = dealerCards.reduce(
    (score, card) => score + cardValue(card),
    0,
  );

  console.log(
    `Your cards are ${playerCards
      .map((card) => card.value)
      .join(", ")} and your score is ${playerScore}`,
  );
  console.log(`The dealer's first card is ${dealerCards[0].value}`);

  let choice = prompt("Do you want to hit or stand? (h/s): ");

  if (choice === "h") {
    playerCards.push(deck.pop());
    if (playerScore > 21) {
      console.log(
        `Your cards are ${playerCards
          .map((card) => card.value)
          .join(", ")} and your score is ${playerScore}`,
      );
      console.log(
        `The dealer's cards are ${dealerCards
          .map((card) => card.value)
          .join(", ")} and their score is ${dealerScore}`,
      );
      console.log("You lose!");
      break;
    }
  } else if (choice === "s") {
    while (dealerScore < 17) {
      dealerCards.push(deck.pop());
      dealerScore = dealerCards.reduce(
        (score, card) => score + cardValue(card),
        0,
      );
    }
    console.log(
      `Your cards are ${playerCards
        .map((card) => card.value)
        .join(", ")} and your score is ${playerScore}`,
    );
    console.log(
      `The dealer's cards are ${dealerCards
        .map((card) => card.value)
        .join(", ")} and their score is ${dealerScore}`,
    );
    if (dealerScore > 21) {
      console.log("You win!");
      break;
    } else if (dealerScore > playerScore) {
      console.log("You lose!");
      break;
    } else if (dealerScore < playerScore) {
      console.log("You win!");
      break;
    } else {
      console.log("It's a tie!");
      break;
    }
  } else {
    console.log("Please enter a valid input!");
    continue;
  }
}
